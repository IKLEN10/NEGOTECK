<?php
require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../../helpers/Autenticacion.php';
require_once __DIR__ . '/../../models/Usuario.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    Respuesta::error('Método no permitido.', 405);
}

$contexto = Autenticacion::requerirUsuario();

Respuesta::json([
    'exito' => true,
    'usuario' => Usuario::publico($contexto['usuario']),
]);
