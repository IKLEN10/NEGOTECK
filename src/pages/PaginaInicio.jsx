import BannerSuperior from '../components/layout/BannerSuperior'
import BarraNavegacion from '../components/layout/BarraNavegacion'
import CarruselPublicaciones from '../components/home/CarruselPublicaciones'
import CuadriculaAreas from '../components/home/CuadriculaAreas'
import SeccionEnlacesRapidos from '../components/home/SeccionEnlacesRapidos'

// El inicio se enfoca en las publicaciones: lo primero que se ve es el
// banner de presentación con el menú justo debajo (que ya incluye, junto
// al buscador, las cifras en vivo de vistas totales y usuarios activos —
// ver BarraNavegacion → ContadoresEnVivo), y después lo más reciente,
// seguido de las áreas. La información institucional completa (Quiénes
// somos, Cómo publicar, Contacto) vive ahora en sus propias páginas —
// aquí solo queda una franja breve de accesos rápidos hacia ellas.
export default function PaginaInicio() {
  return (
    <>
      <BannerSuperior />
      <BarraNavegacion />
      <CarruselPublicaciones />
      <CuadriculaAreas />
      <SeccionEnlacesRapidos />
    </>
  )
}
