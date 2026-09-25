<?php
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/Presencia.php';
require_once __DIR__ . '/Vista.php';

/**
 * Cifras que alimentan dos lugares del frontend:
 *  - BandaEstadisticas (sección "NEGOTECK en números" de la home): s1, s2, s3.
 *  - ContadoresEnVivo, junto al buscador del menú (useContadoresNavbar): s4, s5.
 *
 * "Vistas totales" (s4) cuenta las visitas al sitio registradas en la
 * tabla `vistas` (tipo 'sitio'): una por sesión de pestaña del
 * navegador. Ver models/Vista.php y bd/migracion_vistas.sql.
 * Las vistas de cada publicación siguen en `publicaciones.visitas`.
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

        // "Vistas totales" = visitas al sitio (una por sesión de pestaña,
        // ver models/Vista.php). Ya no es la suma de las vistas de las
        // publicaciones: esas se siguen mostrando en cada tarjeta.
        $visitasAcumuladas = (new Vista())->contar(Vista::TIPO_SITIO);

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
