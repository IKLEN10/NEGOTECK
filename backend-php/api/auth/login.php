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
$contrasena = (string) ($cuerpo['contrasena'] ?? '');
$recordar = (bool) ($cuerpo['recordar'] ?? false);

if ($correo === '' && $contrasena === '') {
    Respuesta::error('Correo y contraseña son obligatorios.', 400);
}
if ($correo === '') {
    Respuesta::error('El correo electrónico es obligatorio.', 400);
}
if ($contrasena === '') {
    Respuesta::error('La contraseña es obligatoria.', 400);
}
if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    Respuesta::error('El formato del correo electrónico no es válido.', 422);
}

try {
    $usuarioModelo = new Usuario();
    $usuario = $usuarioModelo->buscarPorCorreo($correo);

    if ($usuario === null) {
        Respuesta::error('No existe una cuenta registrada con ese correo.', 404);
    }

    if ((int) $usuario['activo'] !== 1) {
        Respuesta::error('Esta cuenta está desactivada. Contacta al equipo editorial.', 403);
    }

    if (!Contrasena::verificar($contrasena, $usuario['contrasena_hash'])) {
        Respuesta::error('La contraseña es incorrecta.', 401);
    }

    if ((int) $usuario['correo_verificado'] !== 1) {
        Respuesta::json([
            'exito' => false,
            'error' => 'Debes verificar tu correo antes de iniciar sesión. Revisa tu bandeja de entrada.',
            'requiere_verificacion' => true,
            'correo' => $correo,
        ], 403);
    }

    $token = Token::generarLargo();
    $tokenModelo = new TokenAutenticacion();
    // Duración de la sesión: 12 horas por defecto (suficiente para una
    // jornada completa sin que el usuario pierda la sesión a medio uso),
    // o 30 días si marcó "Recordarme". Antes quedaba fija en solo 2
    // horas, lo que producía sesiones que expiraban en plena navegación.
    $tokenModelo->crearTokenLogin(
        (int) $usuario['id_usuario'],
        Token::hash($token),
        Token::expiracionHoras($recordar ? 24 * 30 : 12),
        $_SERVER['REMOTE_ADDR'] ?? null,
        $_SERVER['HTTP_USER_AGENT'] ?? null
    );

    Respuesta::json([
        'exito' => true,
        'mensaje' => 'Inicio de sesión correcto.',
        'token' => $token,
        'usuario' => Usuario::publico($usuario),
    ]);
} catch (Throwable $excepcion) {
    Respuesta::error('No se pudo iniciar sesión.', 500);
}
