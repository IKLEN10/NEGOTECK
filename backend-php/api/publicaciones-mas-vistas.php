<?php
require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/../models/Publicacion.php';

try {
    $limite = isset($_GET['limite']) ? (int) $_GET['limite'] : 6;

    $modelo = new Publicacion();
    $publicaciones = $modelo->obtenerMasVistas($limite);

    Respuesta::json([
        'exito' => true,
        'datos' => $publicaciones,
    ]);
} catch (Throwable $excepcion) {
    Respuesta::error('No fue posible obtener las publicaciones más vistas.', 500);
}
