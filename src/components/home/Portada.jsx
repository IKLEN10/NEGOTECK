import { ArrowRight, BookOpen } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRevelado } from '../../hooks/useRevelado'
import { obtenerPublicacionesRecientes } from '../../services/servicioPublicaciones'

const FORMATO_FECHA = new Intl.DateTimeFormat('es-MX', { month: 'long', year: 'numeric' })

function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

export default function Portada() {
  const referencia = useRevelado()
  const [tituloUltimaEdicion, setTituloUltimaEdicion] = useState(null)
  const fechaActual = capitalizar(FORMATO_FECHA.format(new Date()))

  useEffect(() => {
    let activo = true
    obtenerPublicacionesRecientes(1)
      .then((datos) => {
        if (activo && datos[0]) setTituloUltimaEdicion(datos[0].titulo)
      })
      .catch(() => {
        // Si falla, simplemente no se muestra la tarjeta de última edición.
      })
    return () => {
      activo = false
    }
  }, [])

  return (
    <section className="relative overflow-hidden bg-papel-suave">
      <div className="contenedor-pagina grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16">
        <div ref={referencia} className="revelar order-2 lg:order-1">
          <p className="antetitulo">{fechaActual}</p>
          <h1 className="mt-4 max-w-lg font-display text-4xl font-medium leading-[1.08] text-tinta sm:text-5xl">
            Fomentando la innovación en los negocios
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-tinta/65 sm:text-base">
            NEGOTECK es una Revista Digital que ofrece un espacio virtual para divulgar conocimiento y experiencias que permitan el desarrollo y la innovación en el ámbito empresarial y de negocios.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href="#publicaciones" className="btn-primary">
              Explorar publicaciones <ArrowRight size={16} />
            </a>
            <a href="#como-publicar" className="btn-secondary">
              <BookOpen size={16} /> ¿Cómo publicar?
            </a>
          </div>
        </div>
        <div className="relative order-1 lg:order-2">
          <div className="absolute -inset-4 -z-10 rounded-card bg-verde-100/50 blur-2xl" aria-hidden="true" />
          <img
            src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop"
            alt="Lector revisando publicaciones académicas"
            className="aspect-[4/5] w-full rounded-card object-cover shadow-card"
          />
          {tituloUltimaEdicion && (
            <div className="absolute -bottom-6 -left-6 hidden max-w-[220px] rounded-card border border-tinta/10 bg-papel-suave p-4 shadow-card sm:block">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-azulRey-600">Publicación más reciente</p>
              <p className="mt-1 font-display text-sm text-tinta">&ldquo;{tituloUltimaEdicion}&rdquo;</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
