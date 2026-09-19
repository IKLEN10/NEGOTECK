import BannerSuperior from '../components/layout/BannerSuperior'
import BarraNavegacion from '../components/layout/BarraNavegacion'
import CarruselPublicaciones from '../components/home/CarruselPublicaciones'
import PublicacionesMasVistas from '../components/home/PublicacionesMasVistas'
import CuadriculaAreas from '../components/home/CuadriculaAreas'
import SeccionEnlacesRapidos from '../components/home/SeccionEnlacesRapidos'

// El inicio se enfoca en las publicaciones: lo primero que se ve es el
// banner de presentación con el menú justo debajo (que ya incluye, junto
// al buscador, las cifras en vivo de vistas totales y usuarios activos —
// ver BarraNavegacion → ContadoresEnVivo), después lo más reciente en el
// carrusel, luego una cuadrícula con lo más leído (para dar variedad y
// destacar contenido popular más allá del orden cronológico), y por
// último las áreas. La información institucional completa (Quiénes somos,
// Cómo publicar, Contacto) vive ahora en sus propias páginas — aquí solo
// queda una franja breve de accesos rápidos hacia ellas.
export default function PaginaInicio() {
  return (
    <>
      <BannerSuperior />
      <BarraNavegacion />
      <CarruselPublicaciones />
      <PublicacionesMasVistas />
      <CuadriculaAreas />
      <SeccionEnlacesRapidos />
    </>
  )
}
