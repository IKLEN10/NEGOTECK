import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function PaginaNoEncontrada() {
  return (
    <div className="contenedor-pagina flex flex-col items-center justify-center py-28 text-center">
      <p className="font-mono text-sm uppercase tracking-[0.2em] text-azulRey-600">Error 404</p>
      <h1 className="mt-3 font-display text-4xl font-medium text-tinta">Esta página no existe</h1>
      <p className="mt-3 max-w-sm text-tinta/60">
        Puede que el artículo haya sido movido de sección o la dirección esté incompleta.
      </p>
      <Link to="/" className="btn-primary mt-8">
        <ArrowLeft size={16} /> Volver al inicio
      </Link>
    </div>
  )
}
