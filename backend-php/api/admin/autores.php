<?php
require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../../models/Usuario.php';
require_once __DIR__ . '/../../helpers/Autenticacion.php';

/**
 * Lista los autores (rol AUTOR) registrados en la base de datos, con el
 * conteo real de sus publicaciones, para el panel del Administrador
 * General (ver src/pages/admin/PaginaAdminAutores.jsx). Antes esa
 * pantalla mostraba datos simulados de src/data/autores.js en vez de
 * usuarios reales.
 *
 * GET /api/admin/autores.php
 * Requiere: Authorization: Bearer <token> de un usuario con rol ADMINISTRADOR.
 */

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    Respuesta::error('Método no permitido.', 405);
}

try {
    Autenticacion::requerirRol('ADMINISTRADOR');

    $usuario = new Usuario();

    Respuesta::json([
        'exito' => true,
        'datos' => $usuario->obtenerAutoresConEstadisticas(),
    ]);
} catch (Throwable $excepcion) {
    Respuesta::error('No se pudieron obtener los autores.', 500);
}
