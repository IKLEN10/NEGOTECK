import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { registrarVisitaSitio } from "../services/servicioVisitas";
import { obtenerIdVisitante } from "../utils/sesionNavegador";

// Rutas que no cuentan como visita a la página pública.
const RUTAS_EXCLUIDAS = ["/admin", "/panel"];

function esRutaPublica(ruta) {
  return !RUTAS_EXCLUIDAS.some((prefijo) => ruta === prefijo || ruta.startsWith(`${prefijo}/`));
}

/**
 * "Vistas totales": se avisa al backend en cada página pública que se
 * visita, y el backend solo suma si esa persona (id de visitante del
 * navegador, con la IP como respaldo) no sumó en las últimas 2 horas.
 * Abrir otra pestaña, recargar o navegar entre secciones no suma; si la
 * persona sigue en el sitio o regresa después de 2 horas, sí.
 */
export function useVisitaSitio() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!esRutaPublica(pathname)) return;
    registrarVisitaSitio(obtenerIdVisitante());
  }, [pathname]);
}
