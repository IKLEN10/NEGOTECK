import { URL_BASE_API } from "./config";
import { notificarCambioContadores } from "../utils/eventosContadores";

// El PRIMER aviso de esta carga de página se manda con `fetch` para saber
// cuándo terminó y, en ese momento, pedirle al menú que recargue
// "Usuarios activos ahora". Sin esto, el menú consultaba antes de que la
// presencia quedara registrada y mostraba 0 hasta el siguiente refresco.
let primerAvisoEnviado = false;

// Heartbeat de presencia: se usa `sendBeacon` cuando está disponible para
// no bloquear la navegación (incluso funciona si la pestaña se está
// cerrando); si no, cae a un `fetch` normal con `keepalive`. No usa
// `solicitarApi` porque no necesitamos leer la respuesta ni queremos que
// un fallo aquí dispare ningún manejo de error visible para el usuario:
// esta señal es secundaria y nunca debe interrumpir la navegación.
export function registrarPresencia(idSesion) {
  const url = `${URL_BASE_API}/presencia.php`;
  const cuerpo = JSON.stringify({ id_sesion: idSesion });

  if (!primerAvisoEnviado) {
    primerAvisoEnviado = true;
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: cuerpo,
      keepalive: true,
    })
      .then((respuesta) => {
        if (respuesta.ok) notificarCambioContadores();
      })
      .catch(() => {
        // Silencioso a propósito.
      });
    return;
  }

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([cuerpo], { type: "application/json" });
      const enviado = navigator.sendBeacon(url, blob);
      if (enviado) return;
    }
  } catch {
    // Si sendBeacon lanza (poco común), se intenta con fetch abajo.
  }

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: cuerpo,
    keepalive: true,
  }).catch(() => {
    // Silencioso a propósito: perder un heartbeat no debe afectar al usuario.
  });
}

// Señal de salida: se manda al cerrar la última pestaña del sitio (ver
// usePresencia) para que la persona deje de contar como activa en ese
// momento y no hasta 90 segundos después. `sendBeacon` es el método que
// los navegadores garantizan aunque la página se esté cerrando.
export function avisarSalida(idVisitante) {
  const url = `${URL_BASE_API}/presencia.php`;
  const cuerpo = JSON.stringify({ id_sesion: idVisitante, accion: "salir" });

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([cuerpo], { type: "application/json" });
      if (navigator.sendBeacon(url, blob)) return;
    }
  } catch {
    // Si sendBeacon lanza (poco común), se intenta con fetch abajo.
  }

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: cuerpo,
    keepalive: true,
  }).catch(() => {
    // Silencioso a propósito: si no sale, el servidor la quita a los 90 s.
  });
}
