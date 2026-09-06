import { useEffect, useState } from 'react'
import { obtenerAreas } from '../../services/servicioAreas'
import TarjetaArea from '../common/TarjetaArea'
import { useRevelado } from '../../hooks/useRevelado'

export default function CuadriculaAreas() {
  const referencia = useRevelado()
  const [areas, setAreas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let activo = true
    setCargando(true)
    obtenerAreas()
      .then((datos) => {
        if (activo) setAreas(datos)
      })
      .catch((err) => {
        if (activo) setError(err.message)
      })
      .finally(() => {
        if (activo) setCargando(false)
      })
    return () => {
      activo = false
    }
  }, [])

  return (
    <section id="areas" className="scroll-mt-20 bg-papel py-8 sm:py-12">
      <div ref={referencia} className="revelar contenedor-pagina">
        <p className="antetitulo">Áreas de interés</p>
        <h2 className="mt-3 max-w-lg font-display text-2xl font-medium text-tinta sm:text-3xl">
          Ocho líneas de investigación, una sola revista
        </h2>

        {error && <p className="mt-6 text-sm text-tinta/60">No se pudieron cargar las áreas: {error}</p>}

        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cargando &&
            Array.from({ length: 8 }).map((_, indice) => (
              <div key={indice} className="esqueleto h-64 rounded-card" />
            ))}
          {!cargando && areas.map((area) => <TarjetaArea key={area.id} area={area} />)}
        </div>
      </div>
    </section>
  )
}
