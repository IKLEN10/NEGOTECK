<?php
require_once __DIR__ . '/Respuesta.php';
require_once __DIR__ . '/Token.php';
require_once __DIR__ . '/../models/Usuario.php';
require_once __DIR__ . '/../models/TokenAutenticacion.php';

/**
 * Guard de autenticación para endpoints protegidos (equivalente al
 * middleware `autenticarToken` del prototipo Node).
 *
 * Lee el encabezado `Authorization: Bearer <token>`, valida el token
 * contra `tokens_login` y devuelve el usuario autenticado. Si algo
 * falla, responde 401 en JSON y termina la ejecución (igual que hacen
 * los demás endpoints con Respuesta::error).
 */
class Autenticacion
{
    public static function requerirUsuario(): array
    {
        $encabezados = self::obtenerEncabezados();
        $autorizacion = $encabezados['Authorization'] ?? $encabezados['authorization'] ?? '';

        if (!str_starts_with($autorizacion, 'Bearer ')) {
            Respuesta::error('Falta el token de acceso.', 401);
        }

        $token = trim(substr($autorizacion, 7));
        if ($token === '') {
            Respuesta::error('Falta el token de acceso.', 401);
        }

        $tokenHash = Token::hash($token);

        $tokenAutenticacion = new TokenAutenticacion();
        $idUsuario = $tokenAutenticacion->buscarUsuarioPorTokenLogin($tokenHash);

        if ($idUsuario === null) {
            Respuesta::error('El token no existe, expiró o fue cerrado.', 401);
        }

        $usuarioModelo = new Usuario();
        $usuario = $usuarioModelo->buscarPorId($idUsuario);

        if ($usuario === null) {
            Respuesta::error('Usuario no encontrado o desactivado.', 401);
        }

        return ['usuario' => $usuario, 'token_hash' => $tokenHash];
    }

    /**
     * Igual que requerirUsuario(), pero además exige que el usuario
     * autenticado tenga el rol indicado (por ejemplo 'ADMINISTRADOR' para
     * el módulo de administración). Si el rol no coincide, responde 403 y
     * termina la ejecución, igual que hace requerirUsuario() con 401.
     */
    public static function requerirRol(string $rol): array
    {
        $contexto = self::requerirUsuario();

        if (($contexto['usuario']['rol'] ?? null) !== $rol) {
            Respuesta::error('No tienes permisos para realizar esta acción.', 403);
        }

        return $contexto;
    }

    /**
     * Igual que requerirUsuario(), pero para endpoints donde la sesión es
     * opcional: si no hay token, o es inválido/expiró, regresa null en
     * lugar de responder 401 y terminar la ejecución.
     */
    public static function usuarioOpcional(): ?array
    {
        $encabezados = self::obtenerEncabezados();
        $autorizacion = $encabezados['Authorization'] ?? $encabezados['authorization'] ?? '';

        if (!str_starts_with($autorizacion, 'Bearer ')) {
            return null;
        }

        $token = trim(substr($autorizacion, 7));
        if ($token === '') {
            return null;
        }

        $tokenAutenticacion = new TokenAutenticacion();
        $idUsuario = $tokenAutenticacion->buscarUsuarioPorTokenLogin(Token::hash($token));

        if ($idUsuario === null) {
            return null;
        }

        $usuarioModelo = new Usuario();
        return $usuarioModelo->buscarPorId($idUsuario);
    }

    private static function obtenerEncabezados(): array
    {
        if (function_exists('getallheaders')) {
            $encabezados = getallheaders();
            if (is_array($encabezados)) {
                return $encabezados;
            }
        }

        // Respaldo para servidores donde getallheaders() no existe
        // (por ejemplo, algunos SAPI de PHP-FPM sin ese helper).
        $encabezados = [];
        foreach ($_SERVER as $llave => $valor) {
            if (str_starts_with($llave, 'HTTP_')) {
                $nombre = str_replace(' ', '-', ucwords(str_replace('_', ' ', strtolower(substr($llave, 5)))));
                $encabezados[$nombre] = $valor;
            }
        }

        return $encabezados;
    }
}
