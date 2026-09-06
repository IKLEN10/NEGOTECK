<?php
require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/../models/Publicacion.php';
require_once __DIR__ . '/../helpers/ValidadorPublicaciones.php';
require_once __DIR__ . '/../helpers/Archivos.php';
require_once __DIR__ . '/../config/archivos.php';
require_once __DIR__ . '/../helpers/Autenticacion.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Respuesta::error('Método no permitido.', 405);
    exit;
}

try {
    $autenticado = Autenticacion::requerirUsuario();
    $usuario     = $autenticado['usuario'];
    $id_usuario  = $usuario['id_usuario'];

    $titulo        = trim(strip_tags($_POST['titulo'] ?? ''));
    $resumen       = trim(strip_tags($_POST['resumen'] ?? ''));
    $area          = (int) ($_POST['area'] ?? 0);
    $tipoContenido = $_POST['tipo_contenido'] ?? 'archivo';

    $errores = [];

    $nombrePdf = null;
    $nombreImg = null;
    $urlVideo  = null;

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

    // Subida de archivos
    $archivos = new Archivos();

    if ($tipoContenido === 'archivo') {
        if (! isset($_FILES['file']) || $_FILES['file']['error'] === UPLOAD_ERR_NO_FILE) {
            $errores['archivo_pdf'] = 'El archivo PDF es requerido.';
        } else {
            try {
                $doc       = $archivos->subirArchivo($_FILES['file'], $configPDF);
                $nombrePdf = $doc['nombre'];
            } catch (Exception $e) {
                $errores['archivo_pdf'] = $e->getMessage();
            }
        }

        if (! isset($_FILES['imagen']) || $_FILES['imagen']['error'] === UPLOAD_ERR_NO_FILE) {
            $errores['imagen_portada'] = 'La imagen de portada es requerida.';
        } else {
            try {
                $img       = $archivos->subirArchivo($_FILES['imagen'], $configIMG);
                $nombreImg = $img['nombre'];
            } catch (Exception $e) {
                $errores['imagen_portada'] = $e->getMessage();
            }
        }

        $urlVideo = null;
    } else {
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

    // Insertar publicación
    $publicacion = new Publicacion();

    $id = $publicacion->crear([
        "id_area"        => $area,
        "id_usuario"     => $id_usuario,
        "titulo"         => $titulo,
        "resumen"        => $resumen,
        "archivo_pdf"    => $nombrePdf,
        "imagen_portada" => $nombreImg,
        "url_video"      => $urlVideo,
        "tipo_contenido" => $tipoContenido,
    ]);

    Respuesta::json([
        "exito"   => true,
        "mensaje" => "Publicación creada exitosamente.",
        "datos"   => ["id" => $id],
    ], 201);

} catch (Exception $e) {
    Respuesta::error($e->getMessage(), 400);
}
