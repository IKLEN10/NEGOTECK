<?php

/**
 * Configuración general del backend.
 * Rutas dinámicas para LOCAL + HOSTING
 */

// RUTA_BASE (ruta física)
if (! defined('RUTA_BASE')) {
    define('RUTA_BASE', str_replace('\\', '/', realpath(__DIR__ . '/../')) . '/');
}

// Protocolo
$protocolo = (! empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https://' : 'http://';

// Host
$host = $_SERVER['HTTP_HOST'];

// Detectar ruta base correctamente (LOCAL + HOSTING)
$raizDocumentos = str_replace('\\', '/', realpath($_SERVER['DOCUMENT_ROOT']));
$rutaBase       = rtrim(str_replace('\\', '/', RUTA_BASE), '/');

// Obtener ruta relativa segura
$rutaRelativa = str_replace($raizDocumentos, '', $rutaBase);
$rutaRelativa = trim($rutaRelativa, '/');

// Si está en raíz
if ($rutaRelativa !== '') {
    $rutaRelativa = '/' . $rutaRelativa . '/';
} else {
    $rutaRelativa = '/';
}

// URL_BASE final
if (! defined('URL_BASE')) {
    define('URL_BASE', $protocolo . $host . $rutaRelativa);
}
