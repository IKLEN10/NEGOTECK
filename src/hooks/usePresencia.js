import { useEffect } from "react";
import { registrarPresencia } from "../services/servicioPresencia";

const CLAVE_ID_SESION = "negoteck_id_sesion";
const INTERVALO_MS = 25000;

function generarId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `s-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function obtenerIdSesion() {
  try {
    let id = window.sessionStorage.getItem(CLAVE_ID_SESION);
    if (!id) {
      id = generarId();
      window.sessionStorage.setItem(CLAVE_ID_SESION, id);
    }
    return id;
  } catch {
    // sessionStorage puede no estar disponible (modo privado, etc.); se
    // usa un id solo en memoria para esta carga de página.
    return generarId();
  }
}

/**
 * Mantiene viva la cifra de "usuarios activos ahora" que se muestra en el
 * inicio: registra un heartbeat al montar la app y luego cada
 * INTERVALO_MS mientras la pestaña siga abierta, sin importar en qué
 * ruta esté la persona (así cuenta como "activa" en toda la navegación,
 * no solo en el inicio).
 */
export function usePresencia() {
  useEffect(() => {
    const idSesion = obtenerIdSesion();

    registrarPresencia(idSesion);
    const intervalo = setInterval(() => registrarPresencia(idSesion), INTERVALO_MS);

    return () => clearInterval(intervalo);
  }, []);
}
