import { Outlet } from 'react-router-dom'
import PiePagina from '../components/layout/PiePagina'
import { useDesplazamientoArriba } from '../hooks/useDesplazamientoArriba'

// El menú de navegación no vive aquí: cada página que usa este layout lo
// coloca justo debajo de su banner (en Inicio, el banner principal; en las
// páginas internas, el banner azul de la sección), para que todas sigan el
// mismo orden: banner → menú → contenido.
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
