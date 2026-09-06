import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { preguntasFrecuentes } from '../../data/varios'
import { useRevelado } from '../../hooks/useRevelado'

export default function SeccionPreguntasFrecuentes() {
  const referencia = useRevelado()
  const [idAbierto, setIdAbierto] = useState(preguntasFrecuentes[0].id)

  return (
    <section id="faq" className="scroll-mt-20 bg-papel py-16 sm:py-20">
      <div ref={referencia} className="revelar contenedor-pagina max-w-2xl">
        <p className="antetitulo">Preguntas frecuentes</p>
        <h2 className="mt-3 font-display text-2xl font-medium text-tinta sm:text-3xl">Antes de enviar tu publicación</h2>

        <div className="mt-8 divide-y divide-tinta/10 border-y border-tinta/10">
          {preguntasFrecuentes.map((pregunta) => {
            const estaAbierta = idAbierto === pregunta.id
            return (
              <div key={pregunta.id}>
                <button
                  onClick={() => setIdAbierto(estaAbierta ? null : pregunta.id)}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left"
                  aria-expanded={estaAbierta}
                >
                  <span className="font-display text-[15px] font-medium text-tinta">{pregunta.pregunta}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-tinta/40 transition-transform duration-300 ${estaAbierta ? 'rotate-180' : ''}`}
                  />
                </button>
                <div
                  className="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: estaAbierta ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <p className="pb-4 text-sm leading-relaxed text-tinta/60">{pregunta.respuesta}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
