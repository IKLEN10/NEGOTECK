import { BookOpen, Layers, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { obtenerEstadisticas } from '../../services/servicioEstadisticas'
import { estadisticasRevista as estadisticasIniciales } from '../../data/varios'
import { useRevelado } from '../../hooks/useRevelado'
import TarjetaEstadistica from '../dashboard/TarjetaEstadistica'

// "Vistas totales" y "Usuarios activos ahora" ya se muestran en pequeño
// junto al buscador del menú (BarraNavegacion → ContadoresEnVivo), así
// que aquí solo se listan las estadísticas de apoyo para no repetir la
// misma cifra dos veces en la misma página.
const PRESENTACION = {
  s1: { icono: BookOpen, tono: 'azulRey' },
  s2: { icono: Users, tono: 'verde' },
  s3: { icono: Layers, tono: 'naranja' },
}

export default function BandaEstadisticas() {
  const referencia = useRevelado()
  const [estadisticas, setEstadisticas] = useState(estadisticasIniciales)

  useEffect(() => {
    let activo = true
    obtenerEstadisticas()
      .then((datos) => {
        if (activo) setEstadisticas(datos)
      })
      .catch(() => {
        // Si la API falla, se conservan los valores de respaldo.
      })
    return () => {
      activo = false
    }
  }, [])

  const secundarias = estadisticas.filter((s) => s.id in PRESENTACION)

  if (secundarias.length === 0) return null

  return (
    <section id="estadisticas" className="scroll-mt-20 bg-papel py-10 sm:py-14">
      <div ref={referencia} className="revelar contenedor-pagina">
        <p className="antetitulo">NEGOTECK en números</p>
        <h2 className="mt-3 max-w-lg font-display text-2xl font-medium text-tinta sm:text-3xl">
          El pulso de la revista
        </h2>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {secundarias.map((s) => {
            const presentacion = PRESENTACION[s.id]
            return (
              <TarjetaEstadistica
                key={s.id}
                icono={presentacion.icono}
                etiqueta={s.etiqueta}
                valor={s.valor}
                tono={presentacion.tono}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
