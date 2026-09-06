<?php
require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../../models/Usuario.php';
require_once __DIR__ . '/../../models/TokenAutenticacion.php';
require_once __DIR__ . '/../../helpers/Token.php';
require_once __DIR__ . '/../../helpers/Validador.php';
require_once __DIR__ . '/../../helpers/Contrasena.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    Respuesta::error('Método no permitido.', 405);
}

$cuerpo = json_decode(file_get_contents('php://input'), true);
$cuerpo = is_array($cuerpo) ? $cuerpo : [];

$correo = strtolower(trim((string) ($cuerpo['correo'] ?? '')));
$token = strtoupper(trim((string) ($cuerpo['token'] ?? '')));
$contrasenaNueva = (string) ($cuerpo['contrasena_nueva'] ?? '');
$confirmarContrasena = (string) ($cuerpo['confirmar_contrasena_nueva'] ?? $contrasenaNueva);

if ($correo === '' || $token === '' || $contrasenaNueva === '') {
    Respuesta::error('Correo, token y nueva contraseña son obligatorios.', 400);
}

if (($error = Validador::validarContrasena($contrasenaNueva)) !== null) {
    Respuesta::error($error, 422);
}

if ($contrasenaNueva !== $confirmarContrasena) {
    Respuesta::error('Las contraseñas no coinciden.', 422);
}

$usuarioModelo = new Usuario();
$tokenModelo = new TokenAutenticacion();
$conexion = $usuarioModelo->conexion();

try {
    $conexion->beginTransaction();

    $usuario = $usuarioModelo->buscarPorCorreo($correo);

    if ($usuario === null) {
        $conexion->rollBack();
        Respuesta::error('Token de recuperación inválido o expirado.', 400);
    }

    $tokenValido = $tokenModelo->buscarTokenRecuperacionValido((int) $usuario['id_usuario'], Token::hash($token));

    if ($tokenValido === null) {
        $conexion->rollBack();
        Respuesta::error('Token de recuperación inválido o expirado.', 400);
    }

    $usuarioModelo->actualizarContrasena((int) $usuario['id_usuario'], Contrasena::crearHash($contrasenaNueva));
    $tokenModelo->marcarTokenRecuperacionUsado((int) $tokenValido['id_token_recuperacion']);

    $conexion->commit();

    Respuesta::json(['exito' => true, 'mensaje' => 'Contraseña actualizada. Ya puedes iniciar sesión.']);
} catch (Throwable $excepcion) {
    if ($conexion->inTransaction()) {
        $conexion->rollBack();
    }
    Respuesta::error('No se pudo restablecer la contraseña.', 500);
}
