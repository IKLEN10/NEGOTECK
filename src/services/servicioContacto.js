import { solicitarApi } from './config'
import { estaAutenticado, obtenerToken } from './servicioAutenticacion'

export async function enviarMensajeContacto({ nombre, correo, asunto, mensaje }) {
  // Si hay una sesión iniciada, se envía el token para que el backend
  // pueda confirmar el nombre/correo con los datos reales del usuario
  // en vez de confiar únicamente en lo recibido del cliente.
  const encabezados = estaAutenticado() ? { Authorization: `Bearer ${obtenerToken()}` } : {}

  return solicitarApi('/contacto.php', {
    method: 'POST',
    headers: encabezados,
    body: JSON.stringify({ nombre, correo, asunto, mensaje }),
  })
}
