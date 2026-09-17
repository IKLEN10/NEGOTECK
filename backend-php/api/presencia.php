<?php
require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/../helpers/Autenticacion.php';
require_once __DIR__ . '/../models/Presencia.php';

// Heartbeat de presencia: el frontend llama este endpoint al cargar
// cualquier página y luego de forma periódica (ver `usePresencia`) para
// que la cifra de "usuarios activos ahora" del inicio refleje tráfico
// real en vez de un valor fijo. No requiere sesión: funciona igual para
// visitantes anónimos y, si hay token, también se asocia al usuario.
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    Respuesta::error('Método no permitido.', 405);
}

$cuerpo = json_decode(file_get_contents('php://input'), true) ?? [];
$idSesion = trim((string) ($cuerpo['id_sesion'] ?? $_POST['id_sesion'] ?? ''));

if ($idSesion === '' || strlen($idSesion) > 64) {
    Respuesta::error('id_sesion inválido.', 422);
}

try {
    $usuario = Autenticacion::usuarioOpcional();
    $idUsuario = $usuario['id_usuario'] ?? null;

    $presencia = new Presencia();
    $presencia->registrar($idSesion, $idUsuario);

    Respuesta::json(['exito' => true]);
} catch (Throwable $excepcion) {
    Respuesta::error('No fue posible registrar la presencia.', 500);
}
