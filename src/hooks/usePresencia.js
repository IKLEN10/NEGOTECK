import { useEffect } from "react";
import { avisarSalida, registrarPresencia } from "../services/servicioPresencia";
import { obtenerIdVisitante } from "../utils/sesionNavegador";
import {
  crearIdPestana,
  marcarPestanaAbierta,
  quitarPestana,
} from "../utils/pestanasAbiertas";

const INTERVALO_MS = 25000;

/**
 * Mantiene viva la cifra de "usuarios activos ahora": registra un
 * heartbeat al montar la app y luego cada INTERVALO_MS mientras la
 * pestaña siga abierta, sin importar en qué ruta esté la persona.
 *
 * Se usa el id de VISITANTE (localStorage), no el de pestaña: así una
 * misma persona cuenta como 1 aunque tenga varias pestañas abiertas o
 * cierre la pestaña y la vuelva a abrir.
 *
 * Al cerrar la ÚLTIMA pestaña del sitio se manda una señal de salida y
 * la persona deja de contar en ese momento. Si cierra una pestaña pero
 * deja otra abierta, no se manda nada (sigue activa). Si la señal no
 * alcanza a salir, el servidor la quita sola a los 90 segundos.
 */
export function usePresencia() {
  useEffect(() => {
    const idVisitante = obtenerIdVisitante();
    const idPestana = crearIdPestana();

    const latido = () => {
      marcarPestanaAbierta(idPestana);
      registrarPresencia(idVisitante);
    };

    // `pagehide` se dispara al cerrar la pestaña, recargar o salir a
    // otro sitio; es el evento más confiable para esto (más que
    // `beforeunload`, sobre todo en celulares).
    const alSalir = () => {
      const quedanOtras = quitarPestana(idPestana);
      if (!quedanOtras) avisarSalida(idVisitante);
    };

    // Si la persona regresa con el botón "atrás" y el navegador restaura
    // la página desde su caché, se vuelve a registrar de inmediato.
    const alVolver = (evento) => {
      if (evento.persisted) latido();
    };

    latido();
    const intervalo = setInterval(latido, INTERVALO_MS);
    window.addEventListener("pagehide", alSalir);
    window.addEventListener("pageshow", alVolver);

    return () => {
      clearInterval(intervalo);
      window.removeEventListener("pagehide", alSalir);
      window.removeEventListener("pageshow", alVolver);
      quitarPestana(idPestana);
    };
  }, []);
}
