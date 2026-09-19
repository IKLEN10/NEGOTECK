import EncabezadoPagina from '../components/common/EncabezadoPagina'
import BarraNavegacion from '../components/layout/BarraNavegacion'
import SeccionContacto from '../components/home/SeccionContacto'

export default function PaginaContacto() {
  return (
    <>
      <EncabezadoPagina
        etiqueta="Hablemos"
        titulo="Contacto"
        descripcion="¿Dudas sobre tu publicación o quieres colaborar? El equipo editorial responde en un plazo de hasta 48 horas hábiles."
      />
      <BarraNavegacion />
      <SeccionContacto />
    </>
  )
}
