import { Calendar, Check, Eye, Search, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import Insignia from '../../components/common/Insignia'
import Modal from '../../components/common/Modal'
import { useNotificacion } from '../../hooks/useNotificacion'
import {
  obtenerSolicitudesPublicaciones,
  aprobarPublicacion,
  rechazarPublicacion,
} from '../../services/servicioPublicaciones'

const formateadorFecha = new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })

export default function PaginaAdminPublicaciones() {
  const [publicaciones, setPublicaciones] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [detalle, setDetalle] = useState(null)
  const [aRechazar, setARechazar] = useState(null)
  const [observaciones, setObservaciones] = useState('')
  const [procesando, setProcesando] = useState(false)
  const { mostrarNotificacion } = useNotificacion()

  const cargarPendientes = async () => {
    setCargando(true)
    try {
      const datos = await obtenerSolicitudesPublicaciones()
      setPublicaciones(datos || [])
    } catch (error) {
      mostrarNotificacion(error.message || 'No se pudieron cargar las publicaciones pendientes.', 'advertencia')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarPendientes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()
    if (!termino) return publicaciones
    return publicaciones.filter((p) => p.titulo?.toLowerCase().includes(termino))
  }, [publicaciones, busqueda])

  const quitarDeLaLista = (id) => {
    setPublicaciones((anteriores) => anteriores.filter((p) => p.id !== id))
    setDetalle((actual) => (actual?.id === id ? null : actual))
  }

  const manejarAprobar = async (publicacion) => {
    setProcesando(true)
    try {
      await aprobarPublicacion(publicacion.id)
      quitarDeLaLista(publicacion.id)
      mostrarNotificacion(`"${publicacion.titulo}" fue aprobada y ya aparece en la página principal.`, 'exito')
    } catch (error) {
      mostrarNotificacion(error.message || 'No se pudo aprobar la publicación.', 'advertencia')
    } finally {
      setProcesando(false)
    }
  }

  const abrirRechazo = (publicacion) => {
    setObservaciones('')
    setARechazar(publicacion)
  }

  const confirmarRechazo = async () => {
    if (!observaciones.trim()) {
      mostrarNotificacion('Escribe el motivo del rechazo antes de continuar.', 'advertencia')
      return
    }
    setProcesando(true)
    try {
      await rechazarPublicacion(aRechazar.id, observaciones.trim())
      quitarDeLaLista(aRechazar.id)
      mostrarNotificacion(`"${aRechazar.titulo}" fue rechazada.`, 'advertencia')
      setARechazar(null)
    } catch (error) {
      mostrarNotificacion(error.message || 'No se pudo rechazar la publicación.', 'advertencia')
    } finally {
      setProcesando(false)
    }
  }

  return (
    <div>
      <div>
        <p className="antetitulo">Panel administrativo</p>
        <h1 className="mt-3 font-display text-2xl font-medium text-tinta sm:text-3xl">Publicaciones pendientes</h1>
        <p className="mt-2 text-sm text-tinta/55">Revisa el contenido enviado por los autores y decide si se publica.</p>
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-[4px] border border-tinta/15 bg-papel-suave px-3 py-2.5 sm:max-w-sm">
        <Search size={16} className="text-tinta/40" />
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por título…"
          className="flex-1 bg-transparent text-sm text-tinta placeholder:text-tinta/35 focus:outline-none"
        />
      </div>

      {cargando ? (
        <p className="mt-10 text-center text-sm text-tinta/50">Cargando publicaciones pendientes…</p>
      ) : (
        <>
          {/* Tabla para pantallas grandes */}
          <div className="mt-6 hidden overflow-hidden rounded-card border border-tinta/10 bg-papel-suave shadow-soft md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-tinta/10 font-mono text-[11px] uppercase tracking-[0.1em] text-tinta/45">
                  <th className="px-5 py-3.5 font-medium">Título</th>
                  <th className="px-5 py-3.5 font-medium">Área</th>
                  <th className="px-5 py-3.5 font-medium">Fecha</th>
                  <th className="px-5 py-3.5 font-medium">Estado</th>
                  <th className="px-5 py-3.5 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tinta/10">
                {filtradas.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-tinta/[0.03]">
                    <td className="max-w-xs px-5 py-3.5 font-medium text-tinta">{p.titulo}</td>
                    <td className="px-5 py-3.5 text-tinta/60">{p.area?.nombre}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-tinta/50">{formateadorFecha.format(new Date(p.fecha))}</td>
                    <td className="px-5 py-3.5"><Insignia estado="Pendiente">Pendiente</Insignia></td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1.5">
                        <button onClick={() => setDetalle(p)} className="rounded-full p-2 text-tinta/45 hover:bg-tinta/5 hover:text-azulRey-600" aria-label="Ver detalles"><Eye size={15} /></button>
                        <button
                          onClick={() => manejarAprobar(p)}
                          disabled={procesando}
                          className="rounded-full p-2 text-tinta/45 hover:bg-verde-100 hover:text-verde-600 disabled:pointer-events-none disabled:opacity-30"
                          aria-label="Aprobar"
                        >
                          <Check size={15} />
                        </button>
                        <button
                          onClick={() => abrirRechazo(p)}
                          disabled={procesando}
                          className="rounded-full p-2 text-tinta/45 hover:bg-naranja-100 hover:text-naranja-600 disabled:pointer-events-none disabled:opacity-30"
                          aria-label="Rechazar"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtradas.length === 0 && <p className="px-5 py-10 text-center text-sm text-tinta/50">No hay publicaciones pendientes.</p>}
          </div>

          {/* Tarjetas para móvil */}
          <div className="mt-6 flex flex-col gap-4 md:hidden">
            {filtradas.map((p) => (
              <div key={p.id} className="rounded-card border border-tinta/10 bg-papel-suave p-4 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium text-tinta">{p.titulo}</p>
                  <Insignia estado="Pendiente">Pendiente</Insignia>
                </div>
                <p className="mt-1 font-mono text-xs text-tinta/45">
                  {p.area?.nombre} · {formateadorFecha.format(new Date(p.fecha))}
                </p>
                <div className="mt-3 flex gap-2 border-t border-tinta/10 pt-3">
                  <button onClick={() => setDetalle(p)} className="btn-ghost flex-1 !px-3 !py-2 text-xs">Ver</button>
                  <button onClick={() => manejarAprobar(p)} disabled={procesando} className="btn-ghost flex-1 !px-3 !py-2 text-xs text-verde-600">Aprobar</button>
                  <button onClick={() => abrirRechazo(p)} disabled={procesando} className="btn-ghost flex-1 !px-3 !py-2 text-xs text-naranja-600">Rechazar</button>
                </div>
              </div>
            ))}
            {filtradas.length === 0 && <p className="py-10 text-center text-sm text-tinta/50">No hay publicaciones pendientes.</p>}
          </div>
        </>
      )}

      {/* Modal de detalle */}
      <Modal
        abierto={!!detalle}
        alCerrar={() => setDetalle(null)}
        titulo={detalle?.titulo}
        ancho="max-w-2xl"
        pie={
          detalle && (
            <>
              <button onClick={() => { abrirRechazo(detalle) }} className="btn-secondary">
                <X size={14} /> Rechazar
              </button>
              <button onClick={() => manejarAprobar(detalle)} disabled={procesando} className="btn-primary disabled:opacity-40">
                <Check size={14} /> Aprobar
              </button>
            </>
          )
        }
      >
        {detalle && (
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Insignia tono={detalle.area?.color}>{detalle.area?.nombre}</Insignia>
              <Insignia estado="Pendiente">Pendiente</Insignia>
            </div>

            <p className="mt-4 flex items-center gap-1.5 font-mono text-[11px] text-tinta/45">
              <Calendar size={12} /> Enviado el {formateadorFecha.format(new Date(detalle.fecha))}
            </p>

            <p className="mt-4 text-sm leading-relaxed text-tinta/75">{detalle.resumen}</p>
          </div>
        )}
      </Modal>

      {/* Modal de rechazo (pide motivo) */}
      <Modal
        abierto={!!aRechazar}
        alCerrar={() => setARechazar(null)}
        titulo="Rechazar publicación"
        pie={
          <>
            <button onClick={() => setARechazar(null)} className="btn-secondary">Cancelar</button>
            <button onClick={confirmarRechazo} disabled={procesando} className="btn-naranja disabled:opacity-40">Rechazar</button>
          </>
        }
      >
        <p className="text-sm text-tinta/70">
          Explica por qué se rechaza “{aRechazar?.titulo}”. El autor verá este motivo y podrá corregir y reenviar la publicación.
        </p>
        <textarea
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          rows={4}
          maxLength={500}
          placeholder="Motivo del rechazo…"
          className="campo-entrada mt-4 resize-none"
        />
      </Modal>
    </div>
  )
}
