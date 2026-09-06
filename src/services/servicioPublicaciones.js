import { solicitarApi } from "./config";
import { obtenerToken } from "./servicioAutenticacion";

export async function obtenerPublicacionesRecientes(limite = 5) {
  const { datos } = await solicitarApi(
    `/publicaciones-recientes.php?limite=${limite}`,
  );
  return datos;
}

export async function obtenerPublicacionesDestacadas(limite = 6) {
  const { datos } = await solicitarApi(
    `/publicaciones-destacadas.php?limite=${limite}`,
  );
  return datos;
}

// `registrarVista` en false evita que el backend incremente el contador de
// vistas (se usa cuando esta publicación ya fue contabilizada antes en la
// misma sesión del navegador, por ejemplo tras recargar la página).
export async function obtenerPublicacionPorId(id, { registrarVista = true } = {}) {
  const { datos } = await solicitarApi(
    `/publicacion-detalle.php?id=${encodeURIComponent(id)}&registrar_vista=${registrarVista ? "1" : "0"}`,
  );
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
