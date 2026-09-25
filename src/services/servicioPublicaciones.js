import { solicitarApi } from "./config";
import { obtenerToken } from "./servicioAutenticacion";
import { obtenerIdSesion } from "../utils/sesionNavegador";

export async function obtenerPublicacionesRecientes(limite = 5) {
  const { datos } = await solicitarApi(
    `/publicaciones-recientes.php?limite=${limite}`,
  );
  return datos;
}

export async function obtenerPublicacionesMasVistas(limite = 6) {
  const { datos } = await solicitarApi(
    `/publicaciones-mas-vistas.php?limite=${limite}`,
  );
  return datos;
}
export async function obtenerPublicacionesCuatrimestres({
  pagina = 1,
  cuatrimestre = "",
  anio = "",
} = {}) {
  const params = new URLSearchParams();
  params.append("page", pagina);

  if (cuatrimestre) params.append("cuatrimestre", cuatrimestre);
  if (anio) params.append("anio", anio);

  const respuesta = await solicitarApi(
    `/publicaciones-por-cuatrimestres.php?${params.toString()}`,
  );

  return {
    data: respuesta.data || respuesta || [],
    filtros_disponibles: respuesta.filtros_disponibles || [],
  };
}

// El backend cuenta la vista como máximo una vez por sesión de pestaña
// (`id_sesion`): recargar o volver a entrar en la misma pestaña no suma;
// cerrar la pestaña y volver a entrar sí. `registrarVista` en false
// consulta la publicación sin intentar registrar la vista.
export async function obtenerPublicacionPorId(
  id,
  { registrarVista = true } = {},
) {
  const params = new URLSearchParams({
    id: String(id),
    registrar_vista: registrarVista ? "1" : "0",
    id_sesion: obtenerIdSesion(),
  });
  const { datos } = await solicitarApi(`/publicacion-detalle.php?${params.toString()}`);
  return datos;
}

// Usuario

// Publicaciones del autor con sesión iniciada. El backend identifica al
// usuario a partir del token (Authorization), no de un parámetro en la URL,
// así que aquí no se manda ni se necesita ningún id.
export async function obtenerPublicacionesUsuario() {
  const { datos } = await solicitarApi("/usuario/publicaciones-usuario.php", {
    headers: {
      Authorization: `Bearer ${obtenerToken()}`,
    },
  });

  return datos;
}

// Crear una publicacion
export async function crearPublicacion(formData) {
  return await solicitarApi("/crear-publicacion.php", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${obtenerToken()}`,
    },
  });
}

// Obtener la información de la publicación para la edición
export async function obtenerPublicacionEditar(idPublicacion) {
  const { datos } = await solicitarApi(
    `/usuario/obtener-publicacion-editar.php?id=${encodeURIComponent(idPublicacion)}`,
    {
      headers: {
        Authorization: `Bearer ${obtenerToken()}`,
      },
    },
  );

  return datos;
}

// Editar la publicación
export async function actualizarPublicacion(idPublicacion, formData) {
  return await solicitarApi(
    `/usuario/editar-publicacion.php?id_publicacion=${encodeURIComponent(idPublicacion)}`,
    {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${obtenerToken()}`,
      },
    },
  );
}

export async function eliminarPublicacion(idPublicacion) {
  return await solicitarApi(
    `/usuario/eliminar-publicacion.php?id_publicacion=${encodeURIComponent(idPublicacion)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${obtenerToken()}`,
      },
    },
  );
}

export async function actualizarPublicacionRapido(idPublicacion, formData) {
  return await solicitarApi(
    `/usuario/editar-publicacion-rapido.php?id_publicacion=${encodeURIComponent(idPublicacion)}`,
    {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${obtenerToken()}`,
      },
    },
  );
}

export async function obtenerSolicitudesPublicaciones() {
  const { datos } = await solicitarApi("/admin/publicaciones-pendientes.php", {
    headers: {
      Authorization: `Bearer ${obtenerToken()}`,
    },
  });
  return datos;
}

export async function aprobarPublicacion(idPublicacion) {
  const datos = new FormData();
  datos.append("id_publicacion", idPublicacion);

  return await solicitarApi("/admin/aceptar-publicacion.php", {
    method: "POST",
    body: datos,
    headers: {
      Authorization: `Bearer ${obtenerToken()}`,
    },
  });
}

export async function rechazarPublicacion(idPublicacion, observaciones) {
  const datos = new FormData();
  datos.append("id_publicacion", idPublicacion);
  datos.append("observaciones", observaciones);

  return await solicitarApi("/admin/rechazar-publicacion.php", {
    method: "POST",
    body: datos,
    headers: {
      Authorization: `Bearer ${obtenerToken()}`,
    },
  });
}

export async function obtenerPublicacionNoValidada(id) {
  const { datos } = await solicitarApi(
    `/usuario/detalles.php?id=${encodeURIComponent(id)}`,
    { headers: { Authorization: `Bearer ${obtenerToken()}` } },
  );
  return datos;
}
