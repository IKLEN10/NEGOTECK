import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { obtenerPublicacionesRecientes } from '../../services/servicioPublicaciones'
import TarjetaPublicacion from '../common/TarjetaPublicacion'
import { TarjetaEsqueleto } from '../common/Esqueleto'
import { useRevelado } from '../../hooks/useRevelado'

export default function CarruselPublicaciones() {
  const pistaRef = useRef(null)
  const referenciaRevelado = useRevelado()
  const [recientes, setRecientes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let activo = true
    setCargando(true)
    obtenerPublicacionesRecientes(5)
      .then((datos) => {
        if (activo) setRecientes(datos)
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

  const desplazar = (direccion) => {
    pistaRef.current?.scrollBy({ left: direccion * 320, behavior: 'smooth' })
  }

  return (
    <section id="publicaciones" className="scroll-mt-20 bg-papel py-8 sm:py-12">
      <div ref={referenciaRevelado} className="revelar contenedor-pagina">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="antetitulo">Recién publicado</p>
            <h2 className="mt-3 font-display text-2xl font-medium text-tinta sm:text-3xl">Las 5 publicaciones más recientes</h2>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button
              onClick={() => desplazar(-1)}
              className="rounded-full border border-tinta/15 p-2.5 text-tinta/60 hover:border-azulRey-500 hover:text-azulRey-600"
              aria-label="Anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => desplazar(1)}
              className="rounded-full border border-tinta/15 p-2.5 text-tinta/60 hover:border-azulRey-500 hover:text-azulRey-600"
              aria-label="Siguiente"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {error && <p className="mt-6 text-sm text-tinta/60">No se pudieron cargar las publicaciones recientes: {error}</p>}

        <div
          ref={pistaRef}
          className="scrollbar-none mt-8 flex gap-5 overflow-x-auto pb-4"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {cargando &&
            Array.from({ length: 5 }).map((_, indice) => (
              <div key={indice} className="min-w-[280px] max-w-[280px]">
                <TarjetaEsqueleto />
              </div>
            ))}

          {!cargando &&
            recientes.map((pub) => (
              <div key={pub.id} style={{ scrollSnapAlign: 'start' }}>
                <TarjetaPublicacion publicacion={pub} variante="compact" />
              </div>
            ))}
        </div>
      </div>
    </section>
  )
}
