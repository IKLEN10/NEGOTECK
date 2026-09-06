<?php

require_once __DIR__ . '/../../models/Publicacion.php';
require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../../helpers/Autenticacion.php';

try {

    // Obtener usuario autenticado mediante token
    $autenticado = Autenticacion::requerirUsuario();

    $usuario = $autenticado['usuario'];

    $idUsuario = (int) $usuario['id_usuario'];

    $publicacion = new Publicacion();

    $datos = $publicacion->obtenerPorUsuario($idUsuario);

    Respuesta::json([
        'exito' => true,
        'datos' => $datos,
    ]);

} catch (Exception $e) {

    Respuesta::json([
        'exito'   => false,
        'mensaje' => $e->getMessage(),
    ], 401);

}
