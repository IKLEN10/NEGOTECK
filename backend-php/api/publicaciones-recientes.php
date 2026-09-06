<?php
require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/../models/Publicacion.php';

try {
    $limite = isset($_GET['limite']) ? (int) $_GET['limite'] : 5;

    $modelo = new Publicacion();
    $publicaciones = $modelo->obtenerRecientes($limite);

    Respuesta::json([
        'exito' => true,
        'datos' => $publicaciones,
    ]);
} catch (Throwable $excepcion) {
    Respuesta::error('No fue posible obtener las publicaciones recientes.', 500);
}
