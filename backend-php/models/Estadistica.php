<?php
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/Presencia.php';

/**
 * Cifras que alimentan dos lugares del frontend:
 *  - BandaEstadisticas (sección "NEGOTECK en números" de la home): s1, s2, s3.
 *  - ContadoresEnVivo, junto al buscador del menú (useContadoresNavbar): s4, s5.
 *
 * IMPORTANTE (inconsistencia frontend vs. SQL):
 * El diseño original mostraba "Lectores mensuales" en s4, pero el esquema
 * no contiene ninguna tabla de tráfico/analítica por periodo (solo existe
 * `publicaciones.visitas`, un contador acumulado por publicación).
 * Mientras no exista una tabla de analítica real, se expone en su lugar
 * "Vistas totales" (suma de `visitas`), que sí es un dato genuino de la
 * base de datos: no se crea ningún contador nuevo ni duplicado, solo se
 * reutiliza la columna existente. Ver README del backend para más detalle.
 *
 * "Usuarios activos ahora" (s5) sí es una cifra nueva: se apoya en la
 * tabla `sesiones_activas` (ver models/Presencia.php y la migración
 * bd/migracion_sesiones_activas.sql), alimentada por un heartbeat que
 * manda el frontend, para no depender de una infraestructura de
 * WebSockets que el proyecto no tiene.
 *
 * s1, s2 y s3 usan tablas existentes (`publicaciones`, `usuarios`,
 * `areas`) y antes no se calculaban aquí, por lo que BandaEstadisticas
 * nunca recibía datos para esos ids y la sección terminaba sin
 * renderizarse una vez que la petición real reemplazaba los valores de
 * respaldo.
<<<<<<< HEAD

=======
>>>>>>> origin/style/orden-banner-encabezado
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
        $publicacionesAprobadas = (int) $this->conexion
            ->query("SELECT COUNT(*) FROM publicaciones WHERE estado = 'APROBADO'")
            ->fetchColumn();

        $autoresRegistrados = (int) $this->conexion
            ->query('SELECT COUNT(*) FROM usuarios WHERE activo = 1')
            ->fetchColumn();

        $areasActivas = (int) $this->conexion
            ->query('SELECT COUNT(*) FROM areas WHERE activo = 1')
            ->fetchColumn();

        $visitasAcumuladas = (int) $this->conexion
            ->query('SELECT COALESCE(SUM(visitas), 0) FROM publicaciones')
            ->fetchColumn();

        $usuariosActivos = (new Presencia())->contarActivas();

        return [
            ['id' => 's1', 'etiqueta' => 'Publicaciones publicadas', 'valor' => $this->formatearNumero($publicacionesAprobadas)],
            ['id' => 's2', 'etiqueta' => 'Autores registrados', 'valor' => $this->formatearNumero($autoresRegistrados)],
            ['id' => 's3', 'etiqueta' => 'Áreas de conocimiento', 'valor' => $this->formatearNumero($areasActivas)],
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
