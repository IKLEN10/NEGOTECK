// Identificador de la sesión de navegación de ESTA pestaña.
//
// Se guarda en `sessionStorage`, así que:
//  - sobrevive a recargas y a la navegación entre secciones,
//  - desaparece cuando se cierra la pestaña (la próxima vez que la
//    persona entre, será una sesión nueva).
//
// Lo usan "usuarios activos" (usePresencia), la visita al sitio
// (useVisitaSitio) y las vistas de cada publicación, para que las tres
// cifras hablen de la misma sesión.
const CLAVE_ID_SESION = "negoteck_id_sesion";

// Respaldo si sessionStorage no está disponible (modo privado estricto,
// etc.): se conserva en memoria durante esta carga de página para que
// todas las peticiones usen el mismo id.
let idEnMemoria = null;

function generarId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `s-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function obtenerIdSesion() {
  try {
    let id = window.sessionStorage.getItem(CLAVE_ID_SESION);
    if (!id) {
      id = generarId();
      window.sessionStorage.setItem(CLAVE_ID_SESION, id);
    }
    return id;
  } catch {
    if (!idEnMemoria) idEnMemoria = generarId();
    return idEnMemoria;
  }
}
