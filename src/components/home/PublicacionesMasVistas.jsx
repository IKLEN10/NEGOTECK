import { useEffect, useState } from 'react'
import { obtenerPublicacionesMasVistas } from '../../services/servicioPublicaciones'
import TarjetaPublicacion from '../common/TarjetaPublicacion'
import { TarjetaEsqueleto } from '../common/Esqueleto'
import { useRevelado } from '../../hooks/useRevelado'

export default function PublicacionesMasVistas() {
  const referencia = useRevelado()
  const [masVistas, setMasVistas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let activo = true
    setCargando(true)
    obtenerPublicacionesMasVistas(6)
      .then((datos) => {
        if (activo) setMasVistas(datos)
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

  // Si ya cargó y no hay nada que mostrar (por ejemplo, sitio recién
  // sembrado sin vistas registradas), la sección simplemente no se dibuja
  // en vez de mostrar una cuadrícula vacía.
  if (!cargando && !error && masVistas.length === 0) return null

  return (
    <section id="mas-vistas" className="scroll-mt-20 bg-papel-suave py-16 sm:py-20">
      <div ref={referencia} className="revelar contenedor-pagina">
        <p className="antetitulo">Lo más leído</p>
        <h2 className="mt-3 max-w-lg font-display text-2xl font-medium text-tinta sm:text-3xl">
          Los proyectos y artículos que más ha visto la comunidad
        </h2>

        {error && <p className="mt-6 text-sm text-tinta/60">No se pudieron cargar las publicaciones más vistas: {error}</p>}

        <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cargando && Array.from({ length: 3 }).map((_, indice) => <TarjetaEsqueleto key={indice} />)}
          {!cargando && masVistas.map((publicacion) => <TarjetaPublicacion key={publicacion.id} publicacion={publicacion} />)}
        </div>
      </div>
    </section>
  )
}
