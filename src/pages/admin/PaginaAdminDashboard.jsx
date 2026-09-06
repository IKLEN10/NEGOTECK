import { CheckCircle2, Clock, FileText, Users, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import TarjetaEstadistica from '../../components/dashboard/TarjetaEstadistica'
import Insignia from '../../components/common/Insignia'
import { obtenerUsuario } from '../../services/servicioAutenticacion'
import {
  calcularEstadisticasGenerales,
  calcularPublicacionesPorArea,
  obtenerActividadReciente,
  obtenerPublicacionesConDetalle,
} from '../../data/estadisticasAdmin'

const formateadorFecha = new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })

export default function PaginaAdminDashboard() {
  const usuario = obtenerUsuario()
  const stats = calcularEstadisticasGenerales()
  const porArea = calcularPublicacionesPorArea()
  const actividad = obtenerActividadReciente(5)
  const pendientesAtencion = obtenerPublicacionesConDetalle()
    .filter((p) => p.estado === 'Pendiente')
    .slice(0, 5)
  const maxArea = Math.max(...porArea.map((a) => a.total), 1)

  return (
    <div>
      <p className="antetitulo">Panel administrativo</p>
      <h1 className="mt-3 font-display text-2xl font-medium text-tinta sm:text-3xl">
        Hola, {usuario?.nombre || 'Administrador'} 👋
      </h1>
      <p className="mt-2 text-sm text-tinta/55">Este es el resumen editorial de la revista.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <TarjetaEstadistica icono={FileText} etiqueta="Total de publicaciones" valor={stats.total} tono="neutro" />
        <TarjetaEstadistica icono={Clock} etiqueta="Pendientes de revisión" valor={stats.pendientes} tono="verde" />
        <TarjetaEstadistica icono={CheckCircle2} etiqueta="Aprobadas" valor={stats.aprobadas} tono="azulRey" />
        <TarjetaEstadistica icono={XCircle} etiqueta="Rechazadas" valor={stats.rechazadas} tono="naranja" />
        <TarjetaEstadistica icono={Users} etiqueta="Autores registrados" valor={stats.totalAutores} tono="neutro" />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Publicaciones que requieren atención */}
        <div className="rounded-card border border-tinta/10 bg-papel-suave p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-tinta/45">Requieren atención</p>
            <Link to="/admin/publicaciones" className="text-xs font-semibold text-azulRey-600 hover:text-azulRey-700">
              Ver todas
            </Link>
          </div>

          {pendientesAtencion.length === 0 ? (
            <p className="mt-6 text-sm text-tinta/50">No hay publicaciones pendientes por revisar. 🎉</p>
          ) : (
            <div className="mt-4 flex flex-col divide-y divide-tinta/10">
              {pendientesAtencion.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-tinta">{p.titulo}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-tinta/45">
                      {p.autor?.nombre} · {p.area?.nombre} · {formateadorFecha.format(new Date(p.fecha))}
                    </p>
                  </div>
                  <Insignia estado={p.estado}>{p.estado}</Insignia>
                </div>
              ))}
            </div>
          )}

          {/* Publicaciones por área */}
          <div className="mt-6 border-t border-tinta/10 pt-5">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-tinta/45">Publicaciones por área</p>
            <div className="flex flex-col gap-3">
              {porArea.map((area) => (
                <div key={area.id} className="flex items-center gap-3">
                  <span className="w-32 shrink-0 truncate text-xs text-tinta/60">{area.nombre}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-tinta/5">
                    <div
                      className="h-full rounded-full bg-azulRey-500"
                      style={{ width: `${(area.total / maxArea) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 shrink-0 text-right font-mono text-xs text-tinta/45">{area.total}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actividad reciente */}
        <div className="rounded-card border border-tinta/10 bg-papel-suave p-5 shadow-soft">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-tinta/45">Actividad reciente</p>
          <div className="mt-4 flex flex-col gap-4">
            {actividad.map((a) => (
              <div key={a.id} className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-azulRey-500" />
                <div>
                  <p className="text-sm text-tinta/75">{a.texto}</p>
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-tinta/40">
                    {formateadorFecha.format(new Date(a.fecha))}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Gráfica simulada, misma distribución visual que el panel del autor */}
          <div className="mt-6 border-t border-tinta/10 pt-5">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-tinta/45">Envíos por mes</p>
            <div className="flex h-24 items-end gap-2">
              {[55, 70, 40, 85, 60, 95, 50].map((altura, i) => (
                <div key={i} className="flex-1 rounded-t-[3px] bg-azulRey-300" style={{ height: `${altura}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
