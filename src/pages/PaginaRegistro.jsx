import { CheckCircle2, MailCheck, UserPlus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNotificacion } from '../hooks/useNotificacion'
import { registrarUsuario, reenviarVerificacion } from '../services/servicioAutenticacion'

const PATRON_NOMBRE = /^[\p{L}][\p{L}\s'-]*$/u

function validarNombreCliente(valor, etiqueta) {
  const limpio = valor.trim()
  if (!limpio) return `${etiqueta} es obligatorio.`
  if (limpio.length < 2) return `${etiqueta} debe tener al menos 2 caracteres.`
  if (limpio.length > 80) return `${etiqueta} es demasiado largo.`
  if (!PATRON_NOMBRE.test(limpio)) return `${etiqueta} solo puede tener letras, espacios y guiones.`
  return ''
}

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

export default function PaginaRegistro() {
  const [cargando, setCargando] = useState(false)
  const [reenviando, setReenviando] = useState(false)
  const [correoRegistrado, setCorreoRegistrado] = useState(null)
  const [contrasena, setContrasena] = useState('')
  const [errores, setErrores] = useState({})
  const { mostrarNotificacion } = useNotificacion()

  const reglasContrasena = useMemo(() => evaluarContrasena(contrasena), [contrasena])

  const manejarEnvio = async (e) => {
    e.preventDefault()

    const formulario = new FormData(e.currentTarget)
    const nombre = formulario.get('nombre') || ''
    const apellidos = formulario.get('apellidos') || ''
    const correo = (formulario.get('correo') || '').trim()
    const contrasenaValor = formulario.get('contrasena') || ''
    const confirmar = formulario.get('confirmar') || ''

    const erroresLocales = {}
    const errorNombre = validarNombreCliente(nombre, 'El nombre')
    const errorApellidos = validarNombreCliente(apellidos, 'Los apellidos')
    if (errorNombre) erroresLocales.nombre = errorNombre
    if (errorApellidos) erroresLocales.apellidos = errorApellidos
    if (!/^\S+@\S+\.\S+$/.test(correo)) erroresLocales.correo = 'Escribe un correo electrónico válido.'

    const reglas = evaluarContrasena(contrasenaValor)
    if (!Object.values(reglas).every(Boolean)) {
      erroresLocales.contrasena = 'La contraseña no cumple con los requisitos mínimos.'
    }
    if (contrasenaValor !== confirmar) {
      erroresLocales.confirmar = 'Las contraseñas no coinciden.'
    }

    setErrores(erroresLocales)
    if (Object.keys(erroresLocales).length > 0) {
      mostrarNotificacion('Revisa los campos marcados en rojo.', 'error')
      return
    }

    setCargando(true)
    try {
      const respuesta = await registrarUsuario({ nombre, apellidos, correo, contrasena: contrasenaValor })
      setCorreoRegistrado(respuesta.correo)
      mostrarNotificacion(respuesta.mensaje, respuesta.correo_enviado ? 'exito' : 'advertencia')
    } catch (error) {
      mostrarNotificacion(error.message, 'error')
    } finally {
      setCargando(false)
    }
  }

  const manejarReenvio = async () => {
    setReenviando(true)
    try {
      const respuesta = await reenviarVerificacion({ correo: correoRegistrado })
      mostrarNotificacion(respuesta.mensaje, 'exito')
    } catch (error) {
      mostrarNotificacion(error.message, 'error')
    } finally {
      setReenviando(false)
    }
  }

  if (correoRegistrado) {
    return (
      <div>
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-azulRey-50 text-azulRey-600">
          <MailCheck size={20} />
        </span>
        <h1 className="mt-4 font-display text-2xl font-medium text-tinta sm:text-3xl">Revisa tu correo</h1>
        <p className="mt-2 text-sm text-tinta/55">
          Enviamos un enlace de verificación a <strong>{correoRegistrado}</strong>. Da clic en ese enlace para
          activar tu cuenta; hasta entonces no podrás iniciar sesión.
        </p>

        <button onClick={manejarReenvio} disabled={reenviando} className="btn-secondary mt-6 w-full">
          {reenviando ? 'Reenviando…' : 'Reenviar correo de verificación'}
        </button>

        <p className="mt-6 text-center text-sm text-tinta/55">
          ¿Ya verificaste tu cuenta?{' '}
          <Link to="/login" className="font-semibold text-azulRey-600 hover:text-azulRey-700">Inicia sesión</Link>
        </p>
      </div>
    )
  }

  return (
    <div>
      <p className="antetitulo">Nueva cuenta</p>
      <h1 className="mt-3 font-display text-2xl font-medium text-tinta sm:text-3xl">Crea tu cuenta de autor</h1>
      <p className="mt-2 text-sm text-tinta/55">Publica tu investigación y da seguimiento a su revisión editorial.</p>

      <form onSubmit={manejarEnvio} noValidate className="mt-8 flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="etiqueta-campo" htmlFor="nombre">Nombre</label>
            <input id="nombre" name="nombre" required maxLength={80} className="campo-entrada" placeholder="Ana" />
            {errores.nombre && <p className="mt-1 text-xs text-red-600">{errores.nombre}</p>}
          </div>
          <div>
            <label className="etiqueta-campo" htmlFor="apellidos">Apellidos</label>
            <input id="apellidos" name="apellidos" required maxLength={120} className="campo-entrada" placeholder="Torres López" />
            {errores.apellidos && <p className="mt-1 text-xs text-red-600">{errores.apellidos}</p>}
          </div>
        </div>
        <div>
          <label className="etiqueta-campo" htmlFor="correo">Correo</label>
          <input id="correo" name="correo" type="email" required maxLength={150} className="campo-entrada" placeholder="tucorreo@ejemplo.com" />
          {errores.correo && <p className="mt-1 text-xs text-red-600">{errores.correo}</p>}
        </div>
        <div>
          <label className="etiqueta-campo" htmlFor="contrasena">Contraseña</label>
          <input
            id="contrasena"
            name="contrasena"
            type="password"
            required
            minLength={8}
            maxLength={72}
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
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
          {errores.contrasena && <p className="mt-1 text-xs text-red-600">{errores.contrasena}</p>}
        </div>
        <div>
          <label className="etiqueta-campo" htmlFor="confirmar">Confirmar contraseña</label>
          <input id="confirmar" name="confirmar" type="password" required minLength={8} maxLength={72} className="campo-entrada" placeholder="Repite tu contraseña" />
          {errores.confirmar && <p className="mt-1 text-xs text-red-600">{errores.confirmar}</p>}
        </div>
        <label className="flex items-start gap-2 text-sm text-tinta/60">
          <input type="checkbox" required className="mt-0.5 h-4 w-4 rounded border-tinta/30 text-azulRey-600 focus:ring-azulRey-500" />
          Acepto los términos editoriales y el aviso de privacidad.
        </label>
        <button type="submit" disabled={cargando} className="btn-primary mt-1 w-full">
          {cargando ? 'Creando cuenta…' : (<><UserPlus size={16} /> Crear cuenta</>)}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-tinta/55">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="font-semibold text-azulRey-600 hover:text-azulRey-700">Inicia sesión</Link>
      </p>
    </div>
  )
}
