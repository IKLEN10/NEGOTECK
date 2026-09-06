import { Building2, Eye, HeartHandshake, Target, Users } from 'lucide-react'
import { useRevelado } from '../../hooks/useRevelado'
import Insignia from '../common/Insignia'

const PILARES = [
  {
    icono: Target,
    titulo: 'Misión',
    texto:
      'Ser un espacio informativo para compartir experiencias y conocimiento que promuevan el desarrollo y la innovación en los negocios.',
  },
  {
    icono: Eye,
    titulo: 'Visión',
    texto:
      'Ser referente en el mundo de habla hispana en la difusión de conocimiento que impacte positivamente el ámbito empresarial y de negocios.',
  },
  {
    icono: HeartHandshake,
    titulo: 'Ética y valores',
    texto:
      'Conformamos una comunidad fraterna con libertad de pensamiento, igualdad y respeto, en búsqueda del desarrollo común a través de la difusión honesta de conocimiento.',
  },
]

const COMUNIDAD = [
  {
    icono: Users,
    titulo: 'Nuestros clientes',
    texto:
      'Empresarios, docentes y estudiantes que desean mantenerse actualizados en conocimientos, técnicas, métodos y experiencias que les ayuden a fortalecer y desarrollar los negocios.',
  },
  {
    icono: Building2,
    titulo: 'Nuestros socios',
    texto:
      'Investigadores, profesionistas y empresarios que desean compartir sus conocimientos y experiencias de una forma ética, clara y amena, en beneficio del mundo empresarial y la sociedad.',
  },
]

const OBJETIVOS = [
  'Brindar a nuestros colaboradores un espacio dinámico y ameno para dar a conocer sus experiencias y conocimiento, promoviendo su propio desarrollo profesional.',
  'Ofrecer a nuestros lectores información útil y de actualidad que permita el desarrollo y la innovación en el ámbito empresarial y de negocios.',
  'Divulgar las notas periodísticas de una forma clara y amena, a través de plataformas digitales multimedios.',
]

const PRODUCTOS = [
  'Artículos',
  'Vídeos',
  'Manuales',
  'Libros',
  'Directorio de consultores y freelancers',
  'Directorio de empresas',
]

export default function SeccionAcercaDe() {
  const referencia = useRevelado()
  return (
    <section id="quienes-somos" className="scroll-mt-20 bg-papel-suave py-8 sm:py-12">
      <div ref={referencia} className="revelar contenedor-pagina">
        <div className="max-w-2xl">
          <p className="antetitulo">Quiénes somos</p>
          <h2 className="mt-3 font-display text-2xl font-medium text-tinta sm:text-3xl">
            Un espacio para divulgar innovación en los negocios
          </h2>
          <p className="mt-5 text-justify text-[15px] leading-relaxed text-tinta/65 [text-justify:inter-word] hyphens-auto">
            NEGOTECK es una revista digital que ofrece un espacio virtual para divulgar conocimiento y experiencias
            que permitan el desarrollo y la innovación en el ámbito empresarial y de negocios.
          </p>
        </div>

        {/* Misión / Visión / Ética y valores */}
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {PILARES.map((pilar) => (
            <div key={pilar.titulo} className="tarjeta-cita p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-azulRey-50 text-azulRey-600">
                <pilar.icono size={20} />
              </span>
              <h3 className="mt-4 font-display text-base font-medium text-tinta">{pilar.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-tinta/60">{pilar.texto}</p>
            </div>
          ))}
        </div>

        {/* Clientes y socios */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {COMUNIDAD.map((grupo) => (
            <div
              key={grupo.titulo}
              className="flex gap-4 rounded-card border border-tinta/10 bg-papel p-6 shadow-soft"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-naranja-50 text-naranja-600">
                <grupo.icono size={20} />
              </span>
              <div>
                <h3 className="font-display text-base font-medium text-tinta">{grupo.titulo}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-tinta/60">{grupo.texto}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Objetivos estratégicos */}
        <div className="mt-12">
          <p className="antetitulo">Objetivos estratégicos</p>
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            {OBJETIVOS.map((texto, indice) => (
              <div key={texto} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-verde-100 font-mono text-xs text-verde-600">
                  {indice + 1}
                </span>
                <p className="text-sm leading-relaxed text-tinta/65">{texto}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Productos y servicios */}
        <div className="mt-12">
          <p className="antetitulo">Productos y servicios</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {PRODUCTOS.map((producto) => (
              <Insignia key={producto} tono="azulRey">
                {producto}
              </Insignia>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
