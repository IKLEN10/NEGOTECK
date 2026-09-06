# services/

Esta carpeta está preparada para alojar los clientes HTTP (por ejemplo, con `fetch` o `axios`)
que consumirán la futura API construida con NestJS.

Actualmente está vacía a propósito: todo el proyecto funciona con datos simulados
ubicados en `src/data/`. Cuando el backend esté disponible, cada recurso
(publicaciones, áreas, autores, autenticación, etc.) puede recibir su propio
archivo aquí, por ejemplo:

- `servicioAutenticacion.js`
- `servicioPublicaciones.js`
- `servicioAreas.js`
