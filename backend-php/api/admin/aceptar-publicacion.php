<?php
require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../../models/Publicacion.php';
require_once __DIR__ . '/../../helpers/Autenticacion.php';

/**
 * Aprueba una publicación PENDIENTE: pasa a estado APROBADO y a partir de
 * ese momento aparece en la página principal (publicaciones-recientes.php /
 * publicaciones-destacadas.php ya solo exponen estado = 'APROBADO').
 *
 * POST /api/admin/aceptar-publicacion.php
 * Body (form-data): id_publicacion
 * Requiere: Authorization: Bearer <token> de un usuario con rol ADMINISTRADOR.
 */

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    Respuesta::error('Método no permitido.', 405);
}

try {
    Autenticacion::requerirRol('ADMINISTRADOR');

    $idPublicacion = (int) ($_POST['id_publicacion'] ?? 0);

    if ($idPublicacion <= 0) {
        Respuesta::error('Falta el id de la publicación.', 422);
    }

    $publicacion = new Publicacion();
    $actualizada = $publicacion->aprobar($idPublicacion);

    if (! $actualizada) {
        Respuesta::error('La publicación no existe o ya no está pendiente de revisión.', 404);
    }

    Respuesta::json([
        'exito'   => true,
        'mensaje' => 'Publicación aprobada. Ya aparece en la página principal.',
    ]);
} catch (Throwable $excepcion) {
    Respuesta::error('No se pudo aprobar la publicación.', 500);
}
