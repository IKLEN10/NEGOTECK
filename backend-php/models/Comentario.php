<?php
require_once __DIR__ . '/../config/Database.php';

/**
 * Acceso a datos de la tabla `comentarios`.
 *
 * Sistema sencillo: solo lectura por publicación y creación por un
 * usuario autenticado (sin respuestas, reacciones ni edición). Reutiliza
 * la tabla `comentarios` que ya existía en el esquema SQL original.
 */
class Comentario
{
    private PDO $conexion;

    public function __construct()
    {
        $this->conexion = Database::obtenerConexion();
    }

    /**
     * Comentarios visibles de una publicación, del más antiguo al más
     * reciente (para leerse como una conversación de arriba hacia abajo).
     */
    public function obtenerPorPublicacion(int $idPublicacion): array
    {
        $sql = '
            SELECT
                c.id_comentario,
                c.contenido,
                c.fecha_registro,
                u.id_usuario,
                u.nombre,
                u.apellidos,
                u.foto_perfil
            FROM comentarios c
            INNER JOIN usuarios u ON u.id_usuario = c.id_usuario
            WHERE c.id_publicacion = :id_publicacion
              AND c.activo = 1
            ORDER BY c.fecha_registro ASC
        ';

        $consulta = $this->conexion->prepare($sql);
        $consulta->execute([':id_publicacion' => $idPublicacion]);

        return array_map([$this, 'mapearFila'], $consulta->fetchAll());
    }

    public function crear(int $idPublicacion, int $idUsuario, string $contenido): array
    {
        $sql = '
            INSERT INTO comentarios (id_publicacion, id_usuario, contenido)
            VALUES (:id_publicacion, :id_usuario, :contenido)
        ';

        $consulta = $this->conexion->prepare($sql);
        $consulta->execute([
            ':id_publicacion' => $idPublicacion,
            ':id_usuario' => $idUsuario,
            ':contenido' => $contenido,
        ]);

        $idComentario = (int) $this->conexion->lastInsertId();

        return $this->obtenerPorId($idComentario);
    }

    public function obtenerPorId(int $idComentario): array
    {
        $sql = '
            SELECT
                c.id_comentario,
                c.contenido,
                c.fecha_registro,
                u.id_usuario,
                u.nombre,
                u.apellidos,
                u.foto_perfil
            FROM comentarios c
            INNER JOIN usuarios u ON u.id_usuario = c.id_usuario
            WHERE c.id_comentario = :id
            LIMIT 1
        ';

        $consulta = $this->conexion->prepare($sql);
        $consulta->execute([':id' => $idComentario]);
        $fila = $consulta->fetch();

        return $this->mapearFila($fila);
    }

    /**
     * Solo se permite comentar publicaciones ya aprobadas/publicadas,
     * igual que la regla de visibilidad usada en Publicacion::obtenerPorId.
     */
    public function publicacionPublicadaExiste(int $idPublicacion): bool
    {
        $consulta = $this->conexion->prepare(
            "SELECT 1 FROM publicaciones WHERE id_publicacion = :id AND estado = 'APROBADO' LIMIT 1"
        );
        $consulta->execute([':id' => $idPublicacion]);

        return (bool) $consulta->fetchColumn();
    }

    private function mapearFila(array $fila): array
    {
        $nombreCompleto = trim(($fila['nombre'] ?? '') . ' ' . ($fila['apellidos'] ?? ''));

        return [
            'id' => (int) $fila['id_comentario'],
            'contenido' => $fila['contenido'],
            'fecha' => $fila['fecha_registro'],
            'usuario' => [
                'id' => (int) $fila['id_usuario'],
                'nombre' => $nombreCompleto !== '' ? $nombreCompleto : 'Usuario',
                'foto_perfil' => $fila['foto_perfil'] ?? null,
            ],
        ];
    }
}
