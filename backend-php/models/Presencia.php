<?php
require_once __DIR__ . '/../config/Database.php';

/**
 * Usuarios activos en tiempo real.
 *
 * No hay conexión persistente (WebSockets) en este proyecto, así que la
 * "actividad en tiempo real" se aproxima con el patrón estándar de
 * heartbeat: el frontend manda una señal periódica (ver
 * `usePresencia` / `servicioPresencia.js`) con el id de visitante del
 * navegador (compartido por todas sus pestañas), y aquí se cuenta
 * cuántos ids distintos tuvieron actividad en los últimos
 * `VENTANA_ACTIVOS_SEGUNDOS`. Sirve tanto para visitantes anónimos como
 * para usuarios con sesión iniciada.
 *
 * Al cerrar la última pestaña del sitio, el frontend manda una señal de
 * salida (ver `salir()`), así la persona deja de contar en segundos. La
 * ventana de 90 s queda como respaldo para cuando esa señal no alcanza a
 * salir (navegador cerrado de golpe, sin internet, equipo apagado).
 */
class Presencia
{
    private const VENTANA_ACTIVOS_SEGUNDOS = 90;
    private const RETENCION_HORAS = 24;
    private const MARGEN_SALIDA_SEGUNDOS = 2;

    private PDO $conexion;

    public function __construct()
    {
        $this->conexion = Database::obtenerConexion();
    }

    public function registrar(string $idSesion, ?int $idUsuario = null): void
    {
        $sentencia = $this->conexion->prepare('
            INSERT INTO sesiones_activas (id_sesion, id_usuario, ultima_actividad)
            VALUES (:id_sesion, :id_usuario, NOW())
            ON DUPLICATE KEY UPDATE
                ultima_actividad = NOW(),
                id_usuario = COALESCE(:id_usuario_actualiza, id_usuario)
        ');
        $sentencia->execute([
            'id_sesion' => $idSesion,
            'id_usuario' => $idUsuario,
            'id_usuario_actualiza' => $idUsuario,
        ]);

        // Limpieza oportunista: evita que la tabla crezca sin límite sin
        // necesitar una tarea programada (cron) aparte.
        $this->conexion
            ->prepare('DELETE FROM sesiones_activas WHERE ultima_actividad < DATE_SUB(NOW(), INTERVAL :horas HOUR)')
            ->execute(['horas' => self::RETENCION_HORAS]);
    }

    /**
     * Quita la presencia de un visitante al cerrar el sitio.
     *
     * Solo borra si su última señal tiene al menos MARGEN_SALIDA_SEGUNDOS:
     * al recargar la página, la señal de "me voy" de la página anterior
     * podría procesarse justo después del "llegué" de la nueva; con este
     * margen no se borra a alguien que acaba de volver.
     */
    public function salir(string $idSesion): void
    {
        $sentencia = $this->conexion->prepare('
            DELETE FROM sesiones_activas
            WHERE id_sesion = :id_sesion
              AND ultima_actividad < DATE_SUB(NOW(), INTERVAL :margen SECOND)
        ');
        $sentencia->execute([
            'id_sesion' => $idSesion,
            'margen'    => self::MARGEN_SALIDA_SEGUNDOS,
        ]);
    }

    public function contarActivas(): int
    {
        $sentencia = $this->conexion->prepare('
            SELECT COUNT(*) FROM sesiones_activas
            WHERE ultima_actividad >= DATE_SUB(NOW(), INTERVAL :segundos SECOND)
        ');
        $sentencia->execute(['segundos' => self::VENTANA_ACTIVOS_SEGUNDOS]);
        return (int) $sentencia->fetchColumn();
    }
}
