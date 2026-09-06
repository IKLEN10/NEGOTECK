<?php
require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../../models/Usuario.php';
require_once __DIR__ . '/../../models/TokenAutenticacion.php';
require_once __DIR__ . '/../../helpers/Token.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    Respuesta::error('Método no permitido.', 405);
}

$cuerpo = json_decode(file_get_contents('php://input'), true);
$cuerpo = is_array($cuerpo) ? $cuerpo : [];

$correo = strtolower(trim((string) ($cuerpo['correo'] ?? '')));
$token = strtoupper(trim((string) ($cuerpo['token'] ?? '')));

if ($correo === '' || $token === '') {
    Respuesta::error('Correo y token son obligatorios.', 400);
}

$usuarioModelo = new Usuario();
$tokenModelo = new TokenAutenticacion();
$conexion = $usuarioModelo->conexion();

try {
    $conexion->beginTransaction();

    $usuario = $usuarioModelo->buscarPorCorreo($correo);

    if ($usuario === null) {
        $conexion->rollBack();
        Respuesta::error('Usuario no encontrado.', 404);
    }

    if ((int) $usuario['correo_verificado'] === 1) {
        $conexion->rollBack();
        Respuesta::json(['exito' => true, 'mensaje' => 'La cuenta ya estaba verificada.']);
    }

    $tokenValido = $tokenModelo->buscarTokenRegistroValido((int) $usuario['id_usuario'], Token::hash($token));

    if ($tokenValido === null) {
        $conexion->rollBack();
        Respuesta::error('Token de registro inválido o expirado.', 400);
    }

    $usuarioModelo->marcarCorreoVerificado((int) $usuario['id_usuario']);
    $tokenModelo->marcarTokenRegistroUsado((int) $tokenValido['id_token_registro']);

    $conexion->commit();

    Respuesta::json(['exito' => true, 'mensaje' => 'Cuenta verificada correctamente. Ya puedes iniciar sesión.']);
} catch (Throwable $excepcion) {
    if ($conexion->inTransaction()) {
        $conexion->rollBack();
    }
    Respuesta::error('No se pudo verificar el registro.', 500);
}
