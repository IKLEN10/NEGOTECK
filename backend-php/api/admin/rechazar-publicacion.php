<?php
require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../../models/Publicacion.php';
require_once __DIR__ . '/../../helpers/Autenticacion.php';

/**
 * Rechaza una publicación PENDIENTE: pasa a estado RECHAZADO junto con la
 * observación del editor. El autor puede verla y volver a editarla (al
 * editar una publicación RECHAZADA, Publicacion::actualizar() la regresa
 * automáticamente a PENDIENTE).
 *
 * POST /api/admin/rechazar-publicacion.php
 * Body (form-data): id_publicacion, observaciones
 * Requiere: Authorization: Bearer <token> de un usuario con rol ADMINISTRADOR.
 */

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    Respuesta::error('Método no permitido.', 405);
}

try {
    Autenticacion::requerirRol('ADMINISTRADOR');

    $idPublicacion = (int) ($_POST['id_publicacion'] ?? 0);
    $observaciones = trim(strip_tags((string) ($_POST['observaciones'] ?? '')));

    $errores = [];

    if ($idPublicacion <= 0) {
        $errores['id_publicacion'] = 'Falta el id de la publicación.';
    }

    if ($observaciones === '') {
        $errores['observaciones'] = 'Debes indicar el motivo del rechazo.';
    } elseif (strlen($observaciones) > 500) {
        $errores['observaciones'] = 'El motivo no debe superar 500 caracteres.';
    }

    if (! empty($errores)) {
        Respuesta::json([
            'exito'   => false,
            'error'   => 'Revisa los campos marcados.',
            'errores' => $errores,
        ], 422);
    }

    $publicacion = new Publicacion();
    $actualizada = $publicacion->rechazar($idPublicacion, $observaciones);

    if (! $actualizada) {
        Respuesta::error('La publicación no existe o ya no está pendiente de revisión.', 404);
    }

    Respuesta::json([
        'exito'   => true,
        'mensaje' => 'Publicación rechazada. El autor podrá ver el motivo y volver a enviarla.',
    ]);
} catch (Throwable $excepcion) {
    Respuesta::error('No se pudo rechazar la publicación.', 500);
}
