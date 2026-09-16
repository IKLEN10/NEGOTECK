import { URL_BASE_API } from "./config";

// Heartbeat de presencia: se usa `sendBeacon` cuando está disponible para
// no bloquear la navegación (incluso funciona si la pestaña se está
// cerrando); si no, cae a un `fetch` normal con `keepalive`. No usa
// `solicitarApi` porque no necesitamos leer la respuesta ni queremos que
// un fallo aquí dispare ningún manejo de error visible para el usuario:
// esta señal es secundaria y nunca debe interrumpir la navegación.
export function registrarPresencia(idSesion) {
  const url = `${URL_BASE_API}/presencia.php`;
  const cuerpo = JSON.stringify({ id_sesion: idSesion });

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
