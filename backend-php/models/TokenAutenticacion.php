<?php
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../helpers/Token.php';

/**
 * Acceso a datos de las tres tablas de tokens del módulo de autenticación:
 * `tokens_registro`, `tokens_login` y `tokens_recuperacion`.
 *
 * Los tres siguen el mismo patrón: se guarda el hash SHA-256 del token,
 * su fecha de expiración y si ya fue usado/revocado.
 */
class TokenAutenticacion
{
    private PDO $conexion;

    public function __construct()
    {
        $this->conexion = Database::obtenerConexion();
    }

    // --- tokens_registro (verificación de cuenta nueva) ---------------

    public function crearTokenRegistro(int $idUsuario, string $tokenHash, string $expira): void
    {
        $consulta = $this->conexion->prepare(
            'INSERT INTO tokens_registro (id_usuario, token_hash, token_expira) VALUES (:id, :hash, :expira)'
        );
        $consulta->execute([':id' => $idUsuario, ':hash' => $tokenHash, ':expira' => $expira]);
    }

    public function buscarTokenRegistroValido(int $idUsuario, string $tokenHash): ?array
    {
        $consulta = $this->conexion->prepare(
            'SELECT id_token_registro
             FROM tokens_registro
             WHERE id_usuario = :id AND token_hash = :hash
               AND token_usado = 0 AND token_expira > NOW()
             LIMIT 1'
        );
        $consulta->execute([':id' => $idUsuario, ':hash' => $tokenHash]);
        $fila = $consulta->fetch();

        return $fila ?: null;
    }

    public function marcarTokenRegistroUsado(int $idTokenRegistro): void
    {
        $consulta = $this->conexion->prepare(
            'UPDATE tokens_registro SET token_usado = 1, fecha_uso = NOW() WHERE id_token_registro = :id'
        );
        $consulta->execute([':id' => $idTokenRegistro]);
    }

    // --- tokens_login (sesión) -----------------------------------------

    public function crearTokenLogin(int $idUsuario, string $tokenHash, string $expira, ?string $ip, ?string $userAgent): void
    {
        $consulta = $this->conexion->prepare(
            'INSERT INTO tokens_login (id_usuario, token_hash, token_expira, ip_cliente, user_agent)
             VALUES (:id, :hash, :expira, :ip, :agente)'
        );
        $consulta->execute([
            ':id' => $idUsuario,
            ':hash' => $tokenHash,
            ':expira' => $expira,
            ':ip' => $ip,
            ':agente' => $userAgent !== null ? mb_substr($userAgent, 0, 255) : null,
        ]);
    }

    /**
     * Regresa el id_usuario dueño de un token de acceso vigente (no
     * expirado, no revocado), o null si el token no es válido.
     */
    public function buscarUsuarioPorTokenLogin(string $tokenHash): ?int
    {
        $consulta = $this->conexion->prepare(
            'SELECT id_usuario
             FROM tokens_login
             WHERE token_hash = :hash AND token_revocado = 0 AND token_expira > NOW()
             LIMIT 1'
        );
        $consulta->execute([':hash' => $tokenHash]);
        $fila = $consulta->fetch();

        return $fila ? (int) $fila['id_usuario'] : null;
    }

    public function revocarTokenLogin(string $tokenHash): void
    {
        $consulta = $this->conexion->prepare(
            'UPDATE tokens_login SET token_revocado = 1, fecha_uso = NOW() WHERE token_hash = :hash'
        );
        $consulta->execute([':hash' => $tokenHash]);
    }

    // --- tokens_recuperacion (olvidé mi contraseña) --------------------

    public function crearTokenRecuperacion(int $idUsuario, string $tokenHash, string $expira): void
    {
        $consulta = $this->conexion->prepare(
            'INSERT INTO tokens_recuperacion (id_usuario, token_hash, token_expira) VALUES (:id, :hash, :expira)'
        );
        $consulta->execute([':id' => $idUsuario, ':hash' => $tokenHash, ':expira' => $expira]);
    }

    public function buscarTokenRecuperacionValido(int $idUsuario, string $tokenHash): ?array
    {
        $consulta = $this->conexion->prepare(
            'SELECT id_token_recuperacion
             FROM tokens_recuperacion
             WHERE id_usuario = :id AND token_hash = :hash
               AND token_usado = 0 AND token_expira > NOW()
             LIMIT 1'
        );
        $consulta->execute([':id' => $idUsuario, ':hash' => $tokenHash]);
        $fila = $consulta->fetch();

        return $fila ?: null;
    }

    public function marcarTokenRecuperacionUsado(int $idTokenRecuperacion): void
    {
        $consulta = $this->conexion->prepare(
            'UPDATE tokens_recuperacion SET token_usado = 1, fecha_uso = NOW() WHERE id_token_recuperacion = :id'
        );
        $consulta->execute([':id' => $idTokenRecuperacion]);
    }
}
