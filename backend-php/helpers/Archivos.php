<?php

class Archivos
{
    public function subirArchivo(array $archivo, array $config)
    {
        // Validar que el archivo exista
        if (! isset($archivo) || $archivo['error'] === UPLOAD_ERR_NO_FILE) {
            throw new Exception('El archivo es requerido.');
        }

        // Validar que la subida fue exitosa
        if ($archivo['error'] !== UPLOAD_ERR_OK) {
            throw new Exception($config['error_archivo'] ?? 'Error al subir el archivo.');
        }

        // Validar tamaño
        if ($archivo['size'] > $config['max_tamano']) {
            throw new Exception($config['error_tamano']);
        }

        // Validar extensión
        $extension = strtolower(pathinfo($archivo['name'], PATHINFO_EXTENSION));

        if (! in_array($extension, $config['extensiones'])) {
            throw new Exception($config['error_extension']);
        }

        // Validar resolución de imágenes (si aplica)
        if (isset($config['min_ancho'], $config['min_altura'])) {

            $info = getimagesize($archivo['tmp_name']);

            if (! $info) {
                throw new Exception($config['error_resolucion']);
            }

            [$ancho, $altura] = $info;

            if (
                $ancho < $config['min_ancho'] ||
                $altura < $config['min_altura']
            ) {
                throw new Exception($config['error_min_resolucion']);
            }

            if (
                $ancho > $config['max_ancho'] ||
                $altura > $config['max_altura']
            ) {
                throw new Exception($config['error_max_resolucion']);
            }
        }

        // Crear directorio si no existe
        if (! is_dir($config['dir'])) {
            mkdir($config['dir'], 0777, true);
        }

        // Generar nombre único
        $nombre     = substr(md5(uniqid(rand(), true)), 0, 10) . "." . $extension;
        $rutaFisica = $config['dir'] . "/" . $nombre;

        // Mover archivo
        if (! move_uploaded_file($archivo['tmp_name'], $rutaFisica)) {
            throw new Exception($config['error_archivo']);
        }

        return [
            'nombre' => $nombre,
        ];
    }

    public function eliminarArchivo(string $ruta): bool
    {
        if (! $ruta) {
            return false;
        }

        $rutaFisica = RUTA_BASE_ARCHIVOS . '/' . $ruta;

        if (file_exists($rutaFisica)) {
            return unlink($rutaFisica);
        }

        return false;
    }
}
