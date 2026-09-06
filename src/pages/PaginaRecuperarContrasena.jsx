import { CheckCircle2, KeyRound, Mail } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useNotificacion } from '../hooks/useNotificacion'
import { restablecerContrasena, solicitarRecuperacion } from '../services/servicioAutenticacion'

function evaluarContrasena(valor) {
  return {
    longitud: valor.length >= 8,
    mayuscula: /[A-Z]/.test(valor),
    minuscula: /[a-z]/.test(valor),
    numero: /[0-9]/.test(valor),
    especial: /[^A-Za-z0-9]/.test(valor),
  }
}

function ReglaContrasena({ cumple, children }) {
  return (
    <li className={`flex items-center gap-1.5 ${cumple ? 'text-verde-600' : 'text-tinta/45'}`}>
      <CheckCircle2 size={13} className={cumple ? 'opacity-100' : 'opacity-30'} />
      {children}
    </li>
  )
}

export default function PaginaRecuperarContrasena() {
  const [parametros] = useSearchParams()
  const correoDesdeEnlace = (parametros.get('correo') || '').trim()
  const tokenDesdeEnlace = (parametros.get('token') || '').trim()

  const [cargando, setCargando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [restableciendo, setRestableciendo] = useState(false)
  const [correoSolicitado, setCorreoSolicitado] = useState('')
  const [contrasenaNueva, setContrasenaNueva] = useState('')
  const navegar = useNavigate()
  const { mostrarNotificacion } = useNotificacion()

  const reglasContrasena = useMemo(() => evaluarContrasena(contrasenaNueva), [contrasenaNueva])
  const llegoDesdeEnlace = Boolean(correoDesdeEnlace && tokenDesdeEnlace)

  const manejarEnvio = async (e) => {
    e.preventDefault()
    setCargando(true)

    const formulario = new FormData(e.currentTarget)
    const correo = formulario.get('correo')

    try {
      const respuesta = await solicitarRecuperacion({ correo })
      setCorreoSolicitado(correo)
      setEnviado(true)
      mostrarNotificacion(respuesta.mensaje, 'exito')
    } catch (error) {
      mostrarNotificacion(error.message, 'error')
    } finally {
      setCargando(false)
    }
  }

  const manejarRestablecimiento = async (e) => {
    e.preventDefault()
    setRestableciendo(true)

    const formulario = new FormData(e.currentTarget)
    const confirmar = formulario.get('confirmar_nueva')

    if (!Object.values(reglasContrasena).every(Boolean)) {
      mostrarNotificacion('La contraseña no cumple con los requisitos mínimos.', 'error')
      setRestableciendo(false)
      return
    }
    if (contrasenaNueva !== confirmar) {
      mostrarNotificacion('Las contraseñas no coinciden.', 'error')
      setRestableciendo(false)
      return
    }

    try {
      const respuesta = await restablecerContrasena({
        correo: correoDesdeEnlace,
        token: tokenDesdeEnlace,
        contrasenaNueva,
      })
      mostrarNotificacion(respuesta.mensaje, 'exito')
      navegar('/login')
    } catch (error) {
      mostrarNotificacion(error.message, 'error')
    } finally {
      setRestableciendo(false)
    }
  }

  // Paso 2: el usuario llegó dando clic en el enlace del correo real.
  if (llegoDesdeEnlace) {
    return (
      <div>
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-azulRey-50 text-azulRey-600">
          <KeyRound size={20} />
        </span>
        <h1 className="mt-4 font-display text-2xl font-medium text-tinta sm:text-3xl">Elige tu nueva contraseña</h1>
        <p className="mt-2 text-sm text-tinta/55">Cuenta: <strong>{correoDesdeEnlace}</strong></p>

        <form onSubmit={manejarRestablecimiento} className="mt-7 flex flex-col gap-5">
          <div>
            <label className="etiqueta-campo" htmlFor="contrasena_nueva">Nueva contraseña</label>
            <input
              id="contrasena_nueva"
              name="contrasena_nueva"
              type="password"
              required
              minLength={8}
              maxLength={72}
              value={contrasenaNueva}
              onChange={(e) => setContrasenaNueva(e.target.value)}
              className="campo-entrada"
              placeholder="Mínimo 8 caracteres"
            />
            <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
              <ReglaContrasena cumple={reglasContrasena.longitud}>8+ caracteres</ReglaContrasena>
              <ReglaContrasena cumple={reglasContrasena.mayuscula}>Una mayúscula</ReglaContrasena>
              <ReglaContrasena cumple={reglasContrasena.minuscula}>Una minúscula</ReglaContrasena>
              <ReglaContrasena cumple={reglasContrasena.numero}>Un número</ReglaContrasena>
              <ReglaContrasena cumple={reglasContrasena.especial}>Un carácter especial</ReglaContrasena>
            </ul>
          </div>
          <div>
            <label className="etiqueta-campo" htmlFor="confirmar_nueva">Confirmar nueva contraseña</label>
            <input id="confirmar_nueva" name="confirmar_nueva" type="password" required minLength={8} maxLength={72} className="campo-entrada" placeholder="Repite tu contraseña" />
          </div>
          <button type="submit" disabled={restableciendo} className="btn-primary w-full">
            {restableciendo ? 'Restableciendo…' : (<><KeyRound size={16} /> Restablecer contraseña</>)}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-tinta/55">
          <Link to="/login" className="font-semibold text-azulRey-600 hover:text-azulRey-700">Volver a iniciar sesión</Link>
        </p>
      </div>
    )
  }

  // Paso 1b: ya se envió la solicitud, esperando a que abran el correo.
  if (enviado) {
    return (
      <div>
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-azulRey-50 text-azulRey-600">
          <CheckCircle2 size={26} />
        </span>
        <h1 className="mt-5 text-center font-display text-2xl font-medium text-tinta">Revisa tu correo</h1>
        <p className="mt-2 text-center text-sm text-tinta/60">
          Si <strong>{correoSolicitado}</strong> existe en nuestra base de datos, recibirás un enlace para
          restablecer tu contraseña. El enlace expira en 1 hora.
        </p>

        <p className="mt-8 text-center text-sm text-tinta/55">
          <Link to="/login" className="font-semibold text-azulRey-600 hover:text-azulRey-700">Volver a iniciar sesión</Link>
        </p>
      </div>
    )
  }

  // Paso 1a: formulario para pedir el correo de recuperación.
  return (
    <div>
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-azulRey-50 text-azulRey-600">
        <KeyRound size={20} />
      </span>
      <h1 className="mt-4 font-display text-2xl font-medium text-tinta sm:text-3xl">Recuperar contraseña</h1>
      <p className="mt-2 text-sm text-tinta/55">Te enviaremos un enlace para restablecer tu contraseña.</p>

      <form onSubmit={manejarEnvio} className="mt-8 flex flex-col gap-5">
        <div>
          <label className="etiqueta-campo" htmlFor="correo">Correo electrónico</label>
          <input id="correo" name="correo" type="email" required maxLength={150} className="campo-entrada" placeholder="tucorreo@ejemplo.com" />
        </div>
        <button type="submit" disabled={cargando} className="btn-primary w-full">
          {cargando ? 'Enviando…' : (<><Mail size={16} /> Recuperar contraseña</>)}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-tinta/55">
        <Link to="/login" className="font-semibold text-azulRey-600 hover:text-azulRey-700">Volver a iniciar sesión</Link>
      </p>
    </div>
  )
}
