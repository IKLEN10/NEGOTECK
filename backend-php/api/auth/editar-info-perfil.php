<?php
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../../models/Usuario.php';
require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../../helpers/Autenticacion.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Respuesta::error('Método no permitido.', 405);
    exit;
}

try {
    $autenticado = Autenticacion::requerirUsuario();
    $usuario     = $autenticado['usuario'];
    $id_usuario  = $usuario['id_usuario'];

    $nombre      = trim(strip_tags($_POST['nombre'] ?? ''));
    $apellidos   = trim(strip_tags($_POST['apellidos'] ?? ''));
    $institucion = trim(strip_tags($_POST['institucion'] ?? ''));
    $biografia   = trim(strip_tags($_POST['biografia'] ?? ''));

    $errores = [];

    if (empty($nombre)) {
        $errores['nombre'] = 'El nombre es requerido.';
    } elseif (strlen($nombre) < 2 || strlen($nombre) > 50) {
        $errores['nombre'] = 'El nombre debe tener entre 2 y 50 caracteres.';
    }

    if (empty($apellidos)) {
        $errores['apellidos'] = 'Los apellidos son requeridos.';
    } elseif (strlen($apellidos) < 2 || strlen($apellidos) > 50) {
        $errores['apellidos'] = 'Los apellidos deben tener entre 2 y 50 caracteres.';
    }

    if (strlen($institucion) > 100) {
        $errores['institucion'] = 'La institución no debe superar 100 caracteres.';
    }

    if (strlen($biografia) > 500) {
        $errores['biografia'] = 'La biografía no debe superar 500 caracteres.';
    }

    if (! empty($errores)) {
        Respuesta::json([
            'exito'   => false,
            'errores' => $errores,
        ], 422);
    }

    $modeloUsuario = new Usuario();
    $modeloUsuario->actualizarPerfil(
        $id_usuario,
        $nombre,
        $apellidos,
        $institucion,
        $biografia
    );

    Respuesta::json([
        'exito'   => true,
        'mensaje' => 'Perfil actualizado exitosamente.',
        'datos'   => [
            'nombre'      => $nombre,
            'apellidos'   => $apellidos,
            'institucion' => $institucion,
            'biografia'   => $biografia,
        ],
    ], 200);

} catch (Exception $e) {
    Respuesta::error($e->getMessage(), 400);
}
