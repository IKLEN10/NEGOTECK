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

// No se revela si el correo existe o no: siempre se responde el mismo
// mensaje genérico para no facilitar enumeración de cuentas.
$respuestaGenerica = [
    'exito' => true,
    'mensaje' => 'Si el correo existe en nuestra base de datos, recibirás instrucciones para restablecer tu contraseña.',
];

try {
    $usuarioModelo = new Usuario();
    $usuario = $usuarioModelo->buscarPorCorreo($correo);

    if ($usuario === null || (int) $usuario['activo'] !== 1) {
        Respuesta::json($respuestaGenerica);
    }

    $tokenRecuperacion = Token::generarCorto();
    $tokenModelo = new TokenAutenticacion();
    $tokenModelo->crearTokenRecuperacion(
        (int) $usuario['id_usuario'],
        Token::hash($tokenRecuperacion),
        Token::expiracionHoras(1)
    );

    Correo::enviarRecuperacion($correo, $usuario['nombre'], $tokenRecuperacion);

    Respuesta::json($respuestaGenerica);
} catch (Throwable $excepcion) {
    Respuesta::error('No se pudo procesar la solicitud.', 500);
}
