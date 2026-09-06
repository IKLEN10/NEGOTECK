# NEGOTECK — Revista Digital (UI)

Proyecto de interfaz gráfica (front-end) para una revista digital académica, construido
con **React + Vite + React Router + Tailwind CSS**. Es una maqueta completamente visual:
no hay backend, base de datos, autenticación real ni llamadas a APIs. Toda la información
proviene de datos simulados en `src/data/`.

Todo el código interno (componentes, props, estados, hooks personalizados, archivos y
carpetas) está escrito en español para facilitar el desarrollo del backend. Se conservan
en inglés únicamente los identificadores propios de React/JavaScript (`useState`,
`useEffect`, `children`, `className`, etc.) y los de librerías externas.

## Identidad visual

- **Tipografía:** Poppins en toda la aplicación (títulos, textos, botones, formularios, tablas).
- **Colores de marca:** azul rey (`azulRey`), naranja (`naranja`) y verde (`verde`), definidos
  con variantes claras y oscuras en `tailwind.config.js`.

## Requisitos

- Node.js 18 o superior
- npm 9 o superior

## Guía de Instalación Local

### Clonar el repositorio

```bash
git clone <URL_DE_TU_REPOSITORIO>
cd NEGOTECK
```

### Instalación

```bash
npm install
# Crear archivo de variables de entorno
cp .env.example .env
```

Nota: Revisa el archivo .env recién creado y ajusta la variable VITE_API_URL según la ruta local de tu servidor PHP.

### Configurar la Base de Datos y el Backend

Abre tu gestor de base de datos local (phpMyAdmin, MySQL Workbench, DBeaver, etc.).

Crea una base de datos vacía (por ejemplo: revista_digital).

Importa el archivo SQL ubicado en la raíz del proyecto: base_datos_revista_digital.sql.

Asegúrate de que la carpeta backend-php/ sea accesible a través de tu servidor web local (XAMPP, WAMP, Laragon o Apache).

### Iniciar el entorno de desarrollo

```bash
npm run dev
```

La app quedará disponible en `http://localhost:5173`.

## Scripts

- `npm run dev` — servidor de desarrollo
- `npm run build` — build de producción en `dist/`
- `npm run preview` — sirve el build de producción localmente

## Estructura del proyecto

```
src/
  assets/         Recursos estáticos propios (íconos, imágenes locales)
  components/
    common/       Componentes reutilizables (TarjetaArea, TarjetaPublicacion, Insignia, Modal, CapaBusqueda, Esqueleto...)
    layout/       BarraNavegacion, BannerSuperior, PiePagina
    home/         Secciones de la página de inicio (Portada, CuadriculaAreas, ComoPublicar...)
    dashboard/    BarraLateral y componentes del panel del autor
  data/           Datos simulados: publicaciones, áreas, autores, varios (estadísticas, testimonios, FAQs)
  hooks/          useNotificacion (toasts), useRevelado (scroll reveal), useDesplazamientoArriba
  layouts/        DisenoPrincipal, DisenoAutenticacion, DisenoPanel
  pages/          Vistas de nivel de ruta (PaginaInicio, PaginaArea, PaginaDetallePublicacion...)
    dashboard/    Vistas del panel del autor (InicioPanel, PaginaMisPublicaciones, PaginaSubirPublicacion, PaginaPerfil)
  router/         Definición de rutas (EnrutadorApp)
  services/       Carpeta preparada (vacía) para integrar la futura API
  styles/         Reservada para estilos adicionales
```

## Rutas principales

| Ruta                   | Descripción                                                        |
| ---------------------- | ------------------------------------------------------------------ |
| `/`                    | Página de inicio (todas las secciones)                             |
| `/areas/:idArea`       | Publicaciones filtradas por área                                   |
| `/publicacion/:id`     | Detalle visual de una publicación (incluye sección de comentarios) |
| `/login`               | Inicio de sesión (simulado)                                        |
| `/registro`            | Registro de autor (simulado)                                       |
| `/recuperar`           | Recuperar contraseña (simulado)                                    |
| `/panel`               | Dashboard del autor                                                |
| `/panel/publicaciones` | Tabla de publicaciones del autor                                   |
| `/panel/subir`         | Formulario de nueva publicación                                    |
| `/panel/perfil`        | Perfil del autor                                                   |

## Sección de comentarios

La vista de detalle de publicación (`PaginaDetallePublicacion.jsx`) incluye una sección
"Comentarios" debajo del documento. Para publicaciones reales (las que vienen del backend
en `backend-php/`) los comentarios se cargan y publican contra `/api/comentarios.php`:
cualquiera puede leerlos, pero solo un usuario con sesión iniciada puede publicar uno nuevo
(si no ha iniciado sesión, se le muestra un aviso con un botón para ir a `/login`). Es un
sistema sencillo: solo nombre, fecha y contenido, sin respuestas, reacciones ni edición.
Las publicaciones de ejemplo (mock, con id no numérico) conservan los comentarios estáticos
de `comentariosEjemplo` en `src/data/publicaciones.js` únicamente como vista previa visual.

## Próximos pasos (fuera de alcance de este proyecto)

- Conectar `src/services/` a una API real.
- Sustituir `src/data/*.js` por llamadas HTTP, incluyendo la lógica real de comentarios.
- Implementar autenticación real (JWT, sesiones, etc.).
- Añadir modo oscuro (la paleta ya está preparada en `tailwind.config.js` con `darkMode: 'class'`).
