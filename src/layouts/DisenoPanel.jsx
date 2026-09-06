import { Outlet } from 'react-router-dom'
import BarraLateral from '../components/dashboard/BarraLateral'
import { useDesplazamientoArriba } from '../hooks/useDesplazamientoArriba'

export default function DisenoPanel() {
  useDesplazamientoArriba()
  return (
    <div className="flex min-h-screen bg-papel">
      <BarraLateral />
      <div className="flex-1">
        <div className="contenedor-pagina py-8 sm:py-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
