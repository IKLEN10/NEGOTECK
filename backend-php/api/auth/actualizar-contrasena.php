<?php
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../../models/Usuario.php';
require_once __DIR__ . '/../../helpers/Autenticacion.php';
require_once __DIR__ . '/../../helpers/Validador.php';
require_once __DIR__ . '/../../helpers/Contrasena.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Respuesta::error('Método no permitido.', 405);
    exit;
}

try {
    $autenticado = Autenticacion::requerirUsuario();
    $usuario     = $autenticado['usuario'];
    $id_usuario  = $usuario['id_usuario'];

    $contrasenaActual = $_POST['contrasena_actual'] ?? '';
    $contrasenaNueva  = $_POST['contrasena_nueva'] ?? '';
    $confirmacion     = $_POST['confirmacion'] ?? '';

    $errores = [];

    if (empty($contrasenaActual)) {
        $errores['contrasena_actual'] = 'La contraseña actual es requerida.';
    }

    $errorContrasena = Validador::validarContrasena($contrasenaNueva);
    if ($errorContrasena) {
        $errores['contrasena_nueva'] = $errorContrasena;
    }

    if (empty($confirmacion)) {
        $errores['confirmacion'] = 'Debe confirmar la contraseña.';
    } elseif ($contrasenaNueva !== $confirmacion) {
        $errores['confirmacion'] = 'Las contraseñas no coinciden.';
    }

    if (! empty($errores)) {
        Respuesta::json([
            'exito'   => false,
            'errores' => $errores,
        ], 422);
        exit;
    }

    $modeloUsuario = new Usuario();
    $usuarioActual = $modeloUsuario->buscarPorId($id_usuario);

    if (! $usuarioActual) {
        Respuesta::error('Usuario no encontrado.', 404);
        exit;
    }

    if (! Contrasena::verificar($contrasenaActual, $usuarioActual['contrasena_hash'] ?? '')) {
        Respuesta::error('La contraseña actual es incorrecta.', 401);
        exit;
    }

    if (Contrasena::verificar($contrasenaNueva, $usuarioActual['contrasena_hash'])) {
        Respuesta::error('La nueva contraseña debe ser diferente a la actual.', 400);
        exit;
    }

    $hashNuevo = Contrasena::crearHash($contrasenaNueva);
    $modeloUsuario->actualizarContrasena($id_usuario, $hashNuevo);

    Respuesta::json([
        'exito'   => true,
        'mensaje' => 'Contraseña actualizada exitosamente.',
    ], 200);

} catch (Exception $e) {
    Respuesta::error($e->getMessage(), 400);
}
