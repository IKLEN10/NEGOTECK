import { Outlet } from 'react-router-dom'
import PiePagina from '../components/layout/PiePagina'
import { useDesplazamientoArriba } from '../hooks/useDesplazamientoArriba'

// El menú de navegación ya no vive aquí: cada página que usa este layout lo
// coloca donde corresponda (en Inicio va debajo del banner principal; en el
// resto va al comienzo), para que ninguna quede con un elemento fijo
// ocupando la parte superior del sitio.
export default function DisenoPrincipal() {
  useDesplazamientoArriba()
  return (
    <div className="flex min-h-screen flex-col bg-papel">
      <main className="flex-1">
        <Outlet />
      </main>
      <PiePagina />
    </div>
  )
}
