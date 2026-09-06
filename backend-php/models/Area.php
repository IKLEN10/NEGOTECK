<?php
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../config/config.php';

/**
 * Acceso a datos de la tabla `areas`.
 * El "cantidad" de publicaciones ya no es un número fijo: se calcula
 * contando publicaciones aprobadas relacionadas (areas 1---N publicaciones).
 */
class Area
{
    private PDO $conexion;

    public function __construct()
    {
        $this->conexion = Database::obtenerConexion();
    }

    public function obtenerTodas(): array
    {
        $sql = "
            SELECT
                a.nombre,
                a.slug,
                a.resumen_breve,
                a.descripcion,
                a.imagen_portada,
                a.color,
                COUNT(p.id_publicacion) AS cantidad_publicaciones
            FROM areas a
            LEFT JOIN publicaciones p
                ON p.id_area = a.id_area
                AND p.estado = 'APROBADO'
            WHERE a.activo = 1
            GROUP BY a.id_area, a.nombre, a.slug, a.resumen_breve, a.descripcion, a.imagen_portada, a.color
            ORDER BY a.nombre ASC
        ";

        $filas = $this->conexion->query($sql)->fetchAll();

        return array_map([$this, 'mapearFila'], $filas);
    }

    private function mapearFila(array $fila): array
    {
        return [
            'id'           => $fila['slug'],
            'nombre'       => $fila['nombre'],
            'resumenBreve' => $fila['resumen_breve'],
            'descripcion'  => $fila['descripcion'],
            'imagen'       => $this->resolverUrlImagen($fila['imagen_portada']),
            'color'        => $fila['color'],
            'cantidad'     => (int) $fila['cantidad_publicaciones'],
        ];
    }

    private function resolverUrlImagen(?string $ruta): string
    {
        if (! $ruta) {
            return '';
        }
        if (str_starts_with($ruta, 'http://') || str_starts_with($ruta, 'https://')) {
            return $ruta;
        }
        // Las rutas que comienzan con / pertenecen al frontend (carpeta public).
        // Por ejemplo: /imagenes/administracion.jpg
        if (str_starts_with($ruta, '/')) {
            return $ruta;
        }
        // Las demás rutas relativas pertenecen a backend-php/uploads.
        return rtrim(URL_BASE_ARCHIVOS, '/') . '/' . ltrim($ruta, '/');
    }

    public function obtenerParaSelect(): array
    {
        $sql = "
        SELECT
            id_area,
            nombre
        FROM areas
        WHERE activo = 1
        ORDER BY nombre ASC
    ";

        return $this->conexion->query($sql)->fetchAll();
    }
}
