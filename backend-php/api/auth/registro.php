<?php
require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../../models/Usuario.php';
require_once __DIR__ . '/../../models/TokenAutenticacion.php';
require_once __DIR__ . '/../../helpers/Token.php';
require_once __DIR__ . '/../../helpers/Validador.php';
require_once __DIR__ . '/../../helpers/Contrasena.php';
require_once __DIR__ . '/../../helpers/Correo.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    Respuesta::error('Método no permitido.', 405);
}

$cuerpo = json_decode(file_get_contents('php://input'), true);
$cuerpo = is_array($cuerpo) ? $cuerpo : [];

$nombre = trim((string) ($cuerpo['nombre'] ?? ''));
$apellidos = trim((string) ($cuerpo['apellidos'] ?? ''));
$correo = strtolower(trim((string) ($cuerpo['correo'] ?? '')));
$contrasena = (string) ($cuerpo['contrasena'] ?? '');
$confirmarContrasena = (string) ($cuerpo['confirmar_contrasena'] ?? $contrasena);

// --- Validaciones de campo individual -------------------------------
$errores = [];

if (($error = Validador::validarNombre($nombre, Validador::NOMBRE_MIN, Validador::NOMBRE_MAX)) !== null) {
    $errores['nombre'] = $error;
}
if (($error = Validador::validarNombre($apellidos, Validador::NOMBRE_MIN, Validador::APELLIDOS_MAX)) !== null) {
    $errores['apellidos'] = $error;
}
if (($error = Validador::validarCorreo($correo)) !== null) {
    $errores['correo'] = $error;
}
if (($error = Validador::validarContrasena($contrasena)) !== null) {
    $errores['contrasena'] = $error;
}
if ($contrasena !== $confirmarContrasena) {
    $errores['confirmar_contrasena'] = 'Las contraseñas no coinciden.';
}

if (!empty($errores)) {
    Respuesta::json([
        'exito' => false,
        'error' => 'Revisa los campos marcados.',
        'errores' => $errores,
    ], 422);
}

$usuarioModelo = new Usuario();
$tokenModelo = new TokenAutenticacion();
$conexion = $usuarioModelo->conexion();

try {
    $conexion->beginTransaction();

    // Evitar registros con correos duplicados.
    if ($usuarioModelo->buscarPorCorreo($correo) !== null) {
        $conexion->rollBack();
        Respuesta::json([
            'exito' => false,
            'error' => 'Ese correo ya está registrado.',
            'errores' => ['correo' => 'Ese correo ya está registrado.'],
        ], 409);
    }

    $contrasenaGuardada = Contrasena::crearHash($contrasena);
    $idUsuario = $usuarioModelo->crear($nombre, $apellidos, $correo, $contrasenaGuardada);

    $tokenRegistro = Token::generarCorto();
    $tokenModelo->crearTokenRegistro($idUsuario, Token::hash($tokenRegistro), Token::expiracionHoras(24));

    $conexion->commit();

    // El envío del correo ocurre DESPUÉS del commit: si fallara, la cuenta
    // ya quedó creada y el usuario puede pedir que se le reenvíe el token
    // (ver reenviar-verificacion.php) en vez de perder el registro completo.
    $correoEnviado = Correo::enviarVerificacion($correo, $nombre, $tokenRegistro);

    Respuesta::json([
        'exito' => true,
        'mensaje' => $correoEnviado
            ? 'Cuenta creada. Revisa tu correo para verificar tu cuenta.'
            : 'Cuenta creada, pero no pudimos enviar el correo de verificación. Usa la opción de reenviar el correo.',
        'correo' => $correo,
        'correo_enviado' => $correoEnviado,
    ], 201);
} catch (Throwable $excepcion) {
    if ($conexion->inTransaction()) {
        $conexion->rollBack();
    }

    // Si dos solicitudes de registro con el mismo correo llegan casi al
    // mismo tiempo (doble clic, doble envío del formulario), ambas pueden
    // pasar la validación de "correo ya registrado" antes de que la
    // primera termine de insertarse. La restricción UNIQUE de la base de
    // datos evita el registro duplicado; aquí solo se traduce ese error
    // a un mensaje claro en vez del genérico "No se pudo registrar".
    $esCorreoDuplicado = $excepcion instanceof PDOException
        && $excepcion->getCode() === '23000';

    if ($esCorreoDuplicado) {
        Respuesta::json([
            'exito' => false,
            'error' => 'Ese correo ya está registrado.',
            'errores' => ['correo' => 'Ese correo ya está registrado.'],
        ], 409);
    }

    Respuesta::error('No se pudo registrar el usuario.', 500);
}
