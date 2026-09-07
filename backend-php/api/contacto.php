<?php
require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/../models/Contacto.php';
require_once __DIR__ . '/../helpers/Validador.php';
require_once __DIR__ . '/../helpers/Correo.php';
require_once __DIR__ . '/../helpers/Autenticacion.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    Respuesta::error('Método no permitido.', 405);
}

const CONTACTO_NOMBRE_MAX  = 150;
const CONTACTO_ASUNTO_MAX  = 200;
const CONTACTO_MENSAJE_MIN = 10;
const CONTACTO_MENSAJE_MAX = 2000;

$cuerpo = json_decode(file_get_contents('php://input'), true);
$cuerpo = is_array($cuerpo) ? $cuerpo : [];

// Si el mensaje viene con un token de sesión válido, el nombre y el
// correo se toman directamente de la cuenta autenticada (no de lo que
// mande el cliente), tal como se autocompletan en el formulario.
$usuarioSesion = Autenticacion::usuarioOpcional();

if ($usuarioSesion !== null) {
    $nombre = trim($usuarioSesion['nombre'] . ' ' . $usuarioSesion['apellidos']);
    $correo = trim((string) $usuarioSesion['correo']);
} else {
    $nombre = trim((string) ($cuerpo['nombre'] ?? ''));
    $correo = trim((string) ($cuerpo['correo'] ?? ''));
}

$asunto  = trim((string) ($cuerpo['asunto'] ?? ''));
$mensaje = trim((string) ($cuerpo['mensaje'] ?? ''));

// --- Validaciones de campo individual -------------------------------
$errores = [];

if (($error = Validador::validarNombre($nombre, Validador::NOMBRE_MIN, CONTACTO_NOMBRE_MAX)) !== null) {
    $errores['nombre'] = $error;
}
if (($error = Validador::validarCorreo($correo)) !== null) {
    $errores['correo'] = $error;
}
// Validación de Asunto
if ($asunto === '') {
    $errores['asunto'] = 'El asunto es obligatorio.';
} elseif (mb_strlen($asunto) > CONTACTO_ASUNTO_MAX) {
    $errores['asunto'] = 'El asunto no puede superar los ' . CONTACTO_ASUNTO_MAX . ' caracteres.';
} elseif (Validador::tieneOfensas($asunto)) {
    $errores['asunto'] = 'El asunto contiene lenguaje no permitido.';
}

// Validación de Mensaje
if ($mensaje === '') {
    $errores['mensaje'] = 'El mensaje es obligatorio.';
} elseif (mb_strlen($mensaje) < CONTACTO_MENSAJE_MIN) {
    $errores['mensaje'] = 'Cuéntanos un poco más: al menos ' . CONTACTO_MENSAJE_MIN . ' caracteres.';
} elseif (mb_strlen($mensaje) > CONTACTO_MENSAJE_MAX) {
    $errores['mensaje'] = 'El mensaje no puede superar los ' . CONTACTO_MENSAJE_MAX . ' caracteres.';
} elseif (Validador::tieneOfensas($mensaje)) {
    $errores['mensaje'] = 'Tu mensaje contiene lenguaje no permitido.';
}

if (! empty($errores)) {
    Respuesta::json([
        'exito'   => false,
        'error'   => 'Revisa los campos marcados.',
        'errores' => $errores,
    ], 422);
}

try {
    // Se guarda primero: si el envío del correo fallara más adelante, el
    // mensaje no se pierde y el equipo editorial puede seguir consultando
    // `mensajes_contacto` directamente en la base de datos.
    $modelo    = new Contacto();
    $idMensaje = $modelo->guardar($nombre, $correo, $asunto, $mensaje);

    $correoEnviado = Correo::enviarContacto($nombre, $correo, $asunto, $mensaje);

    Respuesta::json([
        'exito'          => true,
        'mensaje'        => $correoEnviado
            ? 'Tu mensaje fue enviado. Te responderemos pronto.'
            : 'Tu mensaje quedó registrado, pero no pudimos notificar por correo al equipo editorial. Igual le daremos seguimiento.',
        'id'             => $idMensaje,
        'correo_enviado' => $correoEnviado,
    ], 201);
} catch (Throwable $excepcion) {
    Respuesta::error('No fue posible enviar tu mensaje. Intenta de nuevo.', 500);
}
