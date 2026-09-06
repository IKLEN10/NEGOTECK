import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import EnrutadorApp from './router/EnrutadorApp'
import { useNotificacion } from './hooks/useNotificacion'
import { estaAutenticado, limpiarSesion } from './services/servicioAutenticacion'

export default function App() {
  const navegar = useNavigate()
  const ubicacion = useLocation()
  const { mostrarNotificacion } = useNotificacion()
  // Evita mostrar el aviso más de una vez si varias peticiones en curso
  // reciben 401 casi al mismo tiempo (p. ej. dos llamadas en paralelo al
  // cargar un panel justo cuando el token expiró).
  const yaAvisado = useRef(false)

  useEffect(() => {
    const alExpirarSesion = () => {
      if (!estaAutenticado() || yaAvisado.current) return
      yaAvisado.current = true
      limpiarSesion()
      mostrarNotificacion('Tu sesión expiró. Inicia sesión de nuevo.', 'advertencia')
      navegar('/login', { replace: true, state: { desde: ubicacion } })
    }

    window.addEventListener('sesion-expirada', alExpirarSesion)
    return () => window.removeEventListener('sesion-expirada', alExpirarSesion)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ubicacion])

  useEffect(() => {
    yaAvisado.current = false
  }, [ubicacion.pathname])

  return <EnrutadorApp />
}
