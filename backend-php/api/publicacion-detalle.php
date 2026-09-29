<?php
require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/../models/Publicacion.php';
require_once __DIR__ . '/../models/Vista.php';

try {
    $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

    if ($id <= 0) {
        Respuesta::error('Id de publicación inválido.', 400);
    }

    $modelo      = new Publicacion();
    $publicacion = $modelo->obtenerPorId($id);

    if ($publicacion === null) {
        Respuesta::error('No se encontró esta publicación.', 404);
    }

    // La vista la decide el servidor (models/Vista.php): la misma
    // persona suma como máximo una vez cada 2 horas, aunque abra otra
    // pestaña, recargue o salga y vuelva a entrar.
    // `registrar_vista=0` se sigue respetando por compatibilidad.
    $registrarVista = ($_GET['registrar_vista'] ?? '1') !== '0';
    $idVisitante    = trim((string) ($_GET['id_visitante'] ?? ''));

    if ($registrarVista) {
        (new Vista())->registrar(
            Vista::TIPO_PUBLICACION,
            $id,
            $idVisitante !== '' ? $idVisitante : null,
            fn () => $modelo->incrementarVisitas($id)
        );

        // Se relee el valor real de la BD para que el detalle muestre
        // exactamente el mismo número que verá la tarjeta al regresar.
        $publicacion['visitas'] = $modelo->obtenerVisitas($id);
    }

    Respuesta::json([
        'exito' => true,
        'datos' => $publicacion,
    ]);
} catch (Throwable $excepcion) {
    Respuesta::error('No fue posible obtener la publicación.', 500);
}
