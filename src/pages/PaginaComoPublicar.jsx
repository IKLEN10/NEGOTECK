import EncabezadoPagina from '../components/common/EncabezadoPagina'
import BarraNavegacion from '../components/layout/BarraNavegacion'
import ComoPublicar from '../components/home/ComoPublicar'
import GuiaElaboracionArticulos from '../components/home/GuiaElaboracionArticulos'
import SeccionPreguntasFrecuentes from '../components/home/SeccionPreguntasFrecuentes'

// Reúne, en una sola página independiente, todo lo relacionado con
// publicar en NEGOTECK: el proceso en cuatro pasos, la guía de
// elaboración de artículos (con las normas editoriales) y las preguntas
// frecuentes — contenido que antes vivía disperso en la página principal.
export default function PaginaComoPublicar() {
  return (
    <>
      <EncabezadoPagina
        etiqueta="Para autores"
        titulo="¿Cómo publicar?"
        descripcion="El proceso, los requisitos y el formato para compartir tu artículo en NEGOTECK."
      />
      <BarraNavegacion />
      <ComoPublicar />
      <GuiaElaboracionArticulos />
      <SeccionPreguntasFrecuentes />
    </>
  )
}
