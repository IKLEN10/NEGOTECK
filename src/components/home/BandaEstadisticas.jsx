import { useEffect, useState } from 'react'
import { obtenerEstadisticas } from '../../services/servicioEstadisticas'
import { estadisticasRevista as estadisticasIniciales } from '../../data/varios'
import { useRevelado } from '../../hooks/useRevelado'

export default function BandaEstadisticas() {
  const referencia = useRevelado()
  // Se muestran valores del mock mientras carga la respuesta real,
  // para no dejar la sección vacía durante la petición.
  const [estadisticas, setEstadisticas] = useState(estadisticasIniciales)

  useEffect(() => {
    let activo = true
    obtenerEstadisticas()
      .then((datos) => {
        if (activo) setEstadisticas(datos)
      })
      .catch(() => {
        // Si la API falla, se conservan los valores iniciales.
      })
    return () => {
      activo = false
    }
  }, [])

  return (
    <section className="bg-azulRey-700 py-10">
      <div ref={referencia} className="revelar contenedor-pagina grid grid-cols-2 gap-6 sm:grid-cols-4">
        {estadisticas.map((s) => (
          <div key={s.id} className="text-center sm:text-left">
            <p className="font-display text-3xl font-semibold text-papel-suave sm:text-4xl">{s.valor}</p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-papel-suave/60">{s.etiqueta}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
