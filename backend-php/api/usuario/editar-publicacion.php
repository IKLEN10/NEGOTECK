<?php
require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../../models/Publicacion.php';
require_once __DIR__ . '/../../helpers/ValidadorPublicaciones.php';
require_once __DIR__ . '/../../helpers/Archivos.php';
require_once __DIR__ . '/../../config/archivos.php';
require_once __DIR__ . '/../../helpers/Autenticacion.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Respuesta::error('Método no permitido.', 405);
    exit;
}

try {
    $autenticado = Autenticacion::requerirUsuario();
    $usuario     = $autenticado['usuario'];
    $id_usuario  = $usuario['id_usuario'];

    $id            = (int) ($_POST['id'] ?? 0);
    $titulo        = trim(strip_tags($_POST['titulo'] ?? ''));
    $resumen       = trim(strip_tags($_POST['resumen'] ?? ''));
    $area          = (int) ($_POST['area'] ?? 0);
    $tipoContenido = $_POST['tipo_contenido'] ?? 'archivo';

    $errores = [];

    // Validar ID
    if (empty($id)) {
        Respuesta::error('ID de publicación requerido.', 400);
    }

    $publicacion = new Publicacion();
    $pubActual   = $publicacion->obtenerParaEditar($id, $id_usuario);

    if (! $pubActual) {
        Respuesta::error('Publicación no encontrada.', 404);
    }

    // Validaciones de texto
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

    if ($area === 0) {
        $errores['area'] = 'Debe seleccionar un área.';
    } elseif (! ValidadorPublicacion::validarArea($area)) {
        $errores['area'] = 'Área inválida.';
    }

    if (empty($tipoContenido)) {
        $errores['tipo_contenido'] = 'Debe seleccionar un tipo de contenido.';
    } elseif ($tipoContenido !== 'archivo' && $tipoContenido !== 'video') {
        $errores['tipo_contenido'] = 'Tipo de contenido inválido.';
    }

    // Archivos (opcionales en edición)
    $archivos  = new Archivos();
    $nombrePdf = $pubActual['archivo_pdf'];
    $nombreImg = $pubActual['imagen_portada'];
    $urlVideo  = $pubActual['url_video'];

    if ($tipoContenido === 'archivo') {
        // PDF opcional
        if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
            try {
                // Eliminar PDF anterior
                if ($pubActual['archivo_pdf']) {
                    $archivos->eliminarArchivo($pubActual['archivo_pdf']);
                }

                $doc       = $archivos->subirArchivo($_FILES['file'], $configPDF);
                $nombrePdf = $doc['nombre'];
            } catch (Exception $e) {
                $errores['archivo_pdf'] = $e->getMessage();
            }
        }

        // Imagen opcional
        if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
            try {
                // Eliminar imagen anterior
                if ($pubActual['imagen_portada']) {
                    $archivos->eliminarArchivo($pubActual['imagen_portada']);
                }

                $img       = $archivos->subirArchivo($_FILES['imagen'], $configIMG);
                $nombreImg = $img['nombre'];
            } catch (Exception $e) {
                $errores['imagen_portada'] = $e->getMessage();
            }
        }

        $urlVideo = null;
    } else {
        // Video
        $urlVideo = trim($_POST['url_video'] ?? '');

        if (empty($urlVideo)) {
            $errores['url_video'] = 'La URL del video es requerida.';
        } elseif (! ValidadorPublicacion::validarUrlVideo($urlVideo)) {
            $errores['url_video'] = 'La URL del video no es válida.';
        }

        $nombrePdf = null;
        $nombreImg = null;
    }

    // Si hay errores, devolver todos
    if (! empty($errores)) {
        Respuesta::json([
            'exito'   => false,
            'errores' => $errores,
        ], 422);
    }

    // Actualizar publicación
    $publicacion->actualizar($id, $id_usuario, [
        "titulo"         => $titulo,
        "resumen"        => $resumen,
        "archivo_pdf"    => $nombrePdf,
        "imagen_portada" => $nombreImg,
        "url_video"      => $urlVideo,
        "tipo_contenido" => $tipoContenido,
    ]);

    Respuesta::json([
        'exito'   => true,
        'mensaje' => 'Publicación actualizada exitosamente.',
        'datos'   => ['id' => $id],
    ], 200);

} catch (Exception $e) {
    Respuesta::error($e->getMessage(), 400);
}
