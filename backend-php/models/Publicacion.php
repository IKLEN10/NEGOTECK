<?php
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../config/config.php';

/**
 * Acceso a datos de la tabla `publicaciones` para la página principal.
 *
 * Relaciones utilizadas (ya existentes en el SQL, ninguna inventada):
 *  - publicaciones.id_area      -> areas.id_area
 *  - publicaciones.id_usuario   -> usuarios.id_usuario   (autor/creador principal)
 *  - publicaciones_autores      -> autor(es) declarados de la publicación,
 *                                   se usa el marcado como es_principal = 1
 *                                   porque puede no coincidir con id_usuario
 *                                   (coautores sin cuenta registrada).
 *
 * Solo se exponen públicamente publicaciones con estado = 'APROBADO',
 * que es el estado editorial equivalente a "publicado".
 */
class Publicacion
{
    private PDO $conexion;

    public function __construct()
    {
        $this->conexion = Database::obtenerConexion();
    }

    public function obtenerRecientes(int $limite = 5): array
    {
        $limite = $this->normalizarLimite($limite, 5, 20);

        $sql = $this->consultaBase() . '
            ORDER BY COALESCE(p.fecha_publicacion, p.fecha_registro) DESC
            LIMIT :limite
        ';

        $consulta = $this->conexion->prepare($sql);
        $consulta->bindValue(':limite', $limite, PDO::PARAM_INT);
        $consulta->execute();

        return array_map([$this, 'mapearFila'], $consulta->fetchAll());
    }

    /**
     * Publicaciones aprobadas ordenadas por número de vistas (p.visitas),
     * de mayor a menor. Empate por fecha de publicación más reciente.
     */
    public function obtenerMasVistas(int $limite = 6): array
    {
        $limite = $this->normalizarLimite($limite, 6, 20);

        $sql = $this->consultaBase() . '
            ORDER BY p.visitas DESC, COALESCE(p.fecha_publicacion, p.fecha_registro) DESC
            LIMIT :limite
        ';

        $consulta = $this->conexion->prepare($sql);
        $consulta->bindValue(':limite', $limite, PDO::PARAM_INT);
        $consulta->execute();

        return array_map([$this, 'mapearFila'], $consulta->fetchAll());
    }

    /**
     * Trae una publicación aprobada por su id.
     * Usada por la página de detalle ("Ver más") del frontend.
     */
    public function obtenerPorId(int $idPublicacion): ?array
    {
        $sql = $this->consultaBase() . ' AND p.id_publicacion = :id LIMIT 1';

        $consulta = $this->conexion->prepare($sql);
        $consulta->bindValue(':id', $idPublicacion, PDO::PARAM_INT);
        $consulta->execute();
        $fila = $consulta->fetch();

        if (! $fila) {
            return null;
        }

        return $this->mapearFila($fila);
    }

    public function incrementarVisitas(int $idPublicacion): void
    {
        $consulta = $this->conexion->prepare(
            'UPDATE publicaciones SET visitas = visitas + 1 WHERE id_publicacion = :id'
        );
        $consulta->execute([':id' => $idPublicacion]);
    }

    /**
     * Consulta base compartida: trae la publicación con su área y autor
     * mediante los JOIN que ya permite el esquema.
     */
    private function consultaBase(): string
    {
        return "
            SELECT
                p.id_publicacion,
                p.titulo,
                p.resumen,
                p.archivo_pdf,
                p.imagen_portada,
                p.fecha_registro,
                p.fecha_publicacion,
                p.destacado,
                p.visitas,
                p.tipo_contenido,
                p.url_video,
                a.slug   AS area_slug,
                a.nombre AS area_nombre,
                a.color  AS area_color,
                u.nombre     AS usuario_nombre,
                u.apellidos  AS usuario_apellidos,
                pa.nombre_autor AS autor_principal_nombre
            FROM publicaciones p
            INNER JOIN areas a
                ON a.id_area = p.id_area
            INNER JOIN usuarios u
                ON u.id_usuario = p.id_usuario
            LEFT JOIN publicaciones_autores pa
                ON pa.id_publicacion = p.id_publicacion
                AND pa.es_principal = 1
            WHERE p.estado = 'APROBADO'
        ";
    }

    private function mapearFila(array $fila): array
    {
        // Prioriza el nombre declarado en publicaciones_autores (es_principal);
        // si no existe ese registro, cae al usuario creador de la publicación.
        $nombreAutor = $fila['autor_principal_nombre']
            ?: trim($fila['usuario_nombre'] . ' ' . $fila['usuario_apellidos']);

        return [
            'id'            => (int) $fila['id_publicacion'],
            'titulo'        => $fila['titulo'],
            'resumen'       => $fila['resumen'],
            'imagen'        => $this->resolverUrlArchivo($fila['imagen_portada'], 'publicaciones/img'),
            'pdf'           => $fila['archivo_pdf'] ? $this->resolverUrlArchivo($fila['archivo_pdf'], 'publicaciones/docs') : null,
            'fecha'         => $fila['fecha_publicacion'] ?? $fila['fecha_registro'],
            'destacado'     => (bool) $fila['destacado'],
            'visitas'       => (int) $fila['visitas'],
            'tipoContenido' => $fila['tipo_contenido'] ?? 'archivo',
            'urlVideo'      => $fila['url_video'] ?? null,
            'area'          => [
                'id'     => $fila['area_slug'],
                'nombre' => $fila['area_nombre'],
                'color'  => $fila['area_color'],
            ],
            'autor'         => [
                'nombre' => $nombreAutor !== '' ? $nombreAutor : 'Autor invitado',
            ],
        ];
    }

    /**
     * Convierte el valor guardado en la BD en una URL pública válida.
     *
     * Las publicaciones nuevas guardan únicamente el nombre del archivo
     * (por ejemplo: 160ec293f9.png), mientras que físicamente se almacena en:
     * uploads/publicaciones/img/ o uploads/publicaciones/docs/.
     */
    private function resolverUrlArchivo(?string $ruta, string $subdirectorio): string
    {
        if (! $ruta) {
            return '';
        }

        $ruta = trim($ruta);

        // Mantener URLs externas o absolutas que ya sean válidas.
        if (str_starts_with($ruta, 'http://') || str_starts_with($ruta, 'https://')) {
            return $ruta;
        }

        // Rutas del frontend, por ejemplo /imagenes/portada.jpg.
        if (str_starts_with($ruta, '/')) {
            return $ruta;
        }

        $rutaNormalizada = ltrim(str_replace('\\', '/', $ruta), '/');

        // Compatibilidad si la BD ya contiene una ruta relativa completa.
        if (str_starts_with($rutaNormalizada, 'uploads/')) {
            return rtrim(URL_BASE, '/') . '/' . $rutaNormalizada;
        }

        if (str_starts_with($rutaNormalizada, 'publicaciones/')) {
            return rtrim(URL_BASE_ARCHIVOS, '/') . '/' . $rutaNormalizada;
        }

        // Caso normal: la BD contiene solamente el nombre generado al subirlo.
        return rtrim(URL_BASE_ARCHIVOS, '/')
        . '/' . trim($subdirectorio, '/')
        . '/' . basename($rutaNormalizada);
    }

    private function normalizarLimite(int $limite, int $porDefecto, int $maximo): int
    {
        if ($limite <= 0) {
            return $porDefecto;
        }
        return min($limite, $maximo);
    }

    // Crear publicaciones

    public function crear(array $datos): int
    {
        $sql = "
        INSERT INTO publicaciones
        (
            id_area,
            id_usuario,
            titulo,
            resumen,
            archivo_pdf,
            imagen_portada,
            url_video,
            tipo_contenido,
            fecha_registro,
            estado
        )
        VALUES
        (
            :area,
            :usuario,
            :titulo,
            :resumen,
            :pdf,
            :imagen,
            :url_video,
            :tipo_contenido,
            NOW(),
            'PENDIENTE'
        )
    ";

        $consulta = $this->conexion->prepare($sql);

        $consulta->execute([
            ':area'           => $datos['id_area'],
            ':usuario'        => $datos['id_usuario'],
            ':titulo'         => $datos['titulo'],
            ':resumen'        => $datos['resumen'],
            ':pdf'            => $datos['archivo_pdf'],
            ':imagen'         => $datos['imagen_portada'],
            ':url_video'      => $datos['url_video'],
            ':tipo_contenido' => $datos['tipo_contenido'],
        ]);

        return (int) $this->conexion->lastInsertId();
    }

    public function obtenerPorUsuario(int $idUsuario): array
    {
        $sql = "
        SELECT
            p.id_publicacion,
            p.titulo,
            p.resumen,
            p.imagen_portada,
            p.fecha_registro,
            p.fecha_publicacion,
            p.estado,
            p.visitas,
            p.destacado,
            a.slug AS area_slug,
            a.nombre AS area_nombre,
            a.color AS area_color
        FROM publicaciones p
        INNER JOIN areas a
            ON a.id_area = p.id_area
        WHERE p.id_usuario = :usuario
        ORDER BY p.fecha_registro DESC
    ";

        $consulta = $this->conexion->prepare($sql);

        $consulta->execute([
            ':usuario' => $idUsuario,
        ]);

        return array_map([$this, 'mapearPublicacionUsuario'], $consulta->fetchAll());
    }
    private function mapearPublicacionUsuario(array $fila): array
    {
        return [
            'id'        => (int) $fila['id_publicacion'],
            'titulo'    => $fila['titulo'],
            'resumen'   => $fila['resumen'],
            'imagen'    => $this->resolverUrlArchivo($fila['imagen_portada'], 'publicaciones/img'),
            'estado'    => $fila['estado'],
            'fecha'     => $fila['fecha_publicacion'] ?? $fila['fecha_registro'],
            'visitas'   => (int) $fila['visitas'],
            'destacado' => (bool) $fila['destacado'],
            'area'      => [
                'id'     => $fila['area_slug'],
                'nombre' => $fila['area_nombre'],
                'color'  => $fila['area_color'],
            ],
        ];
    }

    public function obtenerPendientes(): array
    {
        $sql = "
        SELECT
            p.id_publicacion,
            p.titulo,
            p.resumen,
            p.fecha_registro,
            p.estado,
            a.slug AS area_slug,
            a.nombre AS area_nombre,
            a.color AS area_color
        FROM publicaciones p
        INNER JOIN areas a
            ON a.id_area = p.id_area
        WHERE p.estado = 'PENDIENTE'
        ORDER BY p.fecha_registro ASC
    ";

        $consulta = $this->conexion->prepare($sql);

        $consulta->execute();

        return array_map(
            [$this, 'mapearPublicacionPendiente'],
            $consulta->fetchAll()
        );
    }
    private function mapearPublicacionPendiente(array $fila): array
    {
        return [
            'id'      => (int) $fila['id_publicacion'],
            'titulo'  => $fila['titulo'],
            'resumen' => $fila['resumen'],
            'fecha'   => $fila['fecha_registro'],
            'estado'  => $fila['estado'],

            'area'    => [
                'id'     => $fila['area_slug'],
                'nombre' => $fila['area_nombre'],
                'color'  => $fila['area_color'],
            ],
        ];
    }
    public function rechazar(
        int $idPublicacion,
        string $observacion
    ): bool {

        $sql = "
        UPDATE publicaciones
        SET
            estado = 'RECHAZADO',
            observaciones_editor = :observacion,
            fecha_actualizacion = NOW()
        WHERE id_publicacion = :id
        AND estado = 'PENDIENTE'
    ";

        $consulta = $this->conexion->prepare($sql);

        $consulta->execute([
            ':observacion' => $observacion,
            ':id'          => $idPublicacion,
        ]);

        return $consulta->rowCount() > 0;
    }
    public function aprobar(
        int $idPublicacion
    ): bool {

        $sql = "
        UPDATE publicaciones
        SET
            estado = 'APROBADO',
            fecha_publicacion = NOW(),
            fecha_actualizacion = NOW()
        WHERE id_publicacion = :id
        AND estado = 'PENDIENTE'
    ";

        $consulta = $this->conexion->prepare($sql);

        $consulta->execute([
            ':id' => $idPublicacion,
        ]);

        return $consulta->rowCount() > 0;
    }
    public function obtenerParaEditar(int $idPublicacion, int $idUsuario): ?array
    {
        $sql = "
    SELECT
        p.id_publicacion,
        p.titulo,
        p.resumen,
        p.id_area,
        p.tipo_contenido,
        p.url_video,
        p.archivo_pdf,
        p.imagen_portada,
        p.estado,
        p.observaciones_editor,
        p.fecha_registro,
        a.nombre AS area_nombre
    FROM publicaciones p
    INNER JOIN areas a
        ON a.id_area = p.id_area
    WHERE p.id_publicacion = :id
    AND p.id_usuario = :usuario
    ";

        $consulta = $this->conexion->prepare($sql);

        $consulta->execute([
            ':id'      => $idPublicacion,
            ':usuario' => $idUsuario,
        ]);

        $fila = $consulta->fetch();

        if (! $fila) {
            return null;
        }

        return [
            'id'             => (int) $fila['id_publicacion'],
            'titulo'         => $fila['titulo'],
            'resumen'        => $fila['resumen'],
            'id_area'        => (int) $fila['id_area'],
            'tipo_contenido' => $fila['tipo_contenido'],
            'url_video'      => $fila['url_video'],
            'archivo_pdf'    => $fila['archivo_pdf'],
            'imagen_portada' => $fila['imagen_portada'],
            'estado'         => $fila['estado'],
            'motivo_rechazo' => $fila['observaciones_editor'],
            'fecha_registro' => $fila['fecha_registro'],
            'area_nombre'    => $fila['area_nombre'],
        ];
    }

    public function actualizar(int $idPublicacion, int $idUsuario, array $datos): bool
    {
        // Obtener estado actual
        $sqlEstado      = "SELECT estado FROM publicaciones WHERE id_publicacion = :id AND id_usuario = :usuario";
        $consultaEstado = $this->conexion->prepare($sqlEstado);
        $consultaEstado->execute([':id' => $idPublicacion, ':usuario' => $idUsuario]);
        $resultado = $consultaEstado->fetch();

        if (! $resultado) {
            throw new Exception('publicacion_no_encontrada');
        }

        $estadoActual = $resultado['estado'];

        // Solo permite editar si está PENDIENTE o RECHAZADO
        if ($estadoActual !== 'PENDIENTE' && $estadoActual !== 'RECHAZADO') {
            throw new Exception('no_puede_editarse');
        }

        // Si estaba RECHAZADO, vuelve a PENDIENTE
        $nuevoEstado = 'PENDIENTE';

        $sql = " UPDATE publicaciones
    SET
        titulo = :titulo,
        resumen = :resumen,
        archivo_pdf = :pdf,
        imagen_portada = :imagen,
        url_video = :url_video,
        tipo_contenido = :tipo_contenido,
        estado = :estado,
        observaciones_editor = NULL,
        fecha_actualizacion = NOW()
    WHERE id_publicacion = :id
    AND id_usuario = :usuario
    ";

        $consulta = $this->conexion->prepare($sql);

        $consulta->execute([
            ':titulo'         => $datos['titulo'],
            ':resumen'        => $datos['resumen'],
            ':pdf'            => $datos['archivo_pdf'],
            ':imagen'         => $datos['imagen_portada'],
            ':url_video'      => $datos['url_video'],
            ':tipo_contenido' => $datos['tipo_contenido'],
            ':estado'         => $nuevoEstado,
            ':id'             => $idPublicacion,
            ':usuario'        => $idUsuario,
        ]);

        return $consulta->rowCount() > 0;
    }

    public function obtenerPorIdSinFiltro(int $idPublicacion): ?array
    {
        $sql = "
    SELECT
        p.id_publicacion, p.titulo, p.resumen, p.archivo_pdf, p.imagen_portada,
        p.fecha_registro, p.fecha_publicacion, p.estado, p.observaciones_editor,
        p.destacado, p.visitas, p.url_video, p.tipo_contenido,
        a.id_area, a.slug AS area_slug, a.nombre AS area_nombre, a.color AS area_color,
        u.id_usuario, u.nombre AS usuario_nombre, u.apellidos AS usuario_apellidos, u.foto_perfil,
        pa.nombre_autor AS autor_principal_nombre
    FROM publicaciones p
    INNER JOIN areas a ON a.id_area = p.id_area
    INNER JOIN usuarios u ON u.id_usuario = p.id_usuario
    LEFT JOIN publicaciones_autores pa ON pa.id_publicacion = p.id_publicacion AND pa.es_principal = 1
    WHERE p.id_publicacion = :id
    LIMIT 1
    ";

        $consulta = $this->conexion->prepare($sql);
        $consulta->bindValue(':id', $idPublicacion, PDO::PARAM_INT);
        $consulta->execute();
        $fila = $consulta->fetch();

        if (! $fila) {
            return null;
        }
        $publicacion                 = $this->mapearFila($fila);
        $publicacion['razonRechazo'] = $fila['observaciones_editor'] ?? null;
        $publicacion['imagen']       = $fila['imagen_portada'] ?? null;
        $publicacion['pdf']          = $fila['archivo_pdf'] ?? null;
        // Expuesto solo para que el endpoint pueda verificar que quien pide
        // el detalle es el dueño de la publicación (o un administrador)
        // antes de responder; no forma parte del contrato público normal.
        $publicacion['idUsuario'] = (int) $fila['id_usuario'];

        return $publicacion;
    }
}
