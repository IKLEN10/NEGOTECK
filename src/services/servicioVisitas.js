import { URL_BASE_API } from "./config";

// Registra la visita al sitio de esta sesión de pestaña. El backend
// ignora las repetidas (misma sesión), así que llamarlo de más no
// infla el contador. Igual que la presencia, es una señal secundaria:
// si falla, no debe afectar la navegación ni mostrar errores.
export function registrarVisitaSitio(idSesion) {
  fetch(`${URL_BASE_API}/registrar-visita.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_sesion: idSesion }),
    keepalive: true,
  }).catch(() => {
    // Silencioso a propósito.
  });
}
