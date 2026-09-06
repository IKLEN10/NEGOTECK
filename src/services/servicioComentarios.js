import { solicitarApi } from './config'
import { obtenerToken } from './servicioAutenticacion'

export async function obtenerComentarios(idPublicacion) {
  const { datos } = await solicitarApi(`/comentarios.php?id_publicacion=${encodeURIComponent(idPublicacion)}`)
  return datos
}

export async function publicarComentario({ idPublicacion, contenido }) {
  const { comentario } = await solicitarApi('/comentarios.php', {
    method: 'POST',
    headers: { Authorization: `Bearer ${obtenerToken()}` },
    body: JSON.stringify({ id_publicacion: idPublicacion, contenido }),
  })
  return comentario
}
