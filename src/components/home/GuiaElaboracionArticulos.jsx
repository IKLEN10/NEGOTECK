import {
  BookOpen,
  Download,
  FileCheck2,
  FileText,
  Hash,
  ListChecks,
  Mail,
  Notebook,
  ScrollText,
  Send,
} from 'lucide-react'
import { useState } from 'react'
import { useRevelado } from '../../hooks/useRevelado'
import Modal from '../common/Modal'

const ESTRUCTURA = [
  { icono: FileText, titulo: 'Título', texto: 'Breve (hasta 15 palabras), atractivo y que despierte la curiosidad de los lectores.' },
  { icono: Hash, titulo: 'Palabras clave y resumen', texto: 'Tres palabras que identifiquen el artículo, más un resumen motivante de hasta 100 palabras.' },
  { icono: Notebook, titulo: 'Cuerpo del artículo', texto: 'Introducción, desarrollo y conclusiones que respondan al problema planteado y motiven a seguir leyendo.' },
  { icono: ScrollText, titulo: 'Referencias', texto: 'Citas y bibliografía en formato APA, listadas en orden alfabético e incluyendo vínculo a la fuente si aplica.' },
]

const REQUISITOS = [
  'Escritura clara y concisa, con lenguaje ameno; los términos técnicos deben explicarse.',
  'Dirigido a todo el público, no solo a especialistas del tema.',
  'Trabajo inédito: no publicado antes ni en revisión en otro medio.',
  'Máximo 3 autores por artículo, sujeto a revisión por pares.',
]

const ESPECIFICACIONES = [
  ['Extensión', '2 a 20 cuartillas (1,200–5,000 palabras aprox.)'],
  ['Formato', 'Arial 12 pts, interlineado 1.5, justificado y paginado'],
  ['Archivo', '.doc o .docx editable (no se aceptan PDF ni documentos con candados)'],
  ['Imágenes', 'Mínimo 3, sin derechos de autor, 300 dpi, formato JPEG'],
  ['Anonimato', 'El texto no debe incluir nombres de autores ni instituciones'],
]

export default function GuiaElaboracionArticulos() {
  const referencia = useRevelado()
  const [modalNormasAbierto, setModalNormasAbierto] = useState(false)

  return (
    <section id="quieres-publicar" className="scroll-mt-20 bg-papel-suave py-16 sm:py-20">
      <div ref={referencia} className="revelar contenedor-pagina">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="antetitulo">¿Quieres publicar?</p>
            <h2 className="mt-3 font-display text-2xl font-medium text-tinta sm:text-3xl">
              Comparte tu experiencia en el ámbito empresarial y de negocios
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-tinta/65">
              Buscamos artículos de divulgación —no de investigación científica— que compartan conocimientos,
              técnicas, metodologías y tecnologías útiles para los negocios. Cada colaboración pasa por un
              proceso de revisión por pares que asegura su calidad y veracidad.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setModalNormasAbierto(true)}
            className="btn-secondary"
          >
            <BookOpen size={16} /> Normas editoriales
          </button>
        </div>

        {/* Estructura del artículo: reutiliza el mismo patrón visual de "¿Cómo publicar?" */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {ESTRUCTURA.map((paso, indice) => (
            <div key={paso.titulo} className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-naranja-600 text-papel-suave shadow-soft">
                  <paso.icono size={19} />
                </span>
                <span className="font-mono text-xs text-tinta/40">{indice + 1}</span>
                {indice < ESTRUCTURA.length - 1 && (
                  <span className="ml-1 hidden h-px flex-1 bg-tinta/10 lg:block" aria-hidden="true" />
                )}
              </div>
              <h3 className="font-display text-base font-medium text-tinta">{paso.titulo}</h3>
              <p className="text-sm text-tinta/60">{paso.texto}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Requisitos de la colaboración */}
          <div className="rounded-card border border-tinta/10 bg-papel p-6 shadow-soft">
            <div className="flex items-center gap-2.5">
              <ListChecks size={18} className="text-azulRey-600" />
              <h3 className="font-display text-base font-medium text-tinta">Requisitos de la colaboración</h3>
            </div>
            <ul className="mt-4 flex flex-col gap-3">
              {REQUISITOS.map((requisito) => (
                <li key={requisito} className="flex items-start gap-2.5 text-sm text-tinta/65">
                  <FileCheck2 size={15} className="mt-0.5 shrink-0 text-verde-500" />
                  {requisito}
                </li>
              ))}
            </ul>
          </div>

          {/* Especificaciones de formato */}
          <div className="rounded-card border border-tinta/10 bg-papel p-6 shadow-soft">
            <div className="flex items-center gap-2.5">
              <FileText size={18} className="text-azulRey-600" />
              <h3 className="font-display text-base font-medium text-tinta">Especificaciones de formato</h3>
            </div>
            <dl className="mt-4 flex flex-col divide-y divide-tinta/10">
              {ESPECIFICACIONES.map(([etiqueta, valor]) => (
                <div key={etiqueta} className="grid grid-cols-3 gap-3 py-2.5 text-sm">
                  <dt className="font-medium text-tinta/80">{etiqueta}</dt>
                  <dd className="col-span-2 text-tinta/60">{valor}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Envío */}
        <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-card bg-azulRey-600 p-6 shadow-soft sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <Mail size={20} className="mt-0.5 shrink-0 text-papel-suave/80" />
            <p className="max-w-lg text-sm text-papel-suave/90">
              Envía tu manuscrito en formato Word a{' '}
              <a href="mailto:redaccion@negoteck.com" className="font-semibold underline underline-offset-2">
                redaccion@negoteck.com
              </a>
              . Los archivos que no cumplan el formato (.doc o .docx) no serán considerados para revisión.
            </p>
          </div>
          <a href="mailto:redaccion@negoteck.com" className="btn-naranja shrink-0">
            <Send size={16} /> Enviar artículo
          </a>
        </div>
      </div>

      <Modal
        abierto={modalNormasAbierto}
        alCerrar={() => setModalNormasAbierto(false)}
        titulo="Normas editoriales"
        ancho="max-w-4xl"
        pie={
          <a
            href="/documentos/normas-editoriales-negoteck.pdf"
            download
            target="_blank"
            rel="noreferrer"
            className="btn-secondary !px-3 !py-2 text-xs"
          >
            <Download size={14} /> Descargar
          </a>
        }
      >
        <iframe
          src="/documentos/normas-editoriales-negoteck.pdf"
          title="Normas editoriales de NEGOTECK"
          className="h-[70vh] w-full rounded-[4px] bg-white"
        />
      </Modal>
    </section>
  )
}
