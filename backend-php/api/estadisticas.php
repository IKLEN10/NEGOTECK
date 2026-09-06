<?php
require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/../models/Estadistica.php';

try {
    $modelo = new Estadistica();

    Respuesta::json([
        'exito' => true,
        'datos' => $modelo->obtenerResumen(),
    ]);
} catch (Throwable $excepcion) {
    Respuesta::error('No fue posible obtener las estadísticas.', 500);
}
