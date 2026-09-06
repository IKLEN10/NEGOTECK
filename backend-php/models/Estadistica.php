<?php
require_once __DIR__ . '/../config/Database.php';

/**
 * Cifras agregadas para la banda de estadísticas de la página principal.
 *
 * IMPORTANTE (inconsistencia frontend vs. SQL):
 * El diseño original mostraba "Lectores mensuales", pero el esquema no
 * contiene ninguna tabla de tráfico/analítica por periodo (solo existe
 * `publicaciones.visitas`, un contador acumulado por publicación).
 * Mientras no exista una tabla de analítica real, se expone en su lugar
 * "Visitas registradas" (suma de `visitas`), que sí es un dato genuino
 * de la base de datos. Ver README del backend para más detalle.
 */
class Estadistica
{
    private PDO $conexion;

    public function __construct()
    {
        $this->conexion = Database::obtenerConexion();
    }

    public function obtenerResumen(): array
    {
        $publicacionesActivas = (int) $this->conexion
            ->query("SELECT COUNT(*) FROM publicaciones WHERE estado = 'APROBADO'")
            ->fetchColumn();

        $autoresRegistrados = (int) $this->conexion
            ->query("
                SELECT COUNT(*)
                FROM usuarios u
                INNER JOIN roles r ON r.id_rol = u.id_rol
                WHERE r.nombre = 'AUTOR' AND u.activo = 1
            ")
            ->fetchColumn();

        $areasActivas = (int) $this->conexion
            ->query('SELECT COUNT(*) FROM areas WHERE activo = 1')
            ->fetchColumn();

        $visitasAcumuladas = (int) $this->conexion
            ->query('SELECT COALESCE(SUM(visitas), 0) FROM publicaciones')
            ->fetchColumn();

        return [
            ['id' => 's1', 'etiqueta' => 'Publicaciones activas', 'valor' => (string) $publicacionesActivas],
            ['id' => 's2', 'etiqueta' => 'Autores registrados', 'valor' => (string) $autoresRegistrados],
            ['id' => 's3', 'etiqueta' => 'Áreas de investigación', 'valor' => (string) $areasActivas],
            ['id' => 's4', 'etiqueta' => 'Visitas registradas', 'valor' => $this->formatearNumero($visitasAcumuladas)],
        ];
    }

    private function formatearNumero(int $numero): string
    {
        if ($numero >= 1000) {
            return round($numero / 1000, 1) . 'K';
        }
        return (string) $numero;
    }
}
