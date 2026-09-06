import { CheckCircle2, Loader2, ShieldAlert, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useNotificacion } from '../hooks/useNotificacion'
import { reenviarVerificacion, verificarRegistro } from '../services/servicioAutenticacion'

export default function PaginaVerificarCorreo() {
  const [parametros] = useSearchParams()
  const correo = (parametros.get('correo') || '').trim()
  const token = (parametros.get('token') || '').trim()
  const { mostrarNotificacion } = useNotificacion()

  const [estado, setEstado] = useState('cargando') // cargando | exito | error
  const [mensaje, setMensaje] = useState('')
  const [reenviando, setReenviando] = useState(false)

  useEffect(() => {
    if (!correo || !token) {
      setEstado('error')
      setMensaje('El enlace de verificación está incompleto. Copia el enlace completo desde tu correo.')
      return
    }

    let activo = true
    verificarRegistro({ correo, token })
      .then((respuesta) => {
        if (!activo) return
        setEstado('exito')
        setMensaje(respuesta.mensaje)
      })
      .catch((error) => {
        if (!activo) return
        setEstado('error')
        setMensaje(error.message)
      })
    return () => {
      activo = false
    }
  }, [correo, token])

  const manejarReenvio = async () => {
    if (!correo) return
    setReenviando(true)
    try {
      const respuesta = await reenviarVerificacion({ correo })
      mostrarNotificacion(respuesta.mensaje, 'exito')
    } catch (error) {
      mostrarNotificacion(error.message, 'error')
    } finally {
      setReenviando(false)
    }
  }

  return (
    <div className="text-center">
      {estado === 'cargando' && (
        <>
          <Loader2 size={28} className="mx-auto animate-spin text-azulRey-600" />
          <h1 className="mt-4 font-display text-2xl font-medium text-tinta">Verificando tu cuenta…</h1>
        </>
      )}

      {estado === 'exito' && (
        <>
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-azulRey-50 text-azulRey-600">
            <ShieldCheck size={26} />
          </span>
          <h1 className="mt-5 font-display text-2xl font-medium text-tinta">¡Cuenta verificada!</h1>
          <p className="mt-2 text-sm text-tinta/60">{mensaje}</p>
          <Link to="/login" className="btn-primary mt-6 inline-flex">
            <CheckCircle2 size={16} /> Iniciar sesión
          </Link>
        </>
      )}

      {estado === 'error' && (
        <>
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
            <ShieldAlert size={26} />
          </span>
          <h1 className="mt-5 font-display text-2xl font-medium text-tinta">No pudimos verificar tu cuenta</h1>
          <p className="mt-2 text-sm text-tinta/60">{mensaje}</p>
          {correo && (
            <button onClick={manejarReenvio} disabled={reenviando} className="btn-secondary mt-6 w-full">
              {reenviando ? 'Reenviando…' : 'Enviar un nuevo correo de verificación'}
            </button>
          )}
          <p className="mt-6 text-sm text-tinta/55">
            <Link to="/login" className="font-semibold text-azulRey-600 hover:text-azulRey-700">Volver a iniciar sesión</Link>
          </p>
        </>
      )}
    </div>
  )
}
