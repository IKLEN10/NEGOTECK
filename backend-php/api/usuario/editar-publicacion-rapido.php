<?php
require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../../helpers/ValidadorPublicaciones.php';
require_once __DIR__ . '/../../helpers/Autenticacion.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Respuesta::error('Método no permitido.', 405);
    exit;
}

try {
    $autenticado = Autenticacion::requerirUsuario();
    $usuario     = $autenticado['usuario'];
    $id_usuario  = $usuario['id_usuario'];

    $id      = (int) ($_POST['id'] ?? 0);
    $titulo  = trim(strip_tags($_POST['titulo'] ?? ''));
    $resumen = trim(strip_tags($_POST['resumen'] ?? ''));

    $errores = [];

    if (empty($id)) {
        Respuesta::error('ID de publicación requerido.', 400);
    }
    $pdo  = Database::obtenerConexion();
    $stmt = $pdo->prepare('SELECT id_publicacion FROM publicaciones WHERE id_publicacion = ? AND id_usuario = ?');
    $stmt->execute([$id, $id_usuario]);

    if (! $stmt->fetch()) {
        Respuesta::error('Publicación no encontrada.', 404);
    }

    // Validar solo título y resumen
    if (empty($titulo)) {
        $errores['titulo'] = 'El título es requerido.';
    } elseif (! ValidadorPublicacion::validarCantidadPalabras($titulo, 2, 20)) {
        $errores['titulo'] = 'El título debe tener entre 2 y 20 palabras.';
    } elseif (! ValidadorPublicacion::validarCaracteresPermitidos($titulo)) {
        $errores['titulo'] = 'El título contiene caracteres no permitidos. Solo se admiten letras (con acentos y ñ), números y los símbolos: . , ; : ( ) - _ " ¿ ? ¡ ! @ # $ / + % & =';
    }

    if (empty($resumen)) {
        $errores['resumen'] = 'El resumen es requerido.';
    } elseif (! ValidadorPublicacion::validarCantidadPalabras($resumen, 30, 100)) {
        $errores['resumen'] = 'El resumen debe tener entre 30 y 100 palabras.';
    } elseif (! ValidadorPublicacion::validarCaracteresPermitidos($resumen)) {
        $errores['resumen'] = 'El resumen contiene caracteres no permitidos. Solo se admiten letras (con acentos y ñ), números y los símbolos: . , ; : ( ) - _ " ¿ ? ¡ ! @ # $ / + % & =';
    }

    // Si hay errores, devolver todos
    if (! empty($errores)) {
        Respuesta::json([
            'exito'   => false,
            'errores' => $errores,
        ], 422);
    }

    $stmt = $pdo->prepare('
        UPDATE publicaciones
        SET titulo = ?, resumen = ?
        WHERE id_publicacion = ? AND id_usuario = ?
    ');

    $stmt->execute([$titulo, $resumen, $id, $id_usuario]);

    Respuesta::json([
        'exito'   => true,
        'mensaje' => 'Publicación actualizada exitosamente.',
        'datos'   => ['id' => $id],
    ], 200);

} catch (Exception $e) {
    Respuesta::error($e->getMessage(), 400);
}
