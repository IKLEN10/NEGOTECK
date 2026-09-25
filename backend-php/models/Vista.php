<?php
require_once __DIR__ . '/../config/Database.php';

/**
 * Registro de vistas por sesión de navegador (tabla `vistas`,
 * ver bd/migracion_vistas.sql).
 *
 * Regla única para todo el sitio: una sesión (pestaña) cuenta como
 * máximo UNA vez por recurso. La sesión termina al cerrar la pestaña,
 * así que recargar o navegar entre secciones no vuelve a contar,
 * pero cerrar y volver a entrar sí.
 *
 * Tipos de recurso actuales:
 *  - 'sitio'       → visitas al sitio ("Vistas totales" del menú).
 *  - 'publicacion' → vistas de cada publicación.
 * Un tipo nuevo (por ejemplo, el comité) solo necesita su propia
 * constante; la tabla y esta lógica no cambian.
 */
class Vista
{
    public const TIPO_SITIO = 'sitio';
    public const TIPO_PUBLICACION = 'publicacion';

    private PDO $conexion;

    public function __construct()
    {
        $this->conexion = Database::obtenerConexion();
    }

    /**
     * El id lo genera el frontend (crypto.randomUUID o respaldo
     * "s-<tiempo>-<hex>"); solo se aceptan letras, números y guiones.
     */
    public static function idSesionValido(string $idSesion): bool
    {
        return (bool) preg_match('/^[A-Za-z0-9\-]{8,64}$/', $idSesion);
    }

    /**
     * Registra la vista si esa sesión aún no había visto ese recurso.
     * Devuelve true solo cuando es una vista NUEVA (se insertó la fila);
     * false si ya existía. La llave única de la tabla hace que esto sea
     * seguro aunque lleguen dos peticiones simultáneas.
     */
    public function registrar(string $tipoRecurso, int $idRecurso, string $idSesion): bool
    {
        $sentencia = $this->conexion->prepare('
            INSERT IGNORE INTO vistas (tipo_recurso, id_recurso, id_sesion)
            VALUES (:tipo, :id_recurso, :id_sesion)
        ');
        $sentencia->execute([
            'tipo'       => $tipoRecurso,
            'id_recurso' => $idRecurso,
            'id_sesion'  => $idSesion,
        ]);

        return $sentencia->rowCount() === 1;
    }

    /**
     * Total de vistas de un tipo; si se indica $idRecurso, solo las
     * de ese recurso.
     */
    public function contar(string $tipoRecurso, ?int $idRecurso = null): int
    {
        $sql = 'SELECT COUNT(*) FROM vistas WHERE tipo_recurso = :tipo';
        $parametros = ['tipo' => $tipoRecurso];

        if ($idRecurso !== null) {
            $sql .= ' AND id_recurso = :id_recurso';
            $parametros['id_recurso'] = $idRecurso;
        }

        $sentencia = $this->conexion->prepare($sql);
        $sentencia->execute($parametros);
        return (int) $sentencia->fetchColumn();
    }
}
