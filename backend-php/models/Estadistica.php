<?php
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/Presencia.php';

/**
 * Cifras en vivo que se muestran junto al buscador del menú (ver
 * BarraNavegacion → ContadoresEnVivo / useContadoresNavbar en el
 * frontend): vistas totales de la revista y usuarios activos ahora.
 *
 * IMPORTANTE (inconsistencia frontend vs. SQL):
 * El diseño original mostraba "Lectores mensuales", pero el esquema no
 * contiene ninguna tabla de tráfico/analítica por periodo (solo existe
 * `publicaciones.visitas`, un contador acumulado por publicación).
 * Mientras no exista una tabla de analítica real, se expone en su lugar
 * "Vistas totales" (suma de `visitas`), que sí es un dato genuino de la
 * base de datos: no se crea ningún contador nuevo ni duplicado, solo se
 * reutiliza la columna existente. Ver README del backend para más detalle.
 *
 * "Usuarios activos ahora" sí es una cifra nueva: se apoya en la tabla
 * `sesiones_activas` (ver models/Presencia.php y la migración
 * bd/migracion_sesiones_activas.sql), alimentada por un heartbeat que
 * manda el frontend, para no depender de una infraestructura de
 * WebSockets que el proyecto no tiene.
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
        $visitasAcumuladas = (int) $this->conexion
            ->query('SELECT COALESCE(SUM(visitas), 0) FROM publicaciones')
            ->fetchColumn();

        $usuariosActivos = (new Presencia())->contarActivas();

        return [
            ['id' => 's4', 'etiqueta' => 'Vistas totales', 'valor' => $this->formatearNumero($visitasAcumuladas)],
            ['id' => 's5', 'etiqueta' => 'Usuarios activos ahora', 'valor' => (string) $usuariosActivos],
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
