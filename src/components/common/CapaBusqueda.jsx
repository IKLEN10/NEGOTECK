import { Search, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { obtenerPublicacionesRecientes } from '../../services/servicioPublicaciones'

export default function CapaBusqueda({ abierta, alCerrar }) {
  const [busqueda, setBusqueda] = useState('')
  const [publicaciones, setPublicaciones] = useState([])
  const [cargado, setCargado] = useState(false)
  const navegar = useNavigate()

  // Carga el catálogo real del backend la primera vez que se abre el
  // buscador (misma fuente de datos que usa el resto del sitio).
  useEffect(() => {
    if (!abierta || cargado) return
    let activo = true
    obtenerPublicacionesRecientes(100)
      .then((datos) => {
        if (activo) setPublicaciones(datos)
      })
      .catch(() => {
        if (activo) setPublicaciones([])
      })
      .finally(() => {
        if (activo) setCargado(true)
      })
    return () => {
      activo = false
    }
  }, [abierta, cargado])

  const resultados = useMemo(() => {
    if (!busqueda.trim()) return []
    const texto = busqueda.toLowerCase()
    return publicaciones
      .filter((p) => p.titulo.toLowerCase().includes(texto))
      .slice(0, 6)
  }, [busqueda, publicaciones])

  if (!abierta) return null

  return (
    <div className="fixed inset-0 z-[95] flex items-start justify-center bg-tinta/50 px-4 pt-24 backdrop-blur-[2px]" onClick={alCerrar}>
      <div
        className="w-full max-w-xl animate-fadeUp rounded-card bg-papel-suave shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-tinta/10 px-5 py-4">
          <Search size={18} className="text-tinta/40" />
          <input
            autoFocus
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar publicaciones, autores, temas…"
            aria-label="Buscar publicaciones, autores o temas"
            className="flex-1 bg-transparent text-[15px] text-tinta placeholder:text-tinta/35 focus:outline-none"
          />
          <button onClick={alCerrar} className="text-tinta/40 hover:text-tinta/80" aria-label="Cerrar búsqueda">
            <X size={18} />
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {busqueda.trim() && resultados.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-tinta/50">Sin resultados para &ldquo;{busqueda}&rdquo;.</p>
          )}
          {resultados.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                navegar(`/publicacion/${p.id}`)
                alCerrar()
                setBusqueda('')
              }}
              className="flex w-full flex-col items-start gap-0.5 rounded-[4px] px-3 py-2.5 text-left transition-colors hover:bg-tinta/5"
            >
              <span className="text-sm font-medium text-tinta">{p.titulo}</span>
              <span className="font-mono text-[11px] text-tinta/45">{p.fecha}</span>
            </button>
          ))}
          {!busqueda.trim() && (
            <p className="px-3 py-6 text-center text-sm text-tinta/45">
              Escribe para buscar entre las publicaciones.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
