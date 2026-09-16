import { ArrowRight, BookOpen, Mail, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useRevelado } from '../../hooks/useRevelado'

// Reemplaza los bloques largos de "Quiénes somos", "¿Cómo publicar?" y
// "Contacto" que antes vivían completos en el inicio: ahora esas
// secciones tienen su propia página, y aquí solo queda un acceso breve
// hacia cada una para que siga siendo fácil encontrarlas sin saturar la
// portada con texto institucional.
const ENLACES = [
  {
    icono: Users,
    tono: 'bg-azulRey-50 text-azulRey-600',
    titulo: 'Quiénes somos',
    texto: 'Misión, visión y la comunidad detrás de NEGOTECK.',
    to: '/quienes-somos',
  },
  {
    icono: BookOpen,
    tono: 'bg-naranja-50 text-naranja-600',
    titulo: 'Cómo publicar',
    texto: 'El proceso, los requisitos y las normas editoriales.',
    to: '/como-publicar',
  },
  {
    icono: Mail,
    tono: 'bg-verde-100 text-verde-600',
    titulo: 'Contacto',
    texto: 'Escríbele al equipo editorial y resuelve tus dudas.',
    to: '/contacto',
  },
]

export default function SeccionEnlacesRapidos() {
  const referencia = useRevelado()
  return (
    <section className="bg-papel-suave py-14 sm:py-16">
      <div ref={referencia} className="revelar contenedor-pagina">
        <p className="antetitulo">Conoce más</p>
        <h2 className="mt-3 max-w-lg font-display text-2xl font-medium text-tinta sm:text-3xl">
          Más sobre la revista
        </h2>

        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {ENLACES.map((enlace) => (
            <Link
              key={enlace.titulo}
              to={enlace.to}
              className="group flex flex-col gap-4 rounded-card border border-tinta/10 bg-papel p-6 shadow-soft transition-shadow hover:shadow-card"
            >
              <span className={`flex h-11 w-11 items-center justify-center rounded-full ${enlace.tono}`}>
                <enlace.icono size={20} />
              </span>
              <div>
                <h3 className="font-display text-base font-medium text-tinta">{enlace.titulo}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-tinta/60">{enlace.texto}</p>
              </div>
              <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-azulRey-600">
                Ver más
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
