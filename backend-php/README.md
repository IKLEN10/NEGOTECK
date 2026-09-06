# Backend PHP — NEGOTECK

API REST en PHP puro (sin frameworks) que alimenta con datos reales de MySQL
los componentes de la home del frontend en React, además del módulo completo
de autenticación (registro, verificación de cuenta, inicio de sesión,
perfil, cierre de sesión y recuperación de contraseña).

## 1. Instalación (XAMPP)

1. Copia la carpeta `backend-php` dentro de tu `htdocs`, por ejemplo:
   `C:\xampp\htdocs\revista-api\` (o `/opt/lampp/htdocs/revista-api` en Linux).
   El contenido de esa carpeta (`config/`, `models/`, `api/`, etc.) debe quedar
   directamente dentro de `revista-api/`.
2. Crea la base de datos ejecutando en phpMyAdmin, en este orden:
   1. `base_datos_revista_digital.sql` (el que ya traía el proyecto — crea las tablas y catálogos de roles/áreas).
   2. `backend-php/seed_datos_prueba.sql` (datos de ejemplo: usuarios autores y publicaciones, para que la home no se vea vacía).
3. Revisa `backend-php/config/config.php` y ajusta `DB_USER` / `DB_PASS` si tu MySQL no usa el `root` sin contraseña por defecto de XAMPP.
4. Prueba en el navegador: `http://localhost/revista-api/api/areas.php` — debe devolver JSON.

## 2. Conectar el frontend

En la raíz del proyecto React, copia `.env.example` como `.env` y ajusta:

```
VITE_API_URL=http://localhost/revista-api/api
```

(Nota: la URL apunta a la subcarpeta `api/`, donde viven los endpoints).

Luego `npm run dev` como siempre. La home ahora carga areas, publicaciones,
estadísticas y el formulario de contacto desde esta API.

## 3. Endpoints implementados

| Endpoint                              | Método | Descripción                                             |
|----------------------------------------|--------|----------------------------------------------------------|
| `/api/publicaciones-recientes.php`     | GET    | Últimas publicaciones aprobadas (`?limite=5` por defecto) |
| `/api/publicaciones-destacadas.php`    | GET    | Publicaciones con `destacado = 1` (`?limite=6`)           |
| `/api/areas.php`                       | GET    | Áreas activas con conteo real de publicaciones aprobadas  |
| `/api/estadisticas.php`                | GET    | Cifras agregadas para la banda de estadísticas            |
| `/api/contacto.php`                    | POST   | Guarda un mensaje en `mensajes_contacto` y lo reenvía por correo a `CORREO_EMPRESA` |
| `/api/comentarios.php`                 | GET    | Comentarios de una publicación (`?id_publicacion=123`), sin auth |
| `/api/comentarios.php`                 | POST   | Publica un comentario (`Authorization: Bearer`, body `{ id_publicacion, contenido }`) |
| `/api/auth/registro.php`               | POST   | Crea una cuenta de autor y un token de verificación       |
| `/api/auth/verificar-registro.php`     | POST   | Verifica la cuenta con el token de registro                |
| `/api/auth/login.php`                  | POST   | Inicia sesión y devuelve un token de acceso                |
| `/api/auth/perfil.php`                 | GET    | Perfil del usuario autenticado (`Authorization: Bearer`)   |
| `/api/auth/logout.php`                 | POST   | Revoca el token de acceso actual (`Authorization: Bearer`) |
| `/api/auth/recuperar-contrasena.php`   | POST   | Solicita un token para restablecer la contraseña           |
| `/api/auth/restablecer-contrasena.php` | POST   | Confirma el token y establece la nueva contraseña          |

Todas las respuestas GET tienen la forma `{ exito: true, datos: [...] }`.
Los endpoints de `auth/` responden `{ exito: true, ... }` con las llaves
propias de cada acción (`mensaje`, `token`, `usuario`, etc.), y
`{ exito: false, error: '...' }` en caso de error — igual que el resto de
la API.

## 4. Cómo se resolvieron las relaciones (usando solo el SQL existente)

- **Publicación → Área**: `publicaciones.id_area → areas.id_area`.
- **Publicación → Autor**: se prioriza `publicaciones_autores` (con
  `es_principal = 1`), porque esa tabla admite coautores sin cuenta
  registrada (`id_usuario` puede ser `NULL`). Si no existe ese registro,
  se usa como respaldo `publicaciones.id_usuario → usuarios`.
- **Publicación → Imagen**: `publicaciones.imagen_portada` (columna ya
  existente, no se agregó ninguna tabla de imágenes nueva).
- **Área → cantidad de publicaciones**: ya no es un número fijo como en el
  mock (`data/areas.js`); se calcula con `COUNT()` sobre `publicaciones`
  filtrando `estado = 'APROBADO'`.
- Solo se muestran públicamente publicaciones con `estado = 'APROBADO'`
  (equivalente a "publicado"), respetando el flujo editorial ya definido
  en el enum de la tabla.

## 5. Inconsistencias detectadas entre el frontend y el SQL (home)

Se avisan aquí en vez de inventar tablas, como se pidió:

1. **Testimonios y Preguntas Frecuentes** (`src/data/varios.js` →
   `testimonios`, `preguntasFrecuentes`): el esquema SQL no tiene ninguna
   tabla para este contenido editorial. Se dejaron **tal cual estaban**
   (datos estáticos en el frontend), porque no existe una tabla de la cual
   traerlos y no se debía inventar una. Si se quiere que sean dinámicos,
   la solución más simple sería agregar dos tablas nuevas
   (`testimonios`, `preguntas_frecuentes`) — se puede hacer en una siguiente
   iteración.
2. **"Lectores mensuales"** (banda de estadísticas): el SQL no tiene ninguna
   tabla de tráfico/analítica por periodo, solo `publicaciones.visitas`
   (un contador acumulado por publicación, no por mes ni por lector único).
   Mostrar "Lectores mensuales" con datos reales sería inventar una cifra.
   En su lugar, el backend expone **"Visitas registradas"** (suma real de
   `visitas`), que sí es un dato genuino de la base. Si se necesita la
   métrica original, habría que agregar una tabla de analítica (por
   ejemplo `visitas_publicacion` con fecha, o integrar Google Analytics).
3. **Imágenes de `areas`**: el `INSERT INTO areas` del SQL original no
   incluye `imagen_portada` (queda `NULL` para las 8 áreas). Se agregó
   `seed_datos_prueba.sql` con `UPDATE areas SET imagen_portada = ...`
   reutilizando las mismas imágenes que ya traía el mock, para no dejar
   la cuadrícula de áreas sin imágenes. En producción, esas rutas deberían
   apuntar a archivos subidos por un administrador.
4. **`usuarios.contrasena_hash`**: `seed_datos_prueba.sql` sigue usando un
   hash de relleno (no funcional) para los autores de ejemplo, ya que se
   generó antes de este módulo de autenticación. Para probar el login con
   esos usuarios de ejemplo, actualiza su `contrasena_hash` con
   `password_hash('la_contraseña_que_quieras', PASSWORD_BCRYPT)`, o
   simplemente crea una cuenta nueva desde `/registro`.

## 6. Estructura de carpetas

```
backend-php/
├── config/
│   ├── config.php      # credenciales de BD, CORS, URL de archivos
│   └── Database.php    # conexión PDO (singleton)
├── helpers/
│   ├── Respuesta.php      # helper de respuestas JSON
│   ├── Token.php          # generación y hash de tokens de auth
│   └── Autenticacion.php  # guard de endpoints protegidos (Bearer token)
├── models/
│   ├── Publicacion.php        # consultas de publicaciones (recientes/destacadas)
│   ├── Area.php                # consultas de áreas + conteo de publicaciones
│   ├── Estadistica.php        # cifras agregadas
│   ├── Contacto.php           # guarda mensajes de contacto
│   ├── Comentario.php         # comentarios de una publicación (comentarios)
│   ├── Usuario.php            # CRUD de usuarios (auth)
│   └── TokenAutenticacion.php # tokens_registro / tokens_login / tokens_recuperacion
├── api/
│   ├── bootstrap.php   # CORS + includes comunes a todos los endpoints
│   ├── publicaciones-recientes.php
│   ├── publicaciones-destacadas.php
│   ├── areas.php
│   ├── estadisticas.php
│   ├── contacto.php
│   ├── comentarios.php
│   └── auth/
│       ├── registro.php
│       ├── verificar-registro.php
│       ├── login.php
│       ├── perfil.php
│       ├── logout.php
│       ├── recuperar-contrasena.php
│       └── restablecer-contrasena.php
└── seed_datos_prueba.sql
```

Los tokens de sesión, registro y recuperación son opacos (no JWT): se
generan con `random_bytes()`, se guardan **hasheados** (SHA-256) en su
tabla correspondiente y se validan contra la base de datos en cada
petición protegida. Esto evita depender de una librería externa de JWT
en un backend "PHP puro sin frameworks" y reutiliza exactamente el
esquema de tablas que ya traía el proyecto (`tokens_registro`,
`tokens_login`, `tokens_recuperacion`).

Separación de responsabilidades: `config/` (conexión), `models/` (SQL),
`api/*.php` (lógica de cada endpoint: validar entrada, llamar al modelo,
responder JSON). El frontend, del lado de React, refleja lo mismo con
`src/services/*.js` como capa de acceso a la API.

## 7. Flujo de autenticación (cómo probarlo)

1. **Registro**: `POST /api/auth/registro.php` con `nombre`, `apellidos`,
   `correo`, `contrasena`. Responde con `token_registro` (8 caracteres,
   visible en la respuesta solo con fines de práctica — en producción se
   enviaría por correo).
2. **Verificación**: `POST /api/auth/verificar-registro.php` con `correo`
   y `token`. Activa `usuarios.correo_verificado`.
3. **Login**: `POST /api/auth/login.php` con `correo`, `contrasena`.
   Responde `token` (guárdalo) y `usuario`. Solo funciona si la cuenta ya
   fue verificada y está activa.
4. **Perfil / rutas protegidas**: manda el token en
   `Authorization: Bearer <token>`. `GET /api/auth/perfil.php` y
   `POST /api/auth/logout.php` lo requieren.
5. **Recuperar contraseña**: `POST /api/auth/recuperar-contrasena.php`
   con `correo`. Si la cuenta existe, responde `token_recuperacion` (igual
   que el registro, visible aquí solo para la práctica). Luego
   `POST /api/auth/restablecer-contrasena.php` con `correo`, `token` y
   `contrasena_nueva` para completar el cambio.

En el frontend, todo este flujo ya está conectado en
`src/services/servicioAutenticacion.js` y en las páginas `/login`,
`/registro` y `/recuperar`. Las rutas de `/panel` están protegidas por
`src/router/RutaProtegida.jsx`: si no hay sesión guardada en
`localStorage`, redirige a `/login`.

## 8. Comentarios

Sistema simple, sin respuestas ni reacciones, reutilizando la tabla
`comentarios` que ya existía en `base_datos_revista_digital.sql`.

- `GET /api/comentarios.php?id_publicacion=123` es público (cualquiera
  puede leer los comentarios de una publicación aprobada).
- `POST /api/comentarios.php` requiere `Authorization: Bearer <token>` y
  body `{ "id_publicacion": 123, "contenido": "..." }`. Si no hay token
  válido responde `401`, igual que el resto de endpoints protegidos
  (`Autenticacion::requerirUsuario()`).
- En el frontend, `src/services/servicioComentarios.js` consume estos dos
  endpoints y `PaginaDetallePublicacion.jsx` muestra un botón para ir a
  `/login` cuando alguien intenta comentar sin sesión iniciada.

## 9. Formulario de contacto (envío real de correo)

`POST /api/contacto.php` guarda el mensaje en `mensajes_contacto` **y**
lo reenvía por correo a `CORREO_EMPRESA` (definido en
`config/config.php`), usando el mismo helper `Correo` del módulo de
autenticación (SMTP con PHPMailer si `MAIL_HOST` está configurado, con
`mail()` nativo y el log de desarrollo como respaldos). El correo se
manda con `Reply-To` igual al correo de quien escribió el formulario,
para poder responder directamente desde el buzón de la empresa.

Si guardar en base de datos falla, el endpoint responde error y no se
intenta enviar el correo. Si guardar funciona pero el envío del correo
falla (por ejemplo, sin credenciales SMTP configuradas), el mensaje
queda igualmente registrado en `mensajes_contacto` y el endpoint
responde éxito con `correo_enviado: false`, para no hacerle perder al
usuario un mensaje que sí se guardó.
