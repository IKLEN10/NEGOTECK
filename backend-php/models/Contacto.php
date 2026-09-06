<?php
require_once __DIR__ . '/../config/Database.php';

/**
 * Guarda los mensajes enviados desde el formulario de contacto
 * de la página principal en la tabla `mensajes_contacto`.
 */
class Contacto
{
    private PDO $conexion;

    public function __construct()
    {
        $this->conexion = Database::obtenerConexion();
    }

    public function guardar(string $nombre, string $correo, string $asunto, string $mensaje): int
    {
        $sql = '
            INSERT INTO mensajes_contacto (nombre, correo, asunto, mensaje)
            VALUES (:nombre, :correo, :asunto, :mensaje)
        ';

        $consulta = $this->conexion->prepare($sql);
        $consulta->execute([
            ':nombre' => $nombre,
            ':correo' => $correo,
            ':asunto' => $asunto,
            ':mensaje' => $mensaje,
        ]);

        return (int) $this->conexion->lastInsertId();
    }
}
