<?php

require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../../helpers/Autenticacion.php';
require_once __DIR__ . '/../../models/Publicacion.php';
require_once __DIR__ . '/../../config/config.php';

// Obtener el usuario autenticado mediante el token Bearer
$autenticado = Autenticacion::requerirUsuario();
$usuario     = $autenticado['usuario'];

$idUsuario = $usuario['id_usuario'];
$id        = (int) ($_GET['id'] ?? null);

if (! $id) {
    Respuesta::json([
        'exito' => false,
        'datos' => null,
    ], 400);
    exit;
}

$publicacion = new Publicacion();

$datos = $publicacion->obtenerParaEditar($id, $idUsuario);

if (! $datos) {
    Respuesta::json([
        'exito' => false,
        'datos' => null,
    ], 404);
    exit;
}

if ($datos['estado'] !== 'RECHAZADO') {
    Respuesta::json([
        'exito' => false,
        'error' => 'no_puede_editarse',
        'datos' => null,
    ], 403);
    exit;
}

// Construir URLs completas
if ($datos['archivo_pdf']) {
    $datos['archivo_pdf'] = rtrim(URL_BASE_ARCHIVOS, '/') . '/publicaciones/docs/' . $datos['archivo_pdf'];
}

if ($datos['imagen_portada']) {
    $datos['imagen_portada'] = rtrim(URL_BASE_ARCHIVOS, '/') . '/publicaciones/img/' . $datos['imagen_portada'];
}

Respuesta::json([
    'exito' => true,
    'datos' => $datos,
]);
