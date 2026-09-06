<?php
require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../../models/Publicacion.php';
require_once __DIR__ . '/../../helpers/Autenticacion.php';

/**
 * Lista las publicaciones en estado PENDIENTE para que el administrador
 * (rol ADMINISTRADOR) las revise y decida aceptarlas o rechazarlas.
 *
 * GET /api/admin/publicaciones-pendientes.php
 * Requiere: Authorization: Bearer <token> de un usuario con rol ADMINISTRADOR.
 */

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    Respuesta::error('Método no permitido.', 405);
}

try {
    Autenticacion::requerirRol('ADMINISTRADOR');

    $publicacion = new Publicacion();

    Respuesta::json([
        'exito' => true,
        'datos' => $publicacion->obtenerPendientes(),
    ]);
} catch (Throwable $excepcion) {
    Respuesta::error('No se pudieron obtener las publicaciones pendientes.', 500);
}
