import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { registrarVisitaSitio } from "../services/servicioVisitas";
import { obtenerIdSesion } from "../utils/sesionNavegador";

// Rutas que no cuentan como visita a la página pública.
const RUTAS_EXCLUIDAS = ["/admin", "/panel"];

function esRutaPublica(ruta) {
  return !RUTAS_EXCLUIDAS.some((prefijo) => ruta === prefijo || ruta.startsWith(`${prefijo}/`));
}

/**
 * "Vistas totales" = visitas por sesión: se registra UNA visita cuando la
 * persona llega al sitio público en una pestaña. Recargar o navegar entre
 * secciones no suma (misma sesión); cerrar la pestaña y volver a entrar
 * sí. El backend garantiza que una sesión no cuente dos veces.
 */
export function useVisitaSitio() {
  const { pathname } = useLocation();
  const yaEnviada = useRef(false);

  useEffect(() => {
    if (yaEnviada.current || !esRutaPublica(pathname)) return;
    yaEnviada.current = true;
    registrarVisitaSitio(obtenerIdSesion());
  }, [pathname]);
}
