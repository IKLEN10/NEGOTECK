<?php

$configPDF = [
    'dir'             => RUTA_BASE_ARCHIVOS . "/publicaciones/docs",
    'extensiones'     => ['pdf'],
    'max_tamano'      => 10 * 1024 * 1024,

    'error_tamano'    => 'El archivo PDF no debe superar 10 MB.',
    'error_extension' => 'Solo se permiten archivos PDF.',
    'error_archivo'   => 'Error al subir el archivo PDF. Intenta nuevamente.',
];

$configIMG = [
    'dir'                  => RUTA_BASE_ARCHIVOS . "/publicaciones/img",
    'extensiones'          => ['jpg', 'jpeg', 'png'],
    'max_tamano'           => 5 * 1024 * 1024,

    'min_ancho'            => 800,
    'min_altura'           => 600,
    'max_ancho'            => 2000,
    'max_altura'           => 1500,

    'error_tamano'         => 'La imagen no debe superar 5 MB.',
    'error_extension'      => 'Solo se permiten imágenes JPG, JPEG o PNG.',
    'error_resolucion'     => 'No se pudo validar la resolución de la imagen.',
    'error_min_resolucion' => 'La imagen debe ser al menos de 800x600 píxeles.',
    'error_max_resolucion' => 'La imagen no debe superar 2000x1500 píxeles.',
    'error_archivo'        => 'Error al subir la imagen. Intenta nuevamente.',
];
