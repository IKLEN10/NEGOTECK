import { URL_BASE_API } from "./config";
import { notificarCambioContadores } from "../utils/eventosContadores";

// Avisa al backend que esta persona está en el sitio. El backend decide
// si cuenta como visita nueva (una por persona cada 2 horas), así que
// llamarlo de más no infla el contador. Si la visita sí contó, se le
// pide al menú que recargue "Vistas totales" en ese momento. Es una
// señal secundaria: si falla, no debe afectar la navegación.
export function registrarVisitaSitio(idVisitante) {
  fetch(`${URL_BASE_API}/registrar-visita.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_visitante: idVisitante }),
    keepalive: true,
  })
    .then((respuesta) => (respuesta.ok ? respuesta.json() : null))
    .then((datos) => {
      if (datos?.nueva) notificarCambioContadores();
    })
    .catch(() => {
      // Silencioso a propósito.
    });
}
