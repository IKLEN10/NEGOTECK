<?php
require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/../models/Vista.php';

// Registra una visita al sitio. El frontend lo llama al abrir el sitio
// en una pestaña (ver useVisitaSitio). Como la sesión es por pestaña y
// la tabla no admite duplicados por sesión, recargar o navegar entre
// secciones no suma: solo cuenta de nuevo si la persona cierra la
// pestaña y vuelve a entrar.
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    Respuesta::error('Método no permitido.', 405);
}

$cuerpo = json_decode(file_get_contents('php://input'), true) ?? [];
$idSesion = trim((string) ($cuerpo['id_sesion'] ?? $_POST['id_sesion'] ?? ''));

if (! Vista::idSesionValido($idSesion)) {
    Respuesta::error('id_sesion inválido.', 422);
}

try {
    $nueva = (new Vista())->registrar(Vista::TIPO_SITIO, 0, $idSesion);

    Respuesta::json([
        'exito' => true,
        'nueva' => $nueva,
    ]);
} catch (Throwable $excepcion) {
    Respuesta::error('No fue posible registrar la visita.', 500);
}
