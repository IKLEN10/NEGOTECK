// Aviso interno para que los contadores del menú ("Vistas totales" y
// "Usuarios activos ahora") se recarguen en cuanto se registra la
// presencia o la visita de esta persona, sin esperar al refresco
// periódico de useContadoresNavbar.
const EVENTO = "negoteck:contadores-cambiaron";

export function notificarCambioContadores() {
  window.dispatchEvent(new Event(EVENTO));
}

export function escucharCambioContadores(alCambiar) {
  window.addEventListener(EVENTO, alCambiar);
  return () => window.removeEventListener(EVENTO, alCambiar);
}
