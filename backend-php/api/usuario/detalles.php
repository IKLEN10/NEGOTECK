<?php
require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../../models/Publicacion.php';
require_once __DIR__ . '/../../helpers/Autenticacion.php';
require_once __DIR__ . '/../../config/config.php';

try {
    // Este endpoint expone el detalle SIN filtrar por estado (incluye
    // publicaciones pendientes/rechazadas y las notas internas del editor
    // en "observaciones_editor"). Antes no exigía sesión: cualquiera que
    // conociera o adivinara un id podía leer ese detalle. Ahora se exige
    // sesión y se verifica que quien pregunta sea el propio autor de la
    // publicación o un administrador.
    $contexto = Autenticacion::requerirUsuario();

    $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

    if ($id <= 0) {
        Respuesta::error('Id inválido', 400);
    }

    $modelo      = new Publicacion();
    $publicacion = $modelo->obtenerPorIdSinFiltro($id);

    if ($publicacion === null) {
        Respuesta::error('No encontrada', 404);
    }

    $esDueno = $publicacion['idUsuario'] === (int) $contexto['usuario']['id_usuario'];
    $esAdministrador = ($contexto['usuario']['rol'] ?? null) === 'ADMINISTRADOR';

    if (!$esDueno && !$esAdministrador) {
        Respuesta::error('No tienes permiso para ver esta publicación.', 403);
    }

    unset($publicacion['idUsuario']);

    // Construir URLs completas - usar los nombres correctos
    if (! empty($publicacion['pdf'])) {
        $publicacion['pdf'] = rtrim(URL_BASE_ARCHIVOS, '/') . '/publicaciones/docs/' . basename($publicacion['pdf']);
    }

    if (! empty($publicacion['imagen'])) {
        $publicacion['imagen'] = rtrim(URL_BASE_ARCHIVOS, '/') . '/publicaciones/img/' . basename($publicacion['imagen']);
    }

    Respuesta::json(['exito' => true, 'datos' => $publicacion]);
} catch (Throwable $e) {
    Respuesta::error($e->getMessage(), 500);
}
