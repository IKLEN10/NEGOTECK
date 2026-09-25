import { useEffect } from "react";
import { registrarPresencia } from "../services/servicioPresencia";
import { obtenerIdSesion } from "../utils/sesionNavegador";

const INTERVALO_MS = 25000;

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
