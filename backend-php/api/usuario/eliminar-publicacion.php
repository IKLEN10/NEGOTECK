<?php
require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../../helpers/Autenticacion.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Respuesta::error('Método no permitido.', 405);
    exit;
}

try {
    $autenticado = Autenticacion::requerirUsuario();
    $usuario     = $autenticado['usuario'];
    $id_usuario  = $usuario['id_usuario'];

    // El ID viene por query parameter
    $id = (int) ($_GET['id_publicacion'] ?? 0);

    if (empty($id)) {
        Respuesta::error('ID de publicación requerido.', 400);
    }

    $pdo = Database::obtenerConexion();

    // Verificar que la publicación existe y pertenece al usuario
    $stmt = $pdo->prepare('
        SELECT id_publicacion, archivo_pdf, imagen_portada
        FROM publicaciones
        WHERE id_publicacion = ? AND id_usuario = ?
    ');
    $stmt->execute([$id, $id_usuario]);
    $publicacion = $stmt->fetch();

    if (! $publicacion) {
        Respuesta::error('Publicación no encontrada.', 404);
    }

    // Elimina también los archivos físicos (PDF/imagen de portada) para no
    // dejar basura huérfana en el servidor cada vez que se borra una
    // publicación. Si por alguna razón el archivo ya no existe en disco,
    // Archivos::eliminarArchivo() simplemente regresa false sin lanzar
    // error, así que nunca bloquea el borrado del registro.
    require_once __DIR__ . '/../../helpers/Archivos.php';
    $archivos = new Archivos();
    if (! empty($publicacion['archivo_pdf'])) {
        $archivos->eliminarArchivo('publicaciones/docs/' . basename($publicacion['archivo_pdf']));
    }
    if (! empty($publicacion['imagen_portada'])) {
        $archivos->eliminarArchivo('publicaciones/img/' . basename($publicacion['imagen_portada']));
    }

    // Eliminar la publicación
    $stmt = $pdo->prepare('
        DELETE FROM publicaciones
        WHERE id_publicacion = ? AND id_usuario = ?
    ');
    $stmt->execute([$id, $id_usuario]);

    Respuesta::json([
        'exito'   => true,
        'mensaje' => 'Publicación eliminada exitosamente.',
        'datos'   => ['id' => $id],
    ], 200);

} catch (Exception $e) {
    Respuesta::error($e->getMessage(), 400);
}
