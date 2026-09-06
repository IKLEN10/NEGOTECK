import { solicitarApi } from "./config";
import { obtenerToken } from "./servicioAutenticacion";

export async function obtenerEstadisticas() {
  const { datos } = await solicitarApi("/estadisticas.php");
  return datos;
}

export async function obtenerDashboard() {
  const { datos } = await solicitarApi(
    "/usuario/dashboard.php?endpoint=dashboard",
    {
      headers: {
        Authorization: `Bearer ${obtenerToken()}`,
      },
    },
  );
  return datos;
}
