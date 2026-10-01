import EncabezadoPagina from '../components/common/EncabezadoPagina'
import BarraNavegacion from '../components/layout/BarraNavegacion'
import SeccionAcercaDe from '../components/home/SeccionAcercaDe'

export default function PaginaQuienesSomos() {
  return (
    <>
      <EncabezadoPagina
        etiqueta="La revista"
        titulo="Quiénes somos"
        descripcion="Fomentando la innovación en los negocios: misión, visión, ética y la comunidad que hace posible NEGOTECK."
      />
      <BarraNavegacion />
      <SeccionAcercaDe />
    </>
  )
}
