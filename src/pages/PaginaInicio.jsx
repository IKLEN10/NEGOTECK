import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import BannerSuperior from '../components/layout/BannerSuperior'
import BarraNavegacion from '../components/layout/BarraNavegacion'
import CarruselPublicaciones from '../components/home/CarruselPublicaciones'
import CuadriculaAreas from '../components/home/CuadriculaAreas'
import SeccionAcercaDe from '../components/home/SeccionAcercaDe'
import ComoPublicar from '../components/home/ComoPublicar'
import GuiaElaboracionArticulos from '../components/home/GuiaElaboracionArticulos'
import BandaEstadisticas from '../components/home/BandaEstadisticas'
import SeccionPreguntasFrecuentes from '../components/home/SeccionPreguntasFrecuentes'
import SeccionContacto from '../components/home/SeccionContacto'

export default function PaginaInicio() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    const idSeccion = hash.replace('#', '')
    const elemento = document.getElementById(idSeccion)
    if (elemento) {
      setTimeout(() => elemento.scrollIntoView({ behavior: 'smooth' }), 80)
    }
  }, [hash])

  return (
    <>
      {/* Jerarquía: banner de presentación, menú de navegación y, de
          inmediato, las publicaciones recientes, sin secciones intermedias
          (Portada y Publicaciones destacadas se retiraron del inicio). */}
      <BannerSuperior />
      <BarraNavegacion />
      <CarruselPublicaciones />
      <CuadriculaAreas />
      <SeccionAcercaDe />
      <ComoPublicar />
      <GuiaElaboracionArticulos />
      <BandaEstadisticas />
      <SeccionPreguntasFrecuentes />
      <SeccionContacto />
    </>
  )
}
