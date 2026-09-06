<?php
require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/../models/Area.php';

try {
    $modelo = new Area();
    $areas = $modelo->obtenerTodas();

    Respuesta::json([
        'exito' => true,
        'datos' => $areas,
    ]);
} catch (Throwable $excepcion) {
    Respuesta::error('No fue posible obtener las áreas.', 500);
}
