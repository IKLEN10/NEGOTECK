<?php

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/../models/Area.php';

try {
    $modelo = new Area();

    Respuesta::json([
        'exito' => true,
        'datos' => $modelo->obtenerParaSelect(),
    ]);

} catch (Throwable $e) {
    Respuesta::error('No fue posible obtener las áreas.', 500);
}
