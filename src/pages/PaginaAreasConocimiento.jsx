import EncabezadoPagina from '../components/common/EncabezadoPagina'
import BarraNavegacion from '../components/layout/BarraNavegacion'
import CuadriculaAreas from '../components/home/CuadriculaAreas'

export default function PaginaAreasConocimiento() {
  return (
    <>
      <EncabezadoPagina
        etiqueta="Explora por tema"
        titulo="Áreas de conocimiento"
        descripcion="Cada publicación de NEGOTECK pertenece a una de estas áreas. Elige una para ver sus artículos y videos."
      />
      <BarraNavegacion />
      <CuadriculaAreas />
    </>
  )
}
