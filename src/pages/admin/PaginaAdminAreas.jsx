import { Lock } from 'lucide-react'
import { calcularPublicacionesPorArea } from '../../data/estadisticasAdmin'

export default function PaginaAdminAreas() {
  const areas = calcularPublicacionesPorArea()

  return (
    <div>
      <div>
        <p className="antetitulo">Panel administrativo</p>
        <h1 className="mt-3 font-display text-2xl font-medium text-tinta sm:text-3xl">Áreas de la revista</h1>
        <p className="mt-2 flex items-center gap-2 text-sm text-tinta/55">
          <Lock size={14} className="text-tinta/40" />
          Las áreas son fijas y se administran directamente en la base de datos; aquí solo se muestran con fines de referencia.
        </p>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {areas.map((area) => (
          <div key={area.id} className="group relative flex flex-col overflow-hidden rounded-card bg-papel-suave shadow-card">
            <div className="relative h-28 overflow-hidden">
              <img
                src={area.imagen || '/logo-negoteck.jpg'}
                alt={`Imagen del área ${area.nombre}`}
                loading="lazy"
                onError={(evento) => {
                  evento.currentTarget.onerror = null
                  evento.currentTarget.src = '/logo-negoteck.jpg'
                }}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-tinta/60 via-tinta/0 to-tinta/0" />
              <span className="absolute bottom-2 left-3 font-mono text-[11px] uppercase tracking-[0.14em] text-papel-suave/90">
                {area.total} publicaciones
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-1.5 p-4">
              <h3 className="font-display text-base font-medium text-tinta">{area.nombre}</h3>
              <p className="text-sm text-tinta/60">{area.resumenBreve}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
