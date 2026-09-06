import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function TarjetaArea({ area }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-card bg-papel-suave shadow-card transition-transform duration-300 hover:-translate-y-1">
      <div className="relative h-32 overflow-hidden">
        <img
          src={area.imagen || '/logo-negoteck.jpg'}
          alt={`Imagen del área ${area.nombre}`}
          loading="lazy"
          onError={(evento) => {
            evento.currentTarget.onerror = null
            evento.currentTarget.src = '/logo-negoteck.jpg'
          }}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-tinta/60 via-tinta/0 to-tinta/0" />
        <span className="absolute bottom-2 left-3 font-mono text-[11px] uppercase tracking-[0.14em] text-papel-suave/90">
          {area.cantidad} publicaciones
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-base font-medium text-tinta">{area.nombre}</h3>
        <p className="flex-1 text-sm text-tinta/60">{area.resumenBreve}</p>
        <Link
          to={`/areas/${area.id}`}
          className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-azulRey-600 hover:text-azulRey-700"
        >
          Ver más <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  )
}
