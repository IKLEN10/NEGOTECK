<?php
require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/../helpers/Autenticacion.php';
require_once __DIR__ . '/../helpers/Validador.php';
require_once __DIR__ . '/../models/Comentario.php';

/**
 * Sistema de comentarios de una publicación.
 *
 *   GET  /api/comentarios.php?id_publicacion=123   -> lista pública, sin auth
 *   POST /api/comentarios.php                       -> requiere Authorization: Bearer <token>
 *        body: { id_publicacion, contenido }
 */

$metodo = $_SERVER['REQUEST_METHOD'] ?? '';

if ($metodo === 'GET') {
    $idPublicacion = isset($_GET['id_publicacion']) ? (int) $_GET['id_publicacion'] : 0;

    if ($idPublicacion <= 0) {
        Respuesta::error('Id de publicación inválido.', 400);
    }

    try {
        $modelo = new Comentario();
        Respuesta::json([
            'exito' => true,
            'datos' => $modelo->obtenerPorPublicacion($idPublicacion),
        ]);
    } catch (Throwable $excepcion) {
        Respuesta::error('No fue posible obtener los comentarios.', 500);
    }
    return;
}

if ($metodo === 'POST') {
    // Autenticacion::requerirUsuario() ya responde 401 y termina la
    // ejecución si no hay un token válido, así que solo llegan aquí
    // usuarios con sesión iniciada.
    $contexto = Autenticacion::requerirUsuario();
    $usuario  = $contexto['usuario'];

    $cuerpo = json_decode(file_get_contents('php://input'), true);
    $cuerpo = is_array($cuerpo) ? $cuerpo : [];

    $idPublicacion = isset($cuerpo['id_publicacion']) ? (int) $cuerpo['id_publicacion'] : 0;
    // Se recortan espacios al inicio/fin y se colapsan espacios internos
    // repetidos (varios espacios/tabs seguidos) para evitar comentarios
    // rellenos únicamente de espacios en blanco.
    $contenido = trim((string) ($cuerpo['contenido'] ?? ''));
    $contenido = preg_replace('/[ \t]{2,}/', ' ', $contenido);

    if ($idPublicacion <= 0) {
        Respuesta::error('Id de publicación inválido.', 400);
    }

    $errorComentario = Validador::validarComentario($contenido);
    if ($errorComentario !== null) {
        Respuesta::error($errorComentario, 422);
    }

    try {
        $modelo = new Comentario();

        if (! $modelo->publicacionPublicadaExiste($idPublicacion)) {
            Respuesta::error('No se encontró esta publicación.', 404);
        }

        $comentario = $modelo->crear($idPublicacion, (int) $usuario['id_usuario'], $contenido);

        Respuesta::json([
            'exito'      => true,
            'mensaje'    => 'Comentario publicado.',
            'comentario' => $comentario,
        ], 201);
    } catch (Throwable $excepcion) {
        Respuesta::error('No fue posible publicar el comentario.', 500);
    }
    return;
}

Respuesta::error('Método no permitido.', 405);
