<?php
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../../config/archivos.php';
require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../../helpers/Autenticacion.php';
require_once __DIR__ . '/../../helpers/Archivos.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Respuesta::error('Método no permitido.', 405);
    exit;
}

try {
    $autenticado = Autenticacion::requerirUsuario();
    $usuario     = $autenticado['usuario'];
    $id_usuario  = $usuario['id_usuario'];

    // Validar que haya archivo
    if (! isset($_FILES['foto']) || $_FILES['foto']['error'] === UPLOAD_ERR_NO_FILE) {
        Respuesta::error('La foto es requerida.', 422);
    }

    // Configuración para foto de perfil
    $configFoto = [
        'dir'                  => RUTA_BASE_ARCHIVOS . "/perfiles",
        'extensiones'          => ['jpg', 'jpeg', 'png', 'gif'],
        'max_tamano'           => 2 * 1024 * 1024, // 2MB
        'min_ancho'            => 100,
        'min_altura'           => 100,
        'max_ancho'            => 2000,
        'max_altura'           => 2000,
        'error_tamano'         => 'La foto no debe superar 2 MB.',
        'error_extension'      => 'Solo se permiten imágenes JPG, JPEG, PNG o GIF.',
        'error_resolucion'     => 'No se pudo validar la resolución de la imagen.',
        'error_min_resolucion' => 'La imagen debe ser al menos de 100x100 píxeles.',
        'error_max_resolucion' => 'La imagen no debe superar 2000x2000 píxeles.',
        'error_archivo'        => 'Error al subir la foto.',
    ];

    // Subir archivo
    $archivos = new Archivos();

    try {
        $foto       = $archivos->subirArchivo($_FILES['foto'], $configFoto);
        $nombreFoto = $foto['nombre'];
    } catch (Exception $e) {
        Respuesta::error($e->getMessage(), 400);
    }

    // Actualizar en BD
    $pdo  = Database::obtenerConexion();
    $stmt = $pdo->prepare('
        UPDATE usuarios
        SET foto_perfil = ?
        WHERE id_usuario = ?
    ');

    $stmt->execute([$nombreFoto, $id_usuario]);

    Respuesta::json([
        'exito'   => true,
        'mensaje' => 'Foto actualizada exitosamente.',
        'datos'   => [
            'foto_perfil' => $nombreFoto,
        ],
    ], 200);

} catch (Exception $e) {
    Respuesta::error($e->getMessage(), 400);
}
