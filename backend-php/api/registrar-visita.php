<?php
require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/../models/Vista.php';
require_once __DIR__ . '/../models/ContadorSitio.php';

// Registra una visita al sitio ("Vistas totales" del menú). El frontend
// lo llama al navegar por la página pública (ver useVisitaSitio). Solo
// suma si esa persona no sumó en las últimas 2 horas: abrir pestañas,
// recargar o navegar entre secciones no suma. Las reglas completas
// están en models/Vista.php.
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    Respuesta::error('Método no permitido.', 405);
}

$cuerpo = json_decode(file_get_contents('php://input'), true) ?? [];
$idVisitante = trim((string) ($cuerpo['id_visitante'] ?? $_POST['id_visitante'] ?? ''));

try {
    $contador = new ContadorSitio();

    $nueva = (new Vista())->registrar(
        Vista::TIPO_SITIO,
        0,
        $idVisitante !== '' ? $idVisitante : null,
        fn () => $contador->incrementar()
    );

    Respuesta::json([
        'exito'  => true,
        'nueva'  => $nueva,
        'vistas' => $contador->obtener(),
    ]);
} catch (Throwable $excepcion) {
    Respuesta::error('No fue posible registrar la visita.', 500);
}
