import { useEffect, useRef, useState } from 'react'
import { obtenerEstadisticas } from '../services/servicioEstadisticas'
import { escucharCambioContadores } from '../utils/eventosContadores'

// Solo lo que se muestra junto al ícono de buscar en el menú: vistas
// totales y usuarios activos ahora mismo. Se refresca cada 20s para que
// "usuarios activos" se sienta en vivo, sin depender de recargar la página,
// y además en cuanto se registra la presencia o la visita de esta persona
// (ver utils/eventosContadores.js).
const INTERVALO_MS = 20000

export function useContadoresNavbar() {
  const [contadores, setContadores] = useState({ vistas: null, activos: null })
  const activo = useRef(true)
  // Número de la última petición enviada: si una respuesta vieja llega
  // después de una más nueva, se descarta para no regresar a un valor
  // anterior (por ejemplo, de 1 a 0).
  const ultimaPeticion = useRef(0)

  useEffect(() => {
    activo.current = true

    const cargar = () => {
      const numeroPeticion = ++ultimaPeticion.current
      obtenerEstadisticas()
        .then((datos) => {
          if (!activo.current || numeroPeticion !== ultimaPeticion.current) return
          setContadores({
            vistas: datos.find((d) => d.id === 's4')?.valor ?? null,
            activos: datos.find((d) => d.id === 's5')?.valor ?? null,
          })
        })
        .catch(() => {
          // Si falla, se conservan los últimos valores conocidos (o null
          // si todavía no cargaba ninguno) en vez de mostrar un error.
        })
    }

    cargar()
    const intervalo = setInterval(cargar, INTERVALO_MS)
    const dejarDeEscuchar = escucharCambioContadores(cargar)

    return () => {
      activo.current = false
      clearInterval(intervalo)
      dejarDeEscuchar()
    }
  }, [])

  return contadores
}
