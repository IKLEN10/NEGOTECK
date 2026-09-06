import { LogIn } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useNotificacion } from '../hooks/useNotificacion'
import { guardarSesion, iniciarSesion, reenviarVerificacion } from '../services/servicioAutenticacion'

export default function PaginaIniciarSesion() {
  const [cargando, setCargando] = useState(false)
  const [reenviando, setReenviando] = useState(false)
  const [correoSinVerificar, setCorreoSinVerificar] = useState(null)
  const navegar = useNavigate()
  const ubicacion = useLocation()
  const { mostrarNotificacion } = useNotificacion()
  // Si llegamos aquí porque una ruta protegida nos redirigió, o porque el
  // usuario quiso comentar sin sesión, "desde" trae la ubicación original.
  // Flujo normal (botón "Iniciar sesión" del header, o tras registrarse):
  // no llega "desde" y seguimos yendo al panel, sin cambios.
  const desde = ubicacion.state?.desde

  const manejarEnvio = async (e) => {
    e.preventDefault()

    const formulario = new FormData(e.currentTarget)
    const correo = (formulario.get('correo') || '').trim()
    const contrasena = formulario.get('contrasena') || ''
    const recordar = formulario.get('recordar') === 'on'

    if (!correo || !contrasena) {
      mostrarNotificacion('Correo y contraseña son obligatorios.', 'error')
      return
    }
    if (!/^\S+@\S+\.\S+$/.test(correo)) {
      mostrarNotificacion('Escribe un correo electrónico válido.', 'error')
      return
    }

    setCorreoSinVerificar(null)
    setCargando(true)
    try {
      const respuesta = await iniciarSesion({ correo, contrasena, recordar })
      guardarSesion(respuesta.token, respuesta.usuario)
      mostrarNotificacion('Inicio de sesión correcto.', 'exito')
      // El Administrador General usa el mismo formulario de acceso; solo
      // cambia el destino al que se le lleva tras autenticarse.
      const destinoPorRol = respuesta.usuario?.rol === 'ADMINISTRADOR' ? '/admin' : '/panel'
      navegar(desde ?? destinoPorRol, { replace: true })
    } catch (error) {
      mostrarNotificacion(error.message, 'error')
      if (error.message?.toLowerCase().includes('verifica')) {
        setCorreoSinVerificar(correo)
      }
    } finally {
      setCargando(false)
    }
  }

  const manejarReenvio = async () => {
    if (!correoSinVerificar) return
    setReenviando(true)
    try {
      const respuesta = await reenviarVerificacion({ correo: correoSinVerificar })
      mostrarNotificacion(respuesta.mensaje, 'exito')
    } catch (error) {
      mostrarNotificacion(error.message, 'error')
    } finally {
      setReenviando(false)
    }
  }

  return (
    <div>
      <p className="antetitulo">Acceso de autor</p>
      <h1 className="mt-3 font-display text-2xl font-medium text-tinta sm:text-3xl">Inicia sesión</h1>
      <p className="mt-2 text-sm text-tinta/55">Consulta y da seguimiento a tus publicaciones.</p>

      <form onSubmit={manejarEnvio} className="mt-8 flex flex-col gap-5">
        <div>
          <label className="etiqueta-campo" htmlFor="correo">Correo</label>
          <input id="correo" name="correo" type="email" required maxLength={150} className="campo-entrada" placeholder="tucorreo@ejemplo.com" />
        </div>
        <div>
          <label className="etiqueta-campo" htmlFor="contrasena">Contraseña</label>
          <input id="contrasena" name="contrasena" type="password" required className="campo-entrada" placeholder="••••••••" />
        </div>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-tinta/65">
            <input
              type="checkbox"
              name="recordar"
              className="h-4 w-4 rounded border-tinta/30 text-azulRey-600 focus:ring-azulRey-500"
            />
            Recordarme
          </label>
          <Link to="/recuperar" className="font-medium text-azulRey-600 hover:text-azulRey-700">¿Olvidaste tu contraseña?</Link>
        </div>
        <button type="submit" disabled={cargando} className="btn-primary mt-1 w-full">
          {cargando ? 'Ingresando…' : (<><LogIn size={16} /> Iniciar sesión</>)}
        </button>
      </form>

      {correoSinVerificar && (
        <button
          onClick={manejarReenvio}
          disabled={reenviando}
          className="btn-secondary mt-4 w-full"
        >
          {reenviando ? 'Reenviando…' : 'Reenviar correo de verificación'}
        </button>
      )}

      <p className="mt-8 text-center text-sm text-tinta/55">
        ¿No tienes cuenta?{' '}
        <Link to="/registro" className="font-semibold text-azulRey-600 hover:text-azulRey-700">Regístrate</Link>
      </p>
    </div>
  )
}
