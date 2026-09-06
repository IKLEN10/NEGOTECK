<?php
require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../../models/Usuario.php';
require_once __DIR__ . '/../../models/TokenAutenticacion.php';
require_once __DIR__ . '/../../helpers/Token.php';
require_once __DIR__ . '/../../helpers/Validador.php';
require_once __DIR__ . '/../../helpers/Correo.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    Respuesta::error('Método no permitido.', 405);
}

$cuerpo = json_decode(file_get_contents('php://input'), true);
$cuerpo = is_array($cuerpo) ? $cuerpo : [];

$correo = strtolower(trim((string) ($cuerpo['correo'] ?? '')));

if (($error = Validador::validarCorreo($correo)) !== null) {
    Respuesta::error($error, 422);
}

// Respuesta genérica: no revela si el correo existe o si ya estaba
// verificado, para no facilitar enumeración de cuentas.
$respuestaGenerica = [
    'exito' => true,
    'mensaje' => 'Si tu cuenta existe y aún no ha sido verificada, te enviamos un nuevo correo de verificación.',
];

try {
    $usuarioModelo = new Usuario();
    $usuario = $usuarioModelo->buscarPorCorreo($correo);

    if ($usuario === null || (int) $usuario['correo_verificado'] === 1) {
        Respuesta::json($respuestaGenerica);
    }

    $tokenModelo = new TokenAutenticacion();
    $tokenRegistro = Token::generarCorto();
    $tokenModelo->crearTokenRegistro((int) $usuario['id_usuario'], Token::hash($tokenRegistro), Token::expiracionHoras(24));

    Correo::enviarVerificacion($correo, $usuario['nombre'], $tokenRegistro);

    Respuesta::json($respuestaGenerica);
} catch (Throwable $excepcion) {
    Respuesta::error('No se pudo procesar la solicitud.', 500);
}
