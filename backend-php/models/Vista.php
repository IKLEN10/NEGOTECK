<?php
require_once __DIR__ . '/../config/Database.php';

/**
 * Decide si una vista cuenta o no (tabla `vistas`, ver
 * bd/migracion_vistas.sql). Regla única para todo el sitio:
 *
 *  1. La misma persona cuenta como máximo UNA vez por recurso cada
 *     VENTANA_HORAS horas, sin importar cuántas pestañas abra, si
 *     recarga o si cierra y vuelve a entrar.
 *  2. La persona se reconoce por el identificador guardado en su
 *     navegador (localStorage), compartido por todas sus pestañas.
 *     Así, varias personas en la misma red (Wi-Fi de la universidad)
 *     cuentan por separado.
 *  3. La IP (cifrada) es respaldo y freno:
 *     - si la petición no trae identificador (bots, llamadas directas,
 *       navegador sin almacenamiento), se usa la IP con la misma ventana;
 *     - una misma IP no puede sumar más de LIMITE_POR_IP vistas de un
 *       mismo recurso por ventana (frena a quien abre incógnito o borra
 *       datos una y otra vez para inflar el número).
 *
 * El contador que se muestra (publicaciones.visitas o contador_sitio)
 * se incrementa dentro de la misma transacción, solo si la vista es
 * nueva, a través del callback $alContar. Un recurso nuevo (por
 * ejemplo, el comité) solo necesita su constante y su contador.
 */
class Vista
{
    public const TIPO_SITIO = 'sitio';
    public const TIPO_PUBLICACION = 'publicacion';

    private const VENTANA_HORAS = 2;
    private const LIMITE_POR_IP = 50;

    private PDO $conexion;

    public function __construct()
    {
        $this->conexion = Database::obtenerConexion();
    }

    /**
     * El id lo genera el frontend (crypto.randomUUID o respaldo
     * "v-<tiempo>-<hex>"); solo se aceptan letras, números y guiones.
     */
    public static function idValido(?string $id): bool
    {
        return $id !== null && (bool) preg_match('/^[A-Za-z0-9\-]{8,64}$/', $id);
    }

    /**
     * Registra la vista si corresponde y, en ese caso, ejecuta $alContar
     * (el incremento del contador visible) en la misma transacción.
     * Devuelve true solo si la vista contó.
     */
    public function registrar(string $tipoRecurso, int $idRecurso, ?string $idVisitante, callable $alContar): bool
    {
        $idVisitante = self::idValido($idVisitante) ? $idVisitante : null;
        $ipHash      = self::hashIpActual();

        if ($idVisitante === null && $ipHash === null) {
            return false;
        }

        // Candado por visitante + recurso: si llegan dos peticiones
        // al mismo tiempo (dos pestañas, doble clic, React en modo
        // desarrollo), la segunda espera a la primera y ya ve su registro.
        $candado = 'negoteck_vistas_' . md5(
            $tipoRecurso . '|' . $idRecurso . '|' . ($idVisitante ?? 'ip:' . $ipHash)
        );

        if (! $this->obtenerCandado($candado)) {
            return false;
        }

        try {
            $this->conexion->beginTransaction();
            try {
                $cuenta = ! $this->tieneVistaReciente($tipoRecurso, $idRecurso, $idVisitante, $ipHash)
                    && ! $this->superaLimitePorIp($tipoRecurso, $idRecurso, $ipHash);

                if ($cuenta) {
                    $this->insertar($tipoRecurso, $idRecurso, $idVisitante, $ipHash);
                    $alContar();
                }

                $this->conexion->commit();
            } catch (Throwable $error) {
                if ($this->conexion->inTransaction()) {
                    $this->conexion->rollBack();
                }
                throw $error;
            }

            return $cuenta;
        } finally {
            $this->liberarCandado($candado);
        }
    }

    private function tieneVistaReciente(string $tipo, int $idRecurso, ?string $idVisitante, ?string $ipHash): bool
    {
        if ($idVisitante !== null) {
            $sql = 'id_visitante = :clave';
            $clave = $idVisitante;
        } else {
            // Sin identificador: se compara solo contra otras vistas que
            // tampoco lo traían, para no mezclar a quienes comparten red.
            $sql = 'id_visitante IS NULL AND ip_hash = :clave';
            $clave = $ipHash;
        }

        $sentencia = $this->conexion->prepare("
            SELECT 1 FROM vistas
            WHERE tipo_recurso = :tipo
              AND id_recurso = :id_recurso
              AND {$sql}
              AND fecha >= DATE_SUB(NOW(), INTERVAL :horas HOUR)
            LIMIT 1
        ");
        $sentencia->execute([
            'tipo'       => $tipo,
            'id_recurso' => $idRecurso,
            'clave'      => $clave,
            'horas'      => self::VENTANA_HORAS,
        ]);

        return $sentencia->fetchColumn() !== false;
    }

    private function superaLimitePorIp(string $tipo, int $idRecurso, ?string $ipHash): bool
    {
        if ($ipHash === null) {
            return false;
        }

        $sentencia = $this->conexion->prepare('
            SELECT COUNT(*) FROM vistas
            WHERE tipo_recurso = :tipo
              AND id_recurso = :id_recurso
              AND ip_hash = :ip_hash
              AND fecha >= DATE_SUB(NOW(), INTERVAL :horas HOUR)
        ');
        $sentencia->execute([
            'tipo'       => $tipo,
            'id_recurso' => $idRecurso,
            'ip_hash'    => $ipHash,
            'horas'      => self::VENTANA_HORAS,
        ]);

        return (int) $sentencia->fetchColumn() >= self::LIMITE_POR_IP;
    }

    private function insertar(string $tipo, int $idRecurso, ?string $idVisitante, ?string $ipHash): void
    {
        $sentencia = $this->conexion->prepare('
            INSERT INTO vistas (tipo_recurso, id_recurso, id_visitante, ip_hash)
            VALUES (:tipo, :id_recurso, :id_visitante, :ip_hash)
        ');
        $sentencia->execute([
            'tipo'         => $tipo,
            'id_recurso'   => $idRecurso,
            'id_visitante' => $idVisitante,
            'ip_hash'      => $ipHash,
        ]);
    }

    /**
     * IP de quien hace la petición, cifrada con SHA-256 y una "sal".
     * Permite comparar si dos vistas vienen de la misma red sin guardar
     * la IP real. Para producción conviene definir VISTAS_SAL en
     * config/config.php con un texto propio.
     */
    private static function hashIpActual(): ?string
    {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '';
        if (filter_var($ip, FILTER_VALIDATE_IP) === false) {
            return null;
        }

        $sal = defined('VISTAS_SAL') ? VISTAS_SAL : 'negoteck-vistas';
        return hash('sha256', $sal . '|' . $ip);
    }

    private function obtenerCandado(string $nombre): bool
    {
        $sentencia = $this->conexion->prepare('SELECT GET_LOCK(:nombre, 5)');
        $sentencia->execute(['nombre' => $nombre]);
        return (int) $sentencia->fetchColumn() === 1;
    }

    private function liberarCandado(string $nombre): void
    {
        $sentencia = $this->conexion->prepare('SELECT RELEASE_LOCK(:nombre)');
        $sentencia->execute(['nombre' => $nombre]);
    }
}
