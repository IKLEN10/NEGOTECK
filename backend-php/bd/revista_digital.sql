-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 13-08-2026 a las 20:22:19
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `revista_digital`
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

--
-- Volcado de datos para la tabla `comentarios`
--

INSERT INTO `comentarios` (`id_comentario`, `id_publicacion`, `id_usuario`, `contenido`, `activo`, `fecha_registro`, `fecha_actualizacion`) VALUES
(10, 6, 3, 'putos', 1, '2026-08-06 20:01:26', NULL),
(11, 6, 3, 'putos', 1, '2026-08-06 20:02:08', NULL);

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
  `titulo` varchar(250) NOT NULL,
  `resumen` varchar(300) NOT NULL,
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
  `tipo_contenido` enum('archivo','video') CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT 'archivo',
  `url_video` varchar(500) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `publicaciones`
--

INSERT INTO `publicaciones` (`id_publicacion`, `id_area`, `id_usuario`, `titulo`, `resumen`, `archivo_pdf`, `imagen_portada`, `estado`, `destacado`, `visitas`, `observaciones_editor`, `fecha_registro`, `fecha_envio`, `fecha_publicacion`, `fecha_actualizacion`, `tipo_contenido`, `url_video`) VALUES
(6, 8, 3, 'Aprendiendo Phayton', 'Aprendisague sobre los primeros pasos para aprender phyton con un metodo dibertido y agradable para alumnos', '0209e07524.pdf', '3ccc9628e7.png', 'APROBADO', 0, 4, NULL, '2026-08-06 19:58:27', NULL, NULL, '2026-08-06 20:11:25', 'archivo', NULL),
(7, 1, 4, 'Como publicar cosas en insta correctamente', 'no puede ser ahora no funciona y no se como corregirlo ayudada jajaj y luego ahorita me van a cagar en la uni todo porque el director de carrera me odia', '72b9f7bb1f.pdf', 'ea170a9378.png', 'PENDIENTE', 0, 0, NULL, '2026-08-07 07:09:25', NULL, NULL, '2026-08-07 07:09:45', 'archivo', NULL),
(8, 1, 4, 'Importancia de la Gestión de Conocimiento en las Empresas Contemporáneas', 'Importancia de la Gestión de Conocimiento en las Empresas ContemporáneasImportancia de la Gestión de Conocimiento en las Empresas ContemporáneasImportancia de la Gestión de Conocimiento en las Empresas ContemporáneasImportancia de la Gestión de Conocimiento en las Empresas ContemporáneasImportancia ', 'fb167438b0.pdf', '05efe17f45.png', 'PENDIENTE', 0, 0, NULL, '2026-08-07 14:18:37', NULL, NULL, '2026-08-07 14:18:37', 'archivo', NULL);

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

INSERT INTO `tokens_login` (`id_token_login`, `id_usuario`, `token_hash`, `token_expira`, `token_creado`, `token_revocado`, `fecha_uso`, `ip_cliente`, `user_agent`) VALUES
(8, 3, '2220cd4f913cb9839c526a3ee1a048de06994f13b61dd6fbce73536cdb06f4d8', '2026-08-07 15:51:36', '2026-08-06 19:51:36', 0, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36'),
(9, 3, '9f8a6bbbc396b9ab1f43548067303db95db5d635bc9fb58fb97200231aa6abdb', '2026-08-07 16:12:00', '2026-08-06 20:12:00', 0, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0'),
(10, 4, '479599f7dbd685197c49691df077ac43d7ed7af7e4c4dbb4bb6a20477fd4c2ab', '2026-08-08 03:07:31', '2026-08-07 07:07:31', 0, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36'),
(11, 4, '567bcccb6aab83d44ec82eda1e9a47caa5e1eb63c06c5efe781a4cca7d12998f', '2026-08-08 07:42:42', '2026-08-07 11:42:42', 0, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0'),
(12, 4, '069cbbcf4c296bf8a5a2438887eda5889a2186cd390179dc01b0442731f6ee56', '2026-08-08 09:32:22', '2026-08-07 13:32:22', 1, '2026-08-07 14:17:02', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0'),
(13, 4, '799d421332d089e6c57307d05ab4c6ffec3ed5e3057c654ffa2b07ab045fd54a', '2026-08-08 10:17:16', '2026-08-07 14:17:16', 0, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0');

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

INSERT INTO `tokens_registro` (`id_token_registro`, `id_usuario`, `token_hash`, `token_expira`, `token_creado`, `token_usado`, `fecha_uso`) VALUES
(2, 3, '3d7bb7fd736d23410c19bb5e7e8037d90f28884bfdec2d747c1d39cd22de4845', '2026-08-08 03:48:27', '2026-08-06 19:48:27', 1, '2026-08-06 19:51:22'),
(3, 4, '8fc2cc601ed0f5760f15c54b24305a93d7100371a90f5bfcc2a73f3b12da151e', '2026-08-08 15:06:31', '2026-08-07 07:06:31', 1, '2026-08-07 07:07:19');

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
(3, 2, 'samuel', 'quezada', 'qs5805165@gmail.com', '$2y$10$zhMIqOIZsHPtg5w/LPSxcOJRzfxPqlpjbjso/Hj01CXv2HbOIQmf2', NULL, NULL, NULL, 1, 1, '2026-08-06 19:48:27', '2026-08-06 19:51:22'),
(4, 2, 'Adriana', 'Trejo', 'adrianatrejopalma94@gmail.com', '$2y$10$Kt.sQuUB7Y3U2YYJKg/h3OEenxmkxPCf2HU0CSawK1y3ZUkjXCPHu', NULL, NULL, NULL, 1, 1, '2026-08-07 07:06:31', '2026-08-07 07:07:19');

--
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
  MODIFY `id_comentario` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

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
  MODIFY `id_publicacion` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `publicaciones_autores`
--
ALTER TABLE `publicaciones_autores`
  MODIFY `id_publicacion_autor` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `tokens_login`
--
ALTER TABLE `tokens_login`
  MODIFY `id_token_login` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `tokens_recuperacion`
--
ALTER TABLE `tokens_recuperacion`
  MODIFY `id_token_recuperacion` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tokens_registro`
--
ALTER TABLE `tokens_registro`
  MODIFY `id_token_registro` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
