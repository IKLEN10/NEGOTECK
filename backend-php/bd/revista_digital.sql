-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 16-09-2026 a las 19:03:44
-- Versión del servidor: 11.8.9-MariaDB-log
-- Versión de PHP: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `revista_digital_fusionada_LIMPIA`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `areas`
--

CREATE TABLE `areas` (
  `id_area` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `slug` varchar(120) NOT NULL,
  `resumen_breve` varchar(180) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `imagen_portada` varchar(500) DEFAULT NULL,
  `color` varchar(30) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `areas`
--

INSERT INTO `areas` (`id_area`, `nombre`, `slug`, `resumen_breve`, `descripcion`, `imagen_portada`, `color`, `activo`, `fecha_registro`) VALUES
(1, 'Administración', 'administracion', 'Dirección, estrategia y gestión de organizaciones.', 'Contenido sobre planeación estratégica, liderazgo, recursos humanos, emprendimiento y administración de organizaciones públicas y privadas.', '/imagenes/administracion.jpg', 'azulRey', 1, '2026-07-21 09:33:30'),
(2, 'Economía', 'economia', 'Mercados, desarrollo y análisis económico.', 'Investigaciones y análisis sobre economía, políticas públicas, desarrollo regional, mercados y comportamiento económico.', '/imagenes/economia.jpg', 'naranja', 1, '2026-07-21 09:33:30'),
(3, 'Contabilidad y Finanzas', 'contabilidad-finanzas', 'Información financiera, costos e inversión.', 'Artículos sobre contabilidad, auditoría, impuestos, presupuestos, costos, inversiones y administración financiera.', '/imagenes/contabilidad-finanzas.jpg', 'verde', 1, '2026-07-21 09:33:30'),
(4, 'Mercadotecnia y Logística – Marketing digital', 'mercadotecnia-logistica-marketing-digital', 'Mercados, distribución y estrategias digitales.', 'Estudios sobre mercadotecnia, comportamiento del consumidor, logística, cadenas de suministro, comercio y marketing digital.', '/imagenes/mercadotecnia-logistica.jpg', 'naranja', 1, '2026-07-21 09:33:30'),
(5, 'Comercio Internacional y Comercio electrónico', 'comercio-internacional-comercio-electronico', 'Negocios globales y operaciones digitales.', 'Contenido sobre importaciones, exportaciones, tratados comerciales, negocios internacionales, plataformas digitales y comercio electrónico.', '/imagenes/comercio-internacional.jpg', 'azulRey', 1, '2026-07-21 09:33:30'),
(6, 'Tecnologías de Información, Business Intelligence, Big Data, Data Mining, etc.', 'tecnologias-informacion-bi-big-data-data-mining', 'Software, datos e inteligencia para los negocios.', 'Investigaciones sobre tecnologías de información, desarrollo de software, Business Intelligence, Big Data, minería de datos, inteligencia artificial y transformación digital.', '/imagenes/tecnologias-informacion.jpg', 'azulRey', 1, '2026-07-21 09:33:30'),
(7, 'Gestión de Conocimiento e Innovación', 'gestion-conocimiento-innovacion', 'Aprendizaje organizacional y creación de valor.', 'Artículos sobre gestión del conocimiento, innovación, creatividad, transferencia tecnológica y aprendizaje organizacional.', '/imagenes/gestion-conocimiento-innovacion.jpg', 'verde', 1, '2026-07-21 09:33:30'),
(8, 'Ingeniería', 'ingenieria', 'Diseño, procesos y soluciones tecnológicas.', 'Investigaciones y proyectos relacionados con ingeniería, optimización de procesos, automatización, manufactura, energía y desarrollo tecnológico.', '/imagenes/ingenieria.jpg', 'naranja', 1, '2026-07-21 09:33:30');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentarios`
--

CREATE TABLE `comentarios` (
  `id_comentario` bigint(20) UNSIGNED NOT NULL,
  `id_publicacion` bigint(20) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `contenido` text NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_publicaciones`
--

CREATE TABLE `historial_publicaciones` (
  `id_historial` bigint(20) UNSIGNED NOT NULL,
  `id_publicacion` bigint(20) UNSIGNED NOT NULL,
  `id_usuario_accion` int(10) UNSIGNED DEFAULT NULL,
  `tipo_evento` enum('CREADA','ENVIADA','CAMBIO_ESTADO','COMENTARIO_EDITOR','ELIMINADA') NOT NULL,
  `estado_anterior` enum('BORRADOR','PENDIENTE','APROBADO','RECHAZADO') DEFAULT NULL,
  `estado_nuevo` enum('BORRADOR','PENDIENTE','APROBADO','RECHAZADO') DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mensajes_contacto`
--

CREATE TABLE `mensajes_contacto` (
  `id_mensaje` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `correo` varchar(150) NOT NULL,
  `asunto` varchar(200) NOT NULL,
  `mensaje` text NOT NULL,
  `estado` enum('NUEVO','LEIDO','RESPONDIDO') NOT NULL DEFAULT 'NUEVO',
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

CREATE TABLE `notificaciones` (
  `id_notificacion` bigint(20) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `id_publicacion` bigint(20) UNSIGNED DEFAULT NULL,
  `tipo` enum('INFO','EXITO','ADVERTENCIA','ERROR') NOT NULL DEFAULT 'INFO',
  `mensaje` varchar(500) NOT NULL,
  `leida` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `palabras_clave`
--

CREATE TABLE `palabras_clave` (
  `id_palabra_clave` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `publicaciones`
--

CREATE TABLE `publicaciones` (
  `id_publicacion` bigint(20) UNSIGNED NOT NULL,
  `id_area` int(10) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `titulo` text NOT NULL,
  `resumen` text NOT NULL,
  `archivo_pdf` varchar(500) DEFAULT NULL,
  `imagen_portada` varchar(500) DEFAULT NULL,
  `estado` enum('BORRADOR','PENDIENTE','APROBADO','RECHAZADO') NOT NULL DEFAULT 'PENDIENTE',
  `destacado` tinyint(1) NOT NULL DEFAULT 0,
  `visitas` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `observaciones_editor` text DEFAULT NULL,
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_envio` datetime DEFAULT NULL,
  `fecha_publicacion` datetime DEFAULT NULL,
  `fecha_actualizacion` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `tipo_contenido` enum('archivo','video') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'archivo',
  `url_video` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `publicaciones`
--

INSERT INTO `publicaciones` (`id_publicacion`, `id_area`, `id_usuario`, `titulo`, `resumen`, `archivo_pdf`, `imagen_portada`, `estado`, `destacado`, `visitas`, `observaciones_editor`, `fecha_registro`, `fecha_envio`, `fecha_publicacion`, `fecha_actualizacion`, `tipo_contenido`, `url_video`) VALUES
(11, 1, 8, 'Importancia de la Gestión de Conocimiento en las Empresas Contemporáneas', 'Uno de los activos más valiosos, pero a menudo subestimado, es el conocimiento. La Gestión de Conocimiento (GC) se ha convertido en una herramienta esencial para las organizaciones que buscan mejorar su eficiencia, innovar y ser competitiva. Este artículo explora qué es la Gestión de Conocimiento, su importancia en el contexto empresarial moderno y cómo puede transformar la manera en que las empresas operan.', '1c1fdef23f.pdf', '4ea5e41db4.png', 'APROBADO', 0, 1, NULL, '2026-08-07 07:08:53', NULL, '2026-09-07 21:58:15', '2026-09-07 22:05:08', 'archivo', NULL),
(12, 2, 8, 'Las 10 principales necesidades y problemáticas de las PyMES Mexicanas', 'Las pequeñas y medianas empresas (PyMEs) son el corazón de la economía mexicana. En este artículo, exploramos las 10 principales necesidades y problemáticas de las PyMEs en México, con un enfoque sencillo para comprenderlas y plantear soluciones prácticas.', '5f0a7dea15.pdf', '45b37f2585.png', 'APROBADO', 0, 0, NULL, '2026-08-07 13:26:49', NULL, '2026-08-07 19:53:28', '2026-08-07 19:53:28', 'archivo', NULL),
(13, 2, 8, 'Avances tecnológicos en los core bancarios a nivel internacional', 'En 2024 los sistemas de core bancario han evolucionado de estructuras monolíticas a arquitecturas flexibles y orientadas a microservicios, mejorando así la escalabilidad y capacidad de integración. La inteligencia artificial y el aprendizaje automático optimizan la detección de fraudes y la personalización de servicios, mientras que la blockchain y la tecnología de registro distribuido mejoran la transparencia y eficiencia en las transacciones.', '77af2943e7.pdf', 'cb15f52440.png', 'APROBADO', 0, 0, NULL, '2026-08-07 13:30:49', NULL, '2026-08-07 19:53:29', '2026-08-07 19:53:29', 'archivo', NULL),
(14, 1, 8, 'Optimizando proyectos con herramientas Project Portfolio Management  (PPM)', 'En el entorno empresarial actual, las organizaciones se enfrentan a una creciente complejidad en la gestión de proyectos. Para abordar este desafío, muchas empresas recurren a la Gestión de Portafolio de Proyectos (PPM), una disciplina que permite coordinar y priorizar proyectos para alcanzar los objetivos estratégicos de la organización, así como gestionar recursos, elaborar presupuestos, gestionar finanzas y riesgos, dirigir e informar sobre proyectos, etc.', 'e0b20e1e25.pdf', '10a41e3885.png', 'APROBADO', 0, 1, NULL, '2026-08-07 13:34:35', NULL, '2026-08-07 19:53:36', '2026-08-07 19:54:07', 'archivo', NULL),
(15, 7, 8, 'Revolución digital y la importancia de la Universidad Corporativa', 'La capacitación empresarial ha experimentado una transformación significativa en la era digital. La adopción de tecnologías innovadoras ha permitido a las empresas ofrecer experiencias de aprendizaje más accesibles, personalizadas y efectivas. En este documento explicaremos la evolución de la capacitación empresarial a través de plataformas digitales y la importancia de contar con una universidad corporativa.', 'c94183c1ac.pdf', '3d1f363720.png', 'APROBADO', 0, 0, NULL, '2026-08-07 13:37:30', NULL, '2026-08-07 19:53:31', '2026-08-07 19:53:31', 'archivo', NULL),
(16, 1, 8, 'Kanban como método de Gestión de Proyectos', 'Dentro de la industria de tecnologías de la Información Kanban ha funcionado perfectamente gracias a que se listan de manera gráfica actividades específicas de los proyectos en curso, esto permite un alto nivel de seguimiento y cumplimiento de estas. Kanban es un método de gestión de proyectos en el que de manera gráfica se listan las actividades por hacer, las actividades en progreso y las tareas terminadas de múltiples equipos.', '77eb5a2ca3.pdf', 'ba6cb8d84f.png', 'APROBADO', 0, 0, NULL, '2026-08-07 13:40:27', NULL, '2026-08-07 19:53:35', '2026-08-07 19:53:35', 'archivo', NULL),
(17, 6, 8, 'Las alternativas tecnológicas en la Nube', 'Los servicios en la nube son los encargados de almacenar y procesar datos. Este tipo de servicios permiten la gestión de información y se ejecutan desde un servidor. Las nubes pueden ser híbridas, privadas o públicas. Entre las categorías de servicio en la nube más populares se encuentran las siguientes: Infraestructura (Iaas), Plataforma (PasS) y Software (SaaS). Sin embargo existen otros servicios que van surgiendo y que están generando valor a los usuarios, tales como Terminal as a Service (TaaS) y Payment Platform as a Service (PPaaS) propuestos por la empresa Ingenico.', 'ea4eea2cc3.pdf', '91ba896313.png', 'APROBADO', 0, 0, NULL, '2026-08-07 13:45:41', NULL, '2026-08-07 19:53:38', '2026-08-07 19:53:38', 'archivo', NULL),
(18, 6, 8, 'Transformación digital a través de la hiperautomatización', 'La hiperautomatización beneficia los procesos empresariales y forma parte del crecimiento digital. Conforme avanza la tecnología nos vemos en la necesidad de implementar nuevas herramientas que permitan facilitarnos las tareas diarias de cualquier entorno en el que nos encontremos.', '89e4e7a98c.pdf', '695d703f2e.png', 'APROBADO', 0, 0, NULL, '2026-08-07 13:52:55', NULL, '2026-08-07 19:53:39', '2026-08-07 19:53:39', 'archivo', NULL),
(19, 6, 8, 'Las posibilidades en el Metaverso', 'Dentro de las innovaciones de los últimos meses que se encuentran en desarrollo y crecimiento, está la próxima evolución de internet con la Web 3.0, se espera que para el año 2025 se produzcan más de 400,000 millones de dólares de ingresos a través del Metaverso. El Metaverso es un espacio digital de gran potencial que ofrece un sinfín de oportunidades en diferentes ámbitos: económico, social, tecnológico entre otros.', '5773ea38cc.pdf', '8462158921.png', 'APROBADO', 0, 1, NULL, '2026-08-07 13:56:22', NULL, '2026-08-07 19:53:41', '2026-08-07 19:55:48', 'archivo', NULL),
(20, 6, 8, 'AWS ¿Qué es y para qué sirve?', 'Amazon Web Services brinda una serie de servicios en la nube a través de internet, permite disponer de almacenamiento, bases de datos, aplicaciones móviles, redes, seguridad, identidad, facilidad de infraestructura, adaptabilidad, bajo costo y toda una colección de servicios a través de la plataforma de amazon.com. Es un tema relevante que atiende necesidades de capacidad e inversión accesibles en el desarrollo de aplicaciones que ayudan a transformar negocios.', 'f495e5cf2c.pdf', '8bf4a2662e.png', 'APROBADO', 0, 0, NULL, '2026-08-07 14:01:01', NULL, '2026-08-07 19:54:33', '2026-08-07 19:54:33', 'archivo', NULL),
(21, 7, 8, 'Conceptos generales sobre Gestión de Conocimiento, Tecnología e Innovación', 'Cuando se habla sobre Gestión de Conocimiento e Innovación es muy importante conocer algunos conceptos básicos generales que están relacionados con estas actividades y que determinan en gran medida la competitividad de una empresa u organización. Este artículo tiene como objetivo revisar algunos de estos conceptos tan importantes.', '63e1e416e7.pdf', '661fa4b488.png', 'APROBADO', 0, 2, NULL, '2026-08-07 14:04:15', NULL, '2026-08-07 19:54:35', '2026-08-07 19:57:44', 'archivo', NULL),
(22, 1, 8, 'The magic of teamwork', 'Since the dawn of humanity, people have gathered into groups to improve their chances of survival. It could be stated that humans work better as a herd. In companies, it is no different: when efficient work teams are formed, the best results are achieved. This article describes the characteristics, importance and benefits of Teamwork.', '5351ee7853.pdf', 'efa6244449.png', 'APROBADO', 0, 2, NULL, '2026-08-07 14:20:22', NULL, '2026-08-07 20:02:33', '2026-09-07 21:49:38', 'archivo', NULL),
(23, 7, 8, 'Las plataformas e-learning como opción para aumentar la capacidad y gestionar el conocimiento de las empresas.', 'Las plataformas e-learning o LMS (Learning Management System) son programas instalados en un servidor Web ofreciendo la posibilidad de conexión en línea desde cualquier lugar y a cualquier hora, facilitan materiales en diversos formatos y propósitos, como por ejemplo las herramientas colaborativas como Wikis, foros y chats que contribuyen a la captura y transformación de conocimiento tácito (experiencia) a conocimiento explícito (formal), logrando con ello parte de la gestión del conocimiento tanto en el ámbito académico como empresarial.', 'e727567989.pdf', '8c2c6b58f6.png', 'APROBADO', 0, 2, NULL, '2026-08-07 14:23:15', NULL, '2026-08-07 20:02:35', '2026-09-07 21:34:22', 'archivo', NULL),
(24, 6, 8, 'Tecnología en tiempos de pandemia', 'La tecnología se ha convertido en parte fundamental de nuestro día a día y se intensificó a partir de los primeros meses del año 2020 tras la aparición de la enfermedad por Coronavirus en 2019 (COVID-19) y posteriormente declarada como pandemia por su rápida propagación. Las necesidades han incrementado con el impacto de dicha pandemia, se tuvo que ampliar el uso de la tecnología, y con ello adaptarnos a los cambios necesarios para continuar con las actividades que hemos venido realizando antes de la llegada de la pandemia.', '2a68732809.pdf', 'ece253d35e.png', 'APROBADO', 0, 0, NULL, '2026-08-07 14:30:39', NULL, '2026-08-07 20:02:37', '2026-08-07 20:02:37', 'archivo', NULL),
(25, 7, 8, 'Importancia de los proyectos de innovación tecnológica', 'En la actualidad el término innovación es sinónimo de crecimiento y desarrollo, sin embargo, poco se habla del camino a seguir para lograr una innovación o un desarrollo tecnológico. En este video se explica la importancia de los proyectos de innovación tecnológica para ir de una idea creativa a la ', NULL, NULL, 'APROBADO', 0, 2, NULL, '2026-08-07 14:45:09', NULL, '2026-08-07 20:02:38', '2026-08-12 16:58:57', 'video', 'https://www.youtube.com/watch?v=aG0XMEt1EC8&t=4s'),
(26, 7, 8, 'Proceso de Gestión de Proyectos Tecnológicos y de Innovación', 'En la actualidad empresas como Apple, Tesla o Amazon, son sinónimos de Innovación por las mejoras que presentan a sus productos y servicios continuamente, sin embargo, poco se habla sobre los procesos necesarios para llegar a las innovaciones que son tan bien recibidas por el público. Es por ello, que en el presente artículo se analiza el proceso de gestión de proyectos tecnológicos y de innovación.', NULL, NULL, 'PENDIENTE', 0, 2, NULL, '2026-08-07 14:46:00', NULL, '2026-08-07 20:02:40', '2026-09-07 22:02:01', 'video', 'https://www.youtube.com/watch?v=y58_WSBQhdo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `publicaciones_autores`
--

CREATE TABLE `publicaciones_autores` (
  `id_publicacion_autor` bigint(20) UNSIGNED NOT NULL,
  `id_publicacion` bigint(20) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED DEFAULT NULL,
  `nombre_autor` varchar(180) NOT NULL,
  `correo_autor` varchar(150) DEFAULT NULL,
  `orden_autoria` tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  `es_principal` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `publicaciones_palabras_clave`
--

CREATE TABLE `publicaciones_palabras_clave` (
  `id_publicacion` bigint(20) UNSIGNED NOT NULL,
  `id_palabra_clave` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_rol` tinyint(3) UNSIGNED NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `descripcion` varchar(180) DEFAULT NULL,
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `nombre`, `descripcion`, `fecha_registro`) VALUES
(1, 'ADMINISTRADOR', 'Administra cuentas, áreas y configuración general.', '2026-07-21 09:33:30'),
(2, 'AUTOR', 'Crea y da seguimiento a sus publicaciones.', '2026-07-21 09:33:30');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tokens_login`
--

CREATE TABLE `tokens_login` (
  `id_token_login` bigint(20) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `token_hash` char(64) NOT NULL,
  `token_expira` datetime NOT NULL,
  `token_creado` datetime NOT NULL DEFAULT current_timestamp(),
  `token_revocado` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_uso` datetime DEFAULT NULL,
  `ip_cliente` varchar(45) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tokens_login`
--


-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tokens_recuperacion`
--

CREATE TABLE `tokens_recuperacion` (
  `id_token_recuperacion` bigint(20) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `token_hash` char(64) NOT NULL,
  `token_expira` datetime NOT NULL,
  `token_creado` datetime NOT NULL DEFAULT current_timestamp(),
  `token_usado` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_uso` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tokens_recuperacion`
--


-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tokens_registro`
--

CREATE TABLE `tokens_registro` (
  `id_token_registro` bigint(20) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `token_hash` char(64) NOT NULL,
  `token_expira` datetime NOT NULL,
  `token_creado` datetime NOT NULL DEFAULT current_timestamp(),
  `token_usado` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_uso` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tokens_registro`
--


-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `id_rol` tinyint(3) UNSIGNED NOT NULL DEFAULT 2,
  `nombre` varchar(80) NOT NULL,
  `apellidos` varchar(120) NOT NULL,
  `correo` varchar(150) NOT NULL,
  `contrasena_hash` varchar(255) NOT NULL,
  `foto_perfil` varchar(500) DEFAULT NULL,
  `institucion` varchar(180) DEFAULT NULL,
  `biografia` text DEFAULT NULL,
  `correo_verificado` tinyint(1) NOT NULL DEFAULT 0,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `id_rol`, `nombre`, `apellidos`, `correo`, `contrasena_hash`, `foto_perfil`, `institucion`, `biografia`, `correo_verificado`, `activo`, `fecha_registro`, `fecha_actualizacion`) VALUES
(4, 2, 'Jose Gadiel', 'Fuentes Trejo', 'josegadielft@gmail.com', '$2y$10$tpVITTziZZDGTp/ZuOw4iewxfE/tVWrZgh6gW28i2LbuSwphISebu', NULL, NULL, NULL, 1, 1, '2026-07-21 21:51:14', '2026-07-21 21:54:55'),
(5, 2, 'Edwin', 'Torres', 'edwintorres044@gmail.com', '$2y$10$CkqCRT7tN/dT3/gta5m.1OLNmiKKhGZBFUWlepqISJa25iF5ejfwG', NULL, 'UTVM', 'E', 1, 1, '2026-07-21 21:58:24', '2026-08-04 20:06:54'),
(6, 1, 'Admin', 'TI', 'Admin@gmail.com', '123456789', NULL, NULL, NULL, 1, 1, '2026-07-21 22:07:52', '2026-07-21 22:07:52'),
(7, 2, 'Yosellin', 'Martínez Flores', 'yosellinm345@gmail.com', '$2y$10$I.0wYKwZU1sUYjHILPGQ4uYXQgTZ8VE1mciuqA6sLiVeAcNIbcriy', NULL, NULL, NULL, 1, 1, '2026-07-21 22:14:48', '2026-07-21 22:15:24'),
(8, 2, 'Editor', 'Negoteck', 'editor@negoteck.com', '$2y$10$Ldp5MoxAxKLopdQrg1EGWepJkfyVIlob/MLbQeu0.LkOGdIDZQk/a', NULL, NULL, NULL, 1, 1, '2026-08-07 04:34:17', '2026-08-07 04:35:28');

--
-- --------------------------------------------------------
-- Tabla adicional: sesiones activas en tiempo real
-- Integrada desde el tercer esquema proporcionado.
CREATE TABLE IF NOT EXISTS `sesiones_activas` (
  `id_sesion` varchar(64) NOT NULL,
  `id_usuario` int(10) UNSIGNED DEFAULT NULL,
  `ultima_actividad` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_sesion`),
  KEY `idx_sesiones_activas_ultima_actividad` (`ultima_actividad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `usuarios` (`id_usuario`, `id_rol`, `nombre`, `apellidos`, `correo`, `contrasena_hash`, `foto_perfil`, `institucion`, `biografia`, `correo_verificado`, `activo`, `fecha_registro`, `fecha_actualizacion`) VALUES
(9, 2, 'samuel', 'quezada', 'qs5805165@gmail.com', '$2y$10$zhMIqOIZsHPtg5w/LPSxcOJRzfxPqlpjbjso/Hj01CXv2HbOIQmf2', NULL, NULL, NULL, 1, 1, '2026-08-06 19:48:27', '2026-08-06 19:51:22'),
(10, 2, 'Adriana', 'Trejo', 'adrianatrejopalma94@gmail.com', '$2y$10$Kt.sQuUB7Y3U2YYJKg/h3OEenxmkxPCf2HU0CSawK1y3ZUkjXCPHu', NULL, NULL, NULL, 1, 1, '2026-08-07 07:06:31', '2026-08-07 07:07:19');
INSERT INTO `publicaciones` (`id_publicacion`, `id_area`, `id_usuario`, `titulo`, `resumen`, `archivo_pdf`, `imagen_portada`, `estado`, `destacado`, `visitas`, `observaciones_editor`, `fecha_registro`, `fecha_envio`, `fecha_publicacion`, `fecha_actualizacion`, `tipo_contenido`, `url_video`) VALUES
(27, 8, 9, 'Aprendiendo Phayton', 'Aprendisague sobre los primeros pasos para aprender phyton con un metodo dibertido y agradable para alumnos', '0209e07524.pdf', '3ccc9628e7.png', 'APROBADO', 0, 4, NULL, '2026-08-06 19:58:27', NULL, NULL, '2026-08-06 20:11:25', 'archivo', NULL),
(28, 1, 10, 'Como publicar cosas en insta correctamente', 'no puede ser ahora no funciona y no se como corregirlo ayudada jajaj y luego ahorita me van a cagar en la uni todo porque el director de carrera me odia', '72b9f7bb1f.pdf', 'ea170a9378.png', 'PENDIENTE', 0, 0, NULL, '2026-08-07 07:09:25', NULL, NULL, '2026-08-07 07:09:45', 'archivo', NULL),
(29, 1, 10, 'Importancia de la Gestión de Conocimiento en las Empresas Contemporáneas', 'Importancia de la Gestión de Conocimiento en las Empresas ContemporáneasImportancia de la Gestión de Conocimiento en las Empresas ContemporáneasImportancia de la Gestión de Conocimiento en las Empresas ContemporáneasImportancia de la Gestión de Conocimiento en las Empresas ContemporáneasImportancia ', 'fb167438b0.pdf', '05efe17f45.png', 'PENDIENTE', 0, 0, NULL, '2026-08-07 14:18:37', NULL, NULL, '2026-08-07 14:18:37', 'archivo', NULL);
INSERT INTO `comentarios` (`id_comentario`, `id_publicacion`, `id_usuario`, `contenido`, `activo`, `fecha_registro`, `fecha_actualizacion`) VALUES
(1, 27, 9, 'putos', 1, '2026-08-06 20:01:26', NULL),
(2, 27, 9, 'putos', 1, '2026-08-06 20:02:08', NULL);

-- Índices para tablas volcadas
--

--
-- Indices de la tabla `areas`
--
ALTER TABLE `areas`
  ADD PRIMARY KEY (`id_area`),
  ADD UNIQUE KEY `uq_areas_nombre` (`nombre`),
  ADD UNIQUE KEY `uq_areas_slug` (`slug`);

--
-- Indices de la tabla `comentarios`
--
ALTER TABLE `comentarios`
  ADD PRIMARY KEY (`id_comentario`),
  ADD KEY `fk_comentarios_usuarios` (`id_usuario`),
  ADD KEY `idx_comentarios_publicacion_fecha` (`id_publicacion`,`fecha_registro`);

--
-- Indices de la tabla `historial_publicaciones`
--
ALTER TABLE `historial_publicaciones`
  ADD PRIMARY KEY (`id_historial`),
  ADD KEY `fk_historial_usuarios` (`id_usuario_accion`),
  ADD KEY `idx_historial_publicacion_fecha` (`id_publicacion`,`fecha_registro`);

--
-- Indices de la tabla `mensajes_contacto`
--
ALTER TABLE `mensajes_contacto`
  ADD PRIMARY KEY (`id_mensaje`),
  ADD KEY `idx_mensajes_contacto_estado_fecha` (`estado`,`fecha_registro`);

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id_notificacion`),
  ADD KEY `fk_notificaciones_publicaciones` (`id_publicacion`),
  ADD KEY `idx_notificaciones_usuario_leida` (`id_usuario`,`leida`,`fecha_registro`);

--
-- Indices de la tabla `palabras_clave`
--
ALTER TABLE `palabras_clave`
  ADD PRIMARY KEY (`id_palabra_clave`),
  ADD UNIQUE KEY `uq_palabras_clave_nombre` (`nombre`);

--
-- Indices de la tabla `publicaciones`
--
ALTER TABLE `publicaciones`
  ADD PRIMARY KEY (`id_publicacion`),
  ADD KEY `idx_publicaciones_area_estado` (`id_area`,`estado`),
  ADD KEY `idx_publicaciones_usuario_fecha` (`id_usuario`,`fecha_registro`),
  ADD KEY `idx_publicaciones_destacado` (`destacado`,`estado`);

--
-- Indices de la tabla `publicaciones_autores`
--
ALTER TABLE `publicaciones_autores`
  ADD PRIMARY KEY (`id_publicacion_autor`),
  ADD UNIQUE KEY `uq_publicacion_orden_autoria` (`id_publicacion`,`orden_autoria`),
  ADD KEY `idx_publicaciones_autores_usuario` (`id_usuario`);

--
-- Indices de la tabla `publicaciones_palabras_clave`
--
ALTER TABLE `publicaciones_palabras_clave`
  ADD PRIMARY KEY (`id_publicacion`,`id_palabra_clave`),
  ADD KEY `fk_pub_palabras_palabras` (`id_palabra_clave`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`),
  ADD UNIQUE KEY `uq_roles_nombre` (`nombre`);

--
-- Indices de la tabla `tokens_login`
--
ALTER TABLE `tokens_login`
  ADD PRIMARY KEY (`id_token_login`),
  ADD UNIQUE KEY `uq_tokens_login_hash` (`token_hash`),
  ADD KEY `idx_tokens_login_usuario` (`id_usuario`,`token_expira`);

--
-- Indices de la tabla `tokens_recuperacion`
--
ALTER TABLE `tokens_recuperacion`
  ADD PRIMARY KEY (`id_token_recuperacion`),
  ADD UNIQUE KEY `uq_tokens_recuperacion_hash` (`token_hash`),
  ADD KEY `idx_tokens_recuperacion_usuario` (`id_usuario`,`token_expira`);

--
-- Indices de la tabla `tokens_registro`
--
ALTER TABLE `tokens_registro`
  ADD PRIMARY KEY (`id_token_registro`),
  ADD UNIQUE KEY `uq_tokens_registro_hash` (`token_hash`),
  ADD KEY `idx_tokens_registro_usuario` (`id_usuario`,`token_expira`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `uq_usuarios_correo` (`correo`),
  ADD KEY `fk_usuarios_roles` (`id_rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `areas`
--
ALTER TABLE `areas`
  MODIFY `id_area` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `comentarios`
--
ALTER TABLE `comentarios`
  MODIFY `id_comentario` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `historial_publicaciones`
--
ALTER TABLE `historial_publicaciones`
  MODIFY `id_historial` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `mensajes_contacto`
--
ALTER TABLE `mensajes_contacto`
  MODIFY `id_mensaje` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id_notificacion` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `palabras_clave`
--
ALTER TABLE `palabras_clave`
  MODIFY `id_palabra_clave` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `publicaciones`
--
ALTER TABLE `publicaciones`
  MODIFY `id_publicacion` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT de la tabla `publicaciones_autores`
--
ALTER TABLE `publicaciones_autores`
  MODIFY `id_publicacion_autor` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `tokens_login`
--
ALTER TABLE `tokens_login`
  MODIFY `id_token_login` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT de la tabla `tokens_recuperacion`
--
ALTER TABLE `tokens_recuperacion`
  MODIFY `id_token_recuperacion` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT de la tabla `tokens_registro`
--
ALTER TABLE `tokens_registro`
  MODIFY `id_token_registro` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `comentarios`
--
ALTER TABLE `comentarios`
  ADD CONSTRAINT `fk_comentarios_publicaciones` FOREIGN KEY (`id_publicacion`) REFERENCES `publicaciones` (`id_publicacion`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_comentarios_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `historial_publicaciones`
--
ALTER TABLE `historial_publicaciones`
  ADD CONSTRAINT `fk_historial_publicaciones` FOREIGN KEY (`id_publicacion`) REFERENCES `publicaciones` (`id_publicacion`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_historial_usuarios` FOREIGN KEY (`id_usuario_accion`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD CONSTRAINT `fk_notificaciones_publicaciones` FOREIGN KEY (`id_publicacion`) REFERENCES `publicaciones` (`id_publicacion`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_notificaciones_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `publicaciones`
--
ALTER TABLE `publicaciones`
  ADD CONSTRAINT `fk_publicaciones_areas` FOREIGN KEY (`id_area`) REFERENCES `areas` (`id_area`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_publicaciones_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `publicaciones_autores`
--
ALTER TABLE `publicaciones_autores`
  ADD CONSTRAINT `fk_publicaciones_autores_publicaciones` FOREIGN KEY (`id_publicacion`) REFERENCES `publicaciones` (`id_publicacion`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_publicaciones_autores_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `publicaciones_palabras_clave`
--
ALTER TABLE `publicaciones_palabras_clave`
  ADD CONSTRAINT `fk_pub_palabras_palabras` FOREIGN KEY (`id_palabra_clave`) REFERENCES `palabras_clave` (`id_palabra_clave`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_pub_palabras_publicaciones` FOREIGN KEY (`id_publicacion`) REFERENCES `publicaciones` (`id_publicacion`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `tokens_login`
--
ALTER TABLE `tokens_login`
  ADD CONSTRAINT `fk_tokens_login_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `tokens_recuperacion`
--
ALTER TABLE `tokens_recuperacion`
  ADD CONSTRAINT `fk_tokens_recuperacion_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `tokens_registro`
--
ALTER TABLE `tokens_registro`
  ADD CONSTRAINT `fk_tokens_registro_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_usuarios_roles` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
