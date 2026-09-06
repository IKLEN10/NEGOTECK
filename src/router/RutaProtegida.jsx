import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { estaAutenticado, obtenerUsuario } from '../services/servicioAutenticacion'

// `rolRequerido` es opcional: las rutas existentes (panel del autor) no lo
// usan y siguen funcionando exactamente igual. Cuando se indica (por
// ejemplo, para el panel del Administrador General), además de exigir
// sesión iniciada, se valida que el rol del usuario coincida; si no
// coincide, se redirige a /panel en vez de dejarlo entrar sin permisos.
export default function RutaProtegida({ rolRequerido } = {}) {
  const ubicacion = useLocation()

  if (!estaAutenticado()) {
    return <Navigate to="/login" replace state={{ desde: ubicacion }} />
  }

  if (rolRequerido) {
    const usuario = obtenerUsuario()
    if (usuario?.rol !== rolRequerido) {
      return <Navigate to="/panel" replace />
    }
  }

  return <Outlet />
}
