<?php
require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/../models/Publicacion.php';

try {
    $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

    if ($id <= 0) {
        Respuesta::error('Id de publicación inválido.', 400);
    }

    // El frontend manda registrar_vista=0 cuando ya contabilizó esta
    // publicación en la sesión actual del navegador (por ejemplo, al
    // recargar la misma página), para no inflar el contador con
    // recargas que no son visitas nuevas. Por defecto sí se cuenta.
    $registrarVista = ($_GET['registrar_vista'] ?? '1') !== '0';

    $modelo      = new Publicacion();
    $publicacion = $modelo->obtenerPorId($id);

    if ($publicacion === null) {
        Respuesta::error('No se encontró esta publicación.', 404);
    }

    if ($registrarVista) {
        $modelo->incrementarVisitas($id);
        // `obtenerPorId` ya había leído `visitas` antes del incremento
        // de arriba; se ajusta en memoria para no hacer una segunda
        // consulta y que la respuesta refleje el conteo real.
        $publicacion['visitas'] += 1;
    }

    Respuesta::json([
        'exito' => true,
        'datos' => $publicacion,
    ]);
} catch (Throwable $excepcion) {
    Respuesta::error('No fue posible obtener la publicación.', 500);
}
