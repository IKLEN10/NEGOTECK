import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { obtenerPublicacionesRecientes } from '../../services/servicioPublicaciones'
import { useRevelado } from '../../hooks/useRevelado'
import Insignia from '../common/Insignia'

// El carrusel avanza solo cada INTERVALO_AUTOPLAY_MS; cuando la persona
// interactúa (flechas, puntos o pasa el cursor sobre la sección) se detiene
// para no interrumpir la lectura, y retoma el avance automático pasado
// PAUSA_TRAS_INTERACCION_MS de inactividad.
const INTERVALO_AUTOPLAY_MS = 6000
const PAUSA_TRAS_INTERACCION_MS = 9000

const formateadorFecha = new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })

export default function CarruselPublicaciones() {
  const navegar = useNavigate()
  const referenciaRevelado = useRevelado()
  const [recientes, setRecientes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [indice, setIndice] = useState(0)

  // Refs (no estado) para no reiniciar el intervalo de autoplay en cada
  // interacción: solo cambian el comportamiento del intervalo ya activo.
  const enFocoRef = useRef(false)
  const pausadoHastaRef = useRef(0)

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

  useEffect(() => {
    if (recientes.length < 2) return undefined

    const intervalo = setInterval(() => {
      if (enFocoRef.current || Date.now() < pausadoHastaRef.current) return
      setIndice((actual) => (actual + 1) % recientes.length)
    }, INTERVALO_AUTOPLAY_MS)

    return () => clearInterval(intervalo)
  }, [recientes.length])

  const marcarInteraccion = useCallback(() => {
    pausadoHastaRef.current = Date.now() + PAUSA_TRAS_INTERACCION_MS
  }, [])

  const irA = useCallback(
    (nuevoIndice) => {
      setIndice(nuevoIndice)
      marcarInteraccion()
    },
    [marcarInteraccion],
  )

  const avanzar = useCallback(
    (direccion) => {
      setIndice((actual) => (actual + direccion + recientes.length) % recientes.length)
      marcarInteraccion()
    },
    [marcarInteraccion, recientes.length],
  )

  const hayVarias = recientes.length > 1

  return (
    <section id="publicaciones" className="scroll-mt-20 bg-papel py-8 sm:py-12">
      <div ref={referenciaRevelado} className="revelar contenedor-pagina">
        <div>
          <p className="antetitulo">Recién publicado</p>
          <h2 className="mt-3 font-display text-2xl font-medium text-tinta sm:text-3xl">Las 5 publicaciones más recientes</h2>
        </div>

        {error && <p className="mt-6 text-sm text-tinta/60">No se pudieron cargar las publicaciones recientes: {error}</p>}

        {cargando && (
          <div className="esqueleto mt-8 h-[300px] w-full rounded-card sm:h-[380px] lg:h-[440px]" />
        )}

        {!cargando && recientes.length > 0 && (
          <div
            className="group relative mt-8 overflow-hidden rounded-card shadow-card"
            onMouseEnter={() => {
              enFocoRef.current = true
            }}
            onMouseLeave={() => {
              enFocoRef.current = false
            }}
          >
            <div className="relative h-[300px] w-full sm:h-[380px] lg:h-[440px]">
              {recientes.map((publicacion, posicion) => (
                <button
                  key={publicacion.id}
                  type="button"
                  onClick={() => navegar(`/publicacion/${publicacion.id}`)}
                  aria-hidden={posicion !== indice}
                  tabIndex={posicion === indice ? 0 : -1}
                  className={`absolute inset-0 h-full w-full text-left transition-opacity duration-700 ease-in-out ${
                    posicion === indice ? 'z-10 opacity-100' : 'pointer-events-none z-0 opacity-0'
                  }`}
                >
                  <img
                    src={publicacion.imagen || '/logo-negoteck.jpg'}
                    alt={`Portada de ${publicacion.titulo}`}
                    loading={posicion === 0 ? 'eager' : 'lazy'}
                    onError={(evento) => {
                      evento.currentTarget.onerror = null
                      evento.currentTarget.src = '/logo-negoteck.jpg'
                    }}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-tinta/95 via-tinta/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 pb-12 sm:p-8 sm:pb-14 lg:p-10 lg:pb-16">
                    <div className="flex flex-wrap items-center gap-3">
                      {publicacion.area && <Insignia tono={publicacion.area.color}>{publicacion.area.nombre}</Insignia>}
                      <span className="font-mono text-[11px] text-papel-suave/70">
                        {formateadorFecha.format(new Date(publicacion.fecha))}
                      </span>
                    </div>
                    <h3 className="mt-3 max-w-2xl font-display text-xl font-medium leading-snug text-papel-suave sm:text-2xl lg:text-[28px]">
                      {publicacion.titulo}
                    </h3>
                  </div>
                </button>
              ))}
            </div>

            {hayVarias && (
              <>
                <button
                  type="button"
                  onClick={() => avanzar(-1)}
                  className="absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-papel-suave/30 bg-tinta/40 p-2.5 text-papel-suave backdrop-blur-sm transition-colors hover:bg-tinta/60 sm:block"
                  aria-label="Publicación anterior"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => avanzar(1)}
                  className="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-papel-suave/30 bg-tinta/40 p-2.5 text-papel-suave backdrop-blur-sm transition-colors hover:bg-tinta/60 sm:block"
                  aria-label="Publicación siguiente"
                >
                  <ChevronRight size={18} />
                </button>

                <div className="absolute inset-x-0 bottom-4 z-20 flex items-center justify-center gap-2 sm:bottom-5">
                  {recientes.map((publicacion, posicion) => (
                    <button
                      key={publicacion.id}
                      type="button"
                      onClick={() => irA(posicion)}
                      aria-label={`Ir a la publicación ${posicion + 1}`}
                      aria-current={posicion === indice}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        posicion === indice ? 'w-6 bg-papel-suave' : 'w-2 bg-papel-suave/45 hover:bg-papel-suave/70'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
