<?php
require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../../helpers/Autenticacion.php';
require_once __DIR__ . '/../../models/TokenAutenticacion.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    Respuesta::error('Método no permitido.', 405);
}

$contexto = Autenticacion::requerirUsuario();

$tokenModelo = new TokenAutenticacion();
$tokenModelo->revocarTokenLogin($contexto['token_hash']);

Respuesta::json(['exito' => true, 'mensaje' => 'Sesión cerrada correctamente.']);
