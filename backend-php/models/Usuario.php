<?php
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../config/config.php';

/**
 * Acceso a datos de la tabla `usuarios` (más el rol asociado) para el
 * módulo de autenticación: registro, login, perfil y recuperación de
 * contraseña.
 */
class Usuario
{
    private PDO $conexion;

    public function __construct()
    {
        $this->conexion = Database::obtenerConexion();
    }

    public function buscarPorCorreo(string $correo): ?array
    {
        $sql = '
            SELECT u.id_usuario, u.nombre, u.apellidos, u.correo, u.contrasena_hash,
                   u.foto_perfil, u.activo, u.correo_verificado, u.fecha_registro,
                   r.nombre AS rol
            FROM usuarios u
            INNER JOIN roles r ON r.id_rol = u.id_rol
            WHERE u.correo = :correo
            LIMIT 1
        ';

        $consulta = $this->conexion->prepare($sql);
        $consulta->execute([':correo' => $correo]);
        $fila = $consulta->fetch();

        return $fila ?: null;
    }

    public function buscarPorId(int $idUsuario): ?array
    {
        $sql = '
            SELECT u.id_usuario, u.nombre, u.apellidos, u.correo, u.foto_perfil,
                   u.institucion, u.biografia, u.contrasena_hash,
                   u.activo, u.correo_verificado, u.fecha_registro,
                   r.nombre AS rol
            FROM usuarios u
            INNER JOIN roles r ON r.id_rol = u.id_rol
            WHERE u.id_usuario = :id AND u.activo = 1
            LIMIT 1
        ';

        $consulta = $this->conexion->prepare($sql);
        $consulta->execute([':id' => $idUsuario]);
        $fila = $consulta->fetch();

        return $fila ?: null;
    }

    /**
     * Crea un autor nuevo (id_rol = 2, correo_verificado = 0) y regresa su id.
     */
    public function crear(string $nombre, string $apellidos, string $correo, string $contrasenaHash): int
    {
        $sql = '
            INSERT INTO usuarios (id_rol, nombre, apellidos, correo, contrasena_hash, correo_verificado)
            VALUES (2, :nombre, :apellidos, :correo, :contrasena_hash, 0)
        ';

        $consulta = $this->conexion->prepare($sql);
        $consulta->execute([
            ':nombre'          => $nombre,
            ':apellidos'       => $apellidos,
            ':correo'          => $correo,
            ':contrasena_hash' => $contrasenaHash,
        ]);

        return (int) $this->conexion->lastInsertId();
    }

    public function marcarCorreoVerificado(int $idUsuario): void
    {
        $consulta = $this->conexion->prepare(
            'UPDATE usuarios SET correo_verificado = 1 WHERE id_usuario = :id'
        );
        $consulta->execute([':id' => $idUsuario]);
    }

    public function actualizarContrasena(int $idUsuario, string $contrasenaHash): void
    {
        $consulta = $this->conexion->prepare(
            'UPDATE usuarios SET contrasena_hash = :hash WHERE id_usuario = :id'
        );
        $consulta->execute([':hash' => $contrasenaHash, ':id' => $idUsuario]);
    }

    /**
     * Conexión PDO compartida, para que los modelos de tokens del mismo
     * módulo (ver TokenAutenticacion) puedan participar de la misma
     * transacción que este modelo.
     */
    public function conexion(): PDO
    {
        return $this->conexion;
    }

    /**
     * Proyección pública de un usuario (nunca incluye contrasena_hash).
     */
    public static function publico(array $fila): array
    {
        return [
            'id_usuario'     => (int) $fila['id_usuario'],
            'nombre'         => $fila['nombre'],
            'apellidos'      => $fila['apellidos'],
            'correo'         => $fila['correo'],
            'rol'            => $fila['rol'],
            'foto_perfil'    => $fila['foto_perfil'],
            'fecha_registro' => $fila['fecha_registro'],
        ];
    }

    /**
     * Autores (rol AUTOR) con el conteo real de sus publicaciones por
     * estado, para el panel del Administrador General
     * (ver api/admin/autores.php y PaginaAdminAutores.jsx). Antes esa
     * pantalla mostraba datos simulados de src/data/autores.js en vez de
     * los usuarios realmente registrados en la base de datos.
     */
    public function obtenerAutoresConEstadisticas(): array
    {
        $sql = "
            SELECT
                u.id_usuario,
                u.nombre,
                u.apellidos,
                u.correo,
                u.institucion,
                u.foto_perfil,
                u.activo,
                COUNT(p.id_publicacion) AS total,
                SUM(CASE WHEN p.estado = 'PENDIENTE' THEN 1 ELSE 0 END) AS pendientes,
                SUM(CASE WHEN p.estado = 'APROBADO' THEN 1 ELSE 0 END) AS aprobadas
            FROM usuarios u
            INNER JOIN roles r ON r.id_rol = u.id_rol
            LEFT JOIN publicaciones p ON p.id_usuario = u.id_usuario
            WHERE r.nombre = 'AUTOR'
            GROUP BY u.id_usuario, u.nombre, u.apellidos, u.correo, u.institucion, u.foto_perfil, u.activo
            ORDER BY u.nombre ASC, u.apellidos ASC
        ";

        $filas = $this->conexion->query($sql)->fetchAll();

        return array_map(function (array $fila): array {
            return [
                'id'          => (int) $fila['id_usuario'],
                'nombre'      => trim($fila['nombre'] . ' ' . $fila['apellidos']),
                'correo'      => $fila['correo'],
                'institucion' => $fila['institucion'],
                'rol'         => 'AUTOR',
                'activo'      => (bool) $fila['activo'],
                'avatar'      => $fila['foto_perfil']
                    ? rtrim(URL_BASE_ARCHIVOS, '/') . '/perfiles/' . $fila['foto_perfil']
                    : null,
                'total'       => (int) $fila['total'],
                'pendientes'  => (int) $fila['pendientes'],
                'aprobadas'   => (int) $fila['aprobadas'],
            ];
        }, $filas);
    }

    public function actualizarPerfil(
        int $idUsuario,
        string $nombre,
        string $apellidos,
        string $institucion,
        string $biografia
    ): bool {
        $sql = '
        UPDATE usuarios
        SET
            nombre = :nombre,
            apellidos = :apellidos,
            institucion = :institucion,
            biografia = :biografia
        WHERE id_usuario = :id
    ';

        $consulta = $this->conexion->prepare($sql);

        return $consulta->execute([
            ':nombre'      => $nombre,
            ':apellidos'   => $apellidos,
            ':institucion' => $institucion,
            ':biografia'   => $biografia,
            ':id'          => $idUsuario,
        ]);
    }
}
