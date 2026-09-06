import { Mail, MapPin, Phone, Send } from 'lucide-react'
import { useState } from 'react'
import { useNotificacion } from '../../hooks/useNotificacion'
import { useRevelado } from '../../hooks/useRevelado'
import { enviarMensajeContacto } from '../../services/servicioContacto'
import { estaAutenticado, obtenerUsuario } from '../../services/servicioAutenticacion'

const INFORMACION = [
  { icono: MapPin, texto: 'Talita 47, Fracc. Real Solare, El Marqués, Querétaro, México' },
  { icono: Mail, texto: 'contacto_negoteck@gmail.com' },
  { icono: Phone, texto: '+52 7721239217' },
]

const NOMBRE_MAX = 150
const ASUNTO_MAX = 200
const MENSAJE_MIN = 10
const MENSAJE_MAX = 2000

function validarCampos({ nombre, correo, asunto, mensaje }, { omitirNombreCorreo = false } = {}) {
  const errores = {}

  if (!omitirNombreCorreo) {
    const nombreLimpio = nombre.trim()
    if (!nombreLimpio) {
      errores.nombre = 'El nombre es obligatorio.'
    } else if (nombreLimpio.length < 2) {
      errores.nombre = 'El nombre debe tener al menos 2 caracteres.'
    } else if (nombreLimpio.length > NOMBRE_MAX) {
      errores.nombre = 'El nombre es demasiado largo.'
    }

    const correoLimpio = correo.trim()
    if (!correoLimpio) {
      errores.correo = 'El correo electrónico es obligatorio.'
    } else if (!/^\S+@\S+\.\S+$/.test(correoLimpio)) {
      errores.correo = 'Escribe un correo electrónico válido.'
    }
  }

  const asuntoLimpio = asunto.trim()
  if (!asuntoLimpio) {
    errores.asunto = 'El asunto es obligatorio.'
  } else if (asuntoLimpio.length > ASUNTO_MAX) {
    errores.asunto = `El asunto no puede superar los ${ASUNTO_MAX} caracteres.`
  }

  const mensajeLimpio = mensaje.trim()
  if (!mensajeLimpio) {
    errores.mensaje = 'El mensaje es obligatorio.'
  } else if (mensajeLimpio.length < MENSAJE_MIN) {
    errores.mensaje = `Cuéntanos un poco más: al menos ${MENSAJE_MIN} caracteres.`
  } else if (mensajeLimpio.length > MENSAJE_MAX) {
    errores.mensaje = `El mensaje no puede superar los ${MENSAJE_MAX} caracteres.`
  }

  return errores
}

export default function SeccionContacto() {
  const referencia = useRevelado()
  const { mostrarNotificacion } = useNotificacion()
  const [enviando, setEnviando] = useState(false)
  const [errores, setErrores] = useState({})

  // Si hay una sesión iniciada, ya conocemos el nombre y el correo del
  // usuario: se muestran como información de solo lectura y no se piden
  // de nuevo en el formulario.
  const sesionIniciada = estaAutenticado()
  const usuario = sesionIniciada ? obtenerUsuario() : null
  const nombreUsuario = usuario ? `${usuario.nombre} ${usuario.apellidos}`.trim() : ''

  const manejarEnvio = async (e) => {
    e.preventDefault()
    const formulario = e.target
    const datos = new FormData(formulario)

    const campos = usuario
      ? {
          nombre: nombreUsuario,
          correo: usuario.correo,
          asunto: datos.get('asunto') || '',
          mensaje: datos.get('mensaje') || '',
        }
      : {
          nombre: datos.get('nombre') || '',
          correo: datos.get('correo') || '',
          asunto: datos.get('asunto') || '',
          mensaje: datos.get('mensaje') || '',
        }

    const erroresLocales = validarCampos(campos, { omitirNombreCorreo: Boolean(usuario) })
    setErrores(erroresLocales)
    if (Object.keys(erroresLocales).length > 0) {
      mostrarNotificacion('Revisa los campos marcados en rojo.', 'advertencia')
      return
    }

    setEnviando(true)
    try {
      await enviarMensajeContacto(campos)
      formulario.reset()
      setErrores({})
      mostrarNotificacion('Tu mensaje fue enviado. Te responderemos pronto.', 'exito')
    } catch (error) {
      mostrarNotificacion(error.message || 'No se pudo enviar tu mensaje. Intenta de nuevo.', 'advertencia')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section id="contacto" className="scroll-mt-20 bg-papel-suave py-16 sm:py-20">
      <div ref={referencia} className="revelar contenedor-pagina grid gap-12 lg:grid-cols-2">
        <div>
          <p className="antetitulo">Contacto</p>
          <h2 className="mt-3 max-w-md font-display text-2xl font-medium text-tinta sm:text-3xl">
            ¿Tienes dudas sobre tu publicación o quieres colaborar?
          </h2>
          <p className="mt-4 max-w-md text-sm text-tinta/60">
            Escríbenos y el equipo editorial te responderá en un plazo de hasta 48 horas hábiles.
          </p>
          <div className="mt-8 flex flex-col gap-4">
            {INFORMACION.map((elemento) => (
              <div key={elemento.texto} className="flex items-center gap-3 text-sm text-tinta/70">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-azulRey-50 text-azulRey-600">
                  <elemento.icono size={16} />
                </span>
                {elemento.texto}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={manejarEnvio} noValidate className="rounded-card border border-tinta/10 bg-papel p-6 shadow-card sm:p-8">
          {usuario ? (
            <div className="flex items-center gap-3 rounded-card bg-azulRey-50 p-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-papel text-azulRey-600">
                <Mail size={15} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-tinta">{nombreUsuario}</p>
                <p className="truncate text-xs text-tinta/55">{usuario.correo}</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="etiqueta-campo" htmlFor="c-nombre">Nombre</label>
                <input id="c-nombre" name="nombre" maxLength={NOMBRE_MAX} className="campo-entrada" placeholder="Tu nombre" />
                {errores.nombre && <p className="mt-1 text-xs text-red-600">{errores.nombre}</p>}
              </div>
              <div>
                <label className="etiqueta-campo" htmlFor="c-correo">Correo</label>
                <input id="c-correo" name="correo" type="email" className="campo-entrada" placeholder="tucorreo@ejemplo.com" />
                {errores.correo && <p className="mt-1 text-xs text-red-600">{errores.correo}</p>}
              </div>
            </div>
          )}
          <div className="mt-5">
            <label className="etiqueta-campo" htmlFor="c-asunto">Asunto</label>
            <input id="c-asunto" name="asunto" maxLength={ASUNTO_MAX} className="campo-entrada" placeholder="¿En qué podemos ayudarte?" />
            {errores.asunto && <p className="mt-1 text-xs text-red-600">{errores.asunto}</p>}
          </div>
          <div className="mt-5">
            <label className="etiqueta-campo" htmlFor="c-mensaje">Mensaje</label>
            <textarea id="c-mensaje" name="mensaje" rows={4} maxLength={MENSAJE_MAX} className="campo-entrada resize-none" placeholder="Cuéntanos más…" />
            {errores.mensaje && <p className="mt-1 text-xs text-red-600">{errores.mensaje}</p>}
          </div>
          <button type="submit" disabled={enviando} className="btn-primary mt-6 w-full">
            {enviando ? 'Enviando…' : (<><Send size={15} /> Enviar mensaje</>)}
          </button>
        </form>
      </div>
    </section>
  )
}
