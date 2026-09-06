<?php
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../../models/Usuario.php';
require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../../helpers/Autenticacion.php';
require_once __DIR__ . '/../../config/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Respuesta::error('Método no permitido.', 405);
    exit;
}

try {
    $autenticado = Autenticacion::requerirUsuario();
    $usuario     = $autenticado['usuario'];
    $id_usuario  = $usuario['id_usuario'];

    $modeloUsuario = new Usuario();
    $perfil        = $modeloUsuario->buscarPorId($id_usuario);

    if (! $perfil) {
        Respuesta::error('Perfil no encontrado.', 404);
    }

    $fotoUrl = null;
    if ($perfil['foto_perfil']) {
        $fotoUrl = rtrim(URL_BASE_ARCHIVOS, '/') . '/perfiles/' . $perfil['foto_perfil'];
    }

    Respuesta::json([
        'exito' => true,
        'datos' => [
            'id'          => (int) $perfil['id_usuario'],
            'nombre'      => $perfil['nombre'],
            'apellidos'   => $perfil['apellidos'],
            'correo'      => $perfil['correo'],
            'institucion' => $perfil['institucion'],
            'biografia'   => $perfil['biografia'],
            'foto_perfil' => $fotoUrl,
        ],
    ]);

} catch (Exception $e) {
    Respuesta::error($e->getMessage(), 400);
}
