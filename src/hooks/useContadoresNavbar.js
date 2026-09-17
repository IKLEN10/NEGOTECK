import { useEffect, useRef, useState } from 'react'
import { obtenerEstadisticas } from '../services/servicioEstadisticas'

// Solo lo que se muestra junto al ícono de buscar en el menú: vistas
// totales y usuarios activos ahora mismo. Se refresca cada 20s para que
// "usuarios activos" se sienta en vivo, sin depender de recargar la página.
const INTERVALO_MS = 20000

export function useContadoresNavbar() {
  const [contadores, setContadores] = useState({ vistas: null, activos: null })
  const activo = useRef(true)

  useEffect(() => {
    activo.current = true

    const cargar = () => {
      obtenerEstadisticas()
        .then((datos) => {
          if (!activo.current) return
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

    return () => {
      activo.current = false
      clearInterval(intervalo)
    }
  }, [])

  return contadores
}
