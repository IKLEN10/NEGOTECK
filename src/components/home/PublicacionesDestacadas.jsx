import { useEffect, useState } from 'react'
import { obtenerPublicacionesDestacadas } from '../../services/servicioPublicaciones'
import TarjetaPublicacion from '../common/TarjetaPublicacion'
import { TarjetaEsqueleto } from '../common/Esqueleto'
import { useRevelado } from '../../hooks/useRevelado'

export default function PublicacionesDestacadas() {
  const referencia = useRevelado()
  const [destacadas, setDestacadas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let activo = true
    setCargando(true)
    obtenerPublicacionesDestacadas(6)
      .then((datos) => {
        if (activo) setDestacadas(datos)
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
    <section id="publicaciones-destacadas" className="scroll-mt-20 bg-papel-suave py-16 sm:py-20">
      <div ref={referencia} className="revelar contenedor-pagina">
        <p className="antetitulo">Publicaciones destacadas</p>
        <h2 className="mt-3 max-w-lg font-display text-2xl font-medium text-tinta sm:text-3xl">
          Lo mejor de este número, seleccionado por el comité editorial
        </h2>

        {error && <p className="mt-6 text-sm text-tinta/60">No se pudieron cargar las publicaciones destacadas: {error}</p>}

        <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cargando && Array.from({ length: 3 }).map((_, indice) => <TarjetaEsqueleto key={indice} />)}
          {!cargando && destacadas.map((pub) => <TarjetaPublicacion key={pub.id} publicacion={pub} />)}
        </div>
      </div>
    </section>
  )
}
