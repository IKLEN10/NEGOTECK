import { solicitarApi } from "./config";

export async function obtenerAreas() {
  const { datos } = await solicitarApi("/areas.php");
  return datos;
}

export async function obtenerAreasSelect() {
  const { datos } = await solicitarApi("/areas-select.php");
  return datos;
}
