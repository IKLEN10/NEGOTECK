// Identificadores del navegador que usa el sistema de contadores.
//
// 1) Id de SESIÓN (sessionStorage, clave `negoteck_id_sesion`):
//    uno por pestaña; desaparece al cerrarla. Actualmente no lo usa
//    ningún contador; se conserva por si se necesita contar pestañas.
//
// 2) Id de VISITANTE (localStorage, clave `negoteck_id_visitante`):
//    uno por navegador, compartido por todas sus pestañas y conservado
//    aunque se cierre el navegador. Lo usan "usuarios activos ahora"
//    (usePresencia) y las vistas (visita al sitio y vistas de cada
//    publicación) para reconocer a la misma persona.
const CLAVE_ID_SESION = "negoteck_id_sesion";
const CLAVE_ID_VISITANTE = "negoteck_id_visitante";

// Respaldo si el almacenamiento no está disponible (modo privado
// estricto, etc.): se conserva en memoria durante esta carga de página
// para que todas las peticiones usen el mismo id.
const idsEnMemoria = {};

function generarId(prefijo) {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `${prefijo}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function obtenerId(almacenamiento, clave, prefijo) {
  try {
    let id = almacenamiento().getItem(clave);
    if (!id) {
      id = generarId(prefijo);
      almacenamiento().setItem(clave, id);
    }
    return id;
  } catch {
    if (!idsEnMemoria[clave]) idsEnMemoria[clave] = generarId(prefijo);
    return idsEnMemoria[clave];
  }
}

export function obtenerIdSesion() {
  return obtenerId(() => window.sessionStorage, CLAVE_ID_SESION, "s");
}

export function obtenerIdVisitante() {
  return obtenerId(() => window.localStorage, CLAVE_ID_VISITANTE, "v");
}
