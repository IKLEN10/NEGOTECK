<?php

require_once __DIR__ . '/../../models/Publicacion.php';
require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../../helpers/Autenticacion.php';

try {

    // Obtener usuario autenticado mediante token
    $autenticado = Autenticacion::requerirUsuario();
    $usuario     = $autenticado['usuario'];
    $idUsuario   = (int) $usuario['id_usuario'];

    // Determinar qué endpoint se solicita
    $endpoint = $_GET['endpoint'] ?? null;

    $publicacion = new Publicacion();

    if ($endpoint === 'publicaciones') {
        // Obtener publicaciones del usuario (últimas 5)
        $datos = $publicacion->obtenerPorUsuario($idUsuario);

        Respuesta::json([
            'exito' => true,
            'datos' => array_slice($datos, 0, 5),
        ]);
    } elseif ($endpoint === 'estadisticas') {
        // Obtener estadísticas personales
        $misPublicaciones = $publicacion->obtenerPorUsuario($idUsuario);

        $estadisticas = [
            'total'      => count($misPublicaciones),
            'aprobadas'  => count(array_filter($misPublicaciones, fn($p) => $p['estado'] === 'APROBADO')),
            'pendientes' => count(array_filter($misPublicaciones, fn($p) => $p['estado'] === 'PENDIENTE')),
            'rechazadas' => count(array_filter($misPublicaciones, fn($p) => $p['estado'] === 'RECHAZADO')),
        ];

        Respuesta::json([
            'exito' => true,
            'datos' => $estadisticas,
        ]);
    } elseif ($endpoint === 'dashboard') {
        // Endpoint combinado: publicaciones + estadísticas
        $misPublicaciones = $publicacion->obtenerPorUsuario($idUsuario);

        $estadisticas = [
            'total'      => count($misPublicaciones),
            'aprobadas'  => count(array_filter($misPublicaciones, fn($p) => $p['estado'] === 'APROBADO')),
            'pendientes' => count(array_filter($misPublicaciones, fn($p) => $p['estado'] === 'PENDIENTE')),
            'rechazadas' => count(array_filter($misPublicaciones, fn($p) => $p['estado'] === 'RECHAZADO')),
        ];

        $actividad = [
            ['texto' => 'Tu publicación fue aprobada.', 'tiempo' => 'Hace 2 días'],
            ['texto' => 'El comité editorial dejó comentarios.', 'tiempo' => 'Hace 5 días'],
            ['texto' => 'Enviaste una nueva publicación.', 'tiempo' => 'Hace 1 semana'],
        ];

        Respuesta::json([
            'exito' => true,
            'datos' => [
                'usuario'       => [
                    'nombre'   => $usuario['nombre'],
                    'apellido' => $usuario['apellido'] ?? '',
                ],
                'estadisticas'  => $estadisticas,
                'publicaciones' => array_slice($misPublicaciones, 0, 5),
                'actividad'     => $actividad,
            ],
        ]);
    } else {
        throw new Exception('Endpoint no especificado o inválido');
    }

} catch (Exception $e) {

    Respuesta::json([
        'exito'   => false,
        'mensaje' => $e->getMessage(),
    ], 401);

}
