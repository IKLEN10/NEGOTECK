<?php
require_once __DIR__ . '/../config/Database.php';

/**
 * Usuarios activos en tiempo real.
 *
 * No hay conexión persistente (WebSockets) en este proyecto, así que la
 * "actividad en tiempo real" se aproxima con el patrón estándar de
 * heartbeat: el frontend manda una señal periódica (ver
 * `usePresencia` / `servicioPresencia.js`) con un id de sesión por
 * pestaña, y aquí se cuenta cuántos ids distintos tuvieron actividad en
 * los últimos `VENTANA_ACTIVOS_SEGUNDOS`. Sirve tanto para visitantes
 * anónimos como para usuarios con sesión iniciada.
 */
class Presencia
{
    private const VENTANA_ACTIVOS_SEGUNDOS = 90;
    private const RETENCION_HORAS = 24;

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
