import { FileEdit, Send, ShieldCheck, UserPlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useRevelado } from '../../hooks/useRevelado'

const PASOS = [
  { icono: UserPlus, titulo: 'Registrar cuenta', texto: 'Crea tu perfil de autor con tu correo institucional en menos de dos minutos.' },
  { icono: FileEdit, titulo: 'Subir publicación', texto: 'Completa el formulario con tu artículo, resumen, área y palabras clave.' },
  { icono: ShieldCheck, titulo: 'Revisión editorial', texto: 'El comité evalúa el artículo y da seguimiento del estatus en tu panel.' },
  { icono: Send, titulo: 'Publicación', texto: 'Tu artículo se integra al número vigente y queda disponible para lectores.' },
]

export default function ComoPublicar() {
  const referencia = useRevelado()
  return (
    <section id="como-publicar" className="scroll-mt-20 bg-papel py-16 sm:py-20">
      <div ref={referencia} className="revelar contenedor-pagina">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="antetitulo">¿Cómo publicar?</p>
            <h2 className="mt-3 max-w-lg font-display text-2xl font-medium text-tinta sm:text-3xl">
              Cuatro pasos, del borrador a la publicación
            </h2>
          </div>
          <Link to="/registro" className="btn-naranja">
            Comenzar a publicar
          </Link>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PASOS.map((paso, indice) => (
            <div key={paso.titulo} className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-azulRey-600 text-papel-suave shadow-soft">
                  <paso.icono size={19} />
                </span>
                <span className="font-mono text-xs text-tinta/40">Paso {indice + 1}</span>
                {indice < PASOS.length - 1 && (
                  <span className="ml-1 hidden h-px flex-1 bg-tinta/10 lg:block" aria-hidden="true" />
                )}
              </div>
              <h3 className="font-display text-base font-medium text-tinta">{paso.titulo}</h3>
              <p className="text-sm text-tinta/60">{paso.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
