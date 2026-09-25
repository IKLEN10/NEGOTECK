<?php
require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/../models/Publicacion.php';
require_once __DIR__ . '/../models/Vista.php';

try {
    $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

    if ($id <= 0) {
        Respuesta::error('Id de publicación inválido.', 400);
    }

    $modelo      = new Publicacion();
    $publicacion = $modelo->obtenerPorId($id);

    if ($publicacion === null) {
        Respuesta::error('No se encontró esta publicación.', 404);
    }

    // La vista la decide el servidor, no el navegador: se cuenta como
    // máximo una vez por sesión de pestaña (id_sesion). Recargar o
    // salir y volver a entrar en la misma pestaña no suma; cerrar la
    // pestaña y volver a entrar sí. Sin id_sesion válido (peticiones
    // directas, bots) no se cuenta nada.
    // `registrar_vista=0` se sigue respetando por compatibilidad.
    $idSesion       = trim((string) ($_GET['id_sesion'] ?? ''));
    $registrarVista = ($_GET['registrar_vista'] ?? '1') !== '0';

    if ($registrarVista && Vista::idSesionValido($idSesion)) {
        $conexion = Database::obtenerConexion();
        $conexion->beginTransaction();
        try {
            // Solo si la fila en `vistas` es nueva se incrementa el
            // contador acumulado `publicaciones.visitas`, que es el que
            // leen las tarjetas; así ambos nunca se desincronizan.
            if ((new Vista())->registrar(Vista::TIPO_PUBLICACION, $id, $idSesion)) {
                $modelo->incrementarVisitas($id);
            }
            $conexion->commit();
        } catch (Throwable $errorVista) {
            $conexion->rollBack();
            throw $errorVista;
        }

        // Se relee el valor real de la BD (en vez de sumar +1 en
        // memoria) para que el detalle muestre exactamente el mismo
        // número que verá la tarjeta al regresar al listado.
        $publicacion['visitas'] = $modelo->obtenerVisitas($id);
    }

    Respuesta::json([
        'exito' => true,
        'datos' => $publicacion,
    ]);
} catch (Throwable $excepcion) {
    Respuesta::error('No fue posible obtener la publicación.', 500);
}
