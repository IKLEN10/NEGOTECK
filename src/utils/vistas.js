// Evita que una publicación sume vistas de más cuando el usuario recarga la
// misma página o navega de un lado a otro dentro de la misma sesión del
// navegador. Se usa `sessionStorage` (no `localStorage`) a propósito: la
// vista sí debe volver a contarse si la persona regresa en una sesión nueva.
const CLAVE_ALMACENAMIENTO = "negoteck_vistas_registradas";

function leerRegistradas() {
  try {
    const crudo = window.sessionStorage.getItem(CLAVE_ALMACENAMIENTO);
    const lista = crudo ? JSON.parse(crudo) : [];
    return Array.isArray(lista) ? lista : [];
  } catch {
    // sessionStorage puede no estar disponible (modo privado, SSR, etc.);
    // en ese caso simplemente no se deduplica.
    return [];
  }
}

export function yaSeRegistroVista(idPublicacion) {
  return leerRegistradas().includes(String(idPublicacion));
}

export function marcarVistaRegistrada(idPublicacion) {
  try {
    const registradas = leerRegistradas();
    const id = String(idPublicacion);
    if (!registradas.includes(id)) {
      registradas.push(id);
      window.sessionStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(registradas));
    }
  } catch {
    // Si falla el guardado, no es crítico: en el peor caso una recarga
    // adicional podría volver a contar la vista.
  }
}
