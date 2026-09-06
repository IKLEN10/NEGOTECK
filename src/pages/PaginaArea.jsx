import { ArrowUpDown, Calendar, FileText, Search, User, Video } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { obtenerAreaPorId, areas } from '../data/areas'
import { obtenerPublicacionesRecientes } from '../services/servicioPublicaciones'
import TarjetaPublicacion from '../components/common/TarjetaPublicacion'
import { TarjetaEsqueleto } from '../components/common/Esqueleto'
import BarraNavegacion from '../components/layout/BarraNavegacion'

export default function PaginaArea() {
  const { idArea } = useParams()
  const area = obtenerAreaPorId(idArea)
  const [busqueda, setBusqueda] = useState('')
  const [anio, setAnio] = useState('todos')
  const [autor, setAutor] = useState('todos')
  const [tipoContenido, setTipoContenido] = useState('todos')
  const [orden, setOrden] = useState('recientes')
  const [todasPublicaciones, setTodasPublicaciones] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // Trae las publicaciones reales del backend (misma fuente que usa la
  // portada) y filtra por área en el cliente, ya que hoy no existe un
  // endpoint que filtre por área en el servidor.
  useEffect(() => {
    let activo = true
    setCargando(true)
    obtenerPublicacionesRecientes(100)
      .then((datos) => {
        if (activo) setTodasPublicaciones(datos)
      })
      .catch((err) => {
        if (activo) setError(err.message)
      })
      .finally(() => {
        if (activo) setCargando(false)
      })
    return () => {
      activo = false
    }
  }, [])

  const publicacionesArea = useMemo(
    () => (area ? todasPublicaciones.filter((p) => p.area?.id === area.id) : []),
    [area, todasPublicaciones],
  )

  const anios = useMemo(
    () => Array.from(new Set(publicacionesArea.map((p) => p.fecha.slice(0, 4)))).sort((a, b) => b - a),
    [publicacionesArea],
  )

  const autoresArea = useMemo(
    () => Array.from(new Set(publicacionesArea.map((p) => p.autor?.nombre).filter(Boolean))).sort(),
    [publicacionesArea],
  )

  const filtradas = publicacionesArea
    .filter((p) => {
      const coincideBusqueda = busqueda.trim() === '' || p.titulo.toLowerCase().includes(busqueda.toLowerCase())
      const coincideAnio = anio === 'todos' || p.fecha.startsWith(anio)
      const coincideAutor = autor === 'todos' || p.autor?.nombre === autor
      const coincideTipo = tipoContenido === 'todos' || (p.tipoContenido || 'archivo') === tipoContenido
      return coincideBusqueda && coincideAnio && coincideAutor && coincideTipo
    })
    .sort((a, b) => {
      const diferencia = new Date(a.fecha) - new Date(b.fecha)
      return orden === 'recientes' ? -diferencia : diferencia
    })

  const manejarCambioFiltro = (setter) => (e) => {
    setter(e.target.value)
  }

  if (!area) {
    return (
      <div>
        <BarraNavegacion />
        <div className="contenedor-pagina py-24 text-center">
          <p className="font-display text-2xl text-tinta">Área no encontrada</p>
          <Link to="/" className="btn-primary mt-6 inline-flex">Volver al inicio</Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <BarraNavegacion />
      <header className="relative overflow-hidden bg-azulRey-700">
        <img
          src={area.imagen || '/logo-negoteck.jpg'}
          alt={`Imagen del área ${area.nombre}`}
          onError={(evento) => {
            evento.currentTarget.onerror = null
            evento.currentTarget.src = '/logo-negoteck.jpg'
          }}
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-azulRey-900/90 via-azulRey-800/60 to-transparent" />
        <div className="contenedor-pagina relative py-16 sm:py-20">
          <p className="antetitulo text-papel-suave/70 before:bg-papel-suave/60">Área de investigación</p>
          <h1 className="mt-3 max-w-lg font-display text-3xl font-medium text-papel-suave sm:text-4xl">{area.nombre}</h1>
          <p className="mt-4 max-w-xl text-[15px] text-papel-suave/75">{area.descripcion}</p>
        </div>
      </header>

      <div className="contenedor-pagina py-10 sm:py-14">
        {/* Barra de filtros */}
        <div className="flex flex-col gap-4 rounded-card border border-tinta/10 bg-papel-suave p-4 shadow-soft sm:flex-row sm:items-center sm:p-5">
          <div className="flex flex-1 items-center gap-2 rounded-[4px] border border-tinta/15 bg-papel px-3 py-2.5">
            <Search size={16} className="text-tinta/40" />
            <input
              value={busqueda}
              onChange={manejarCambioFiltro(setBusqueda)}
              placeholder="Buscar en esta área…"
              aria-label="Buscar publicaciones en esta área"
              className="flex-1 bg-transparent text-sm text-tinta placeholder:text-tinta/35 focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-[4px] border border-tinta/15 bg-papel px-3 py-2.5">
              <Calendar size={15} className="text-tinta/40" />
              <select value={anio} onChange={manejarCambioFiltro(setAnio)} aria-label="Filtrar por año" className="bg-transparent text-sm text-tinta focus:outline-none">
                <option value="todos">Todos los años</option>
                {anios.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 rounded-[4px] border border-tinta/15 bg-papel px-3 py-2.5">
              <User size={15} className="text-tinta/40" />
              <select value={autor} onChange={manejarCambioFiltro(setAutor)} aria-label="Filtrar por autor" className="bg-transparent text-sm text-tinta focus:outline-none">
                <option value="todos">Todos los autores</option>
                {autoresArea.map((nombre) => (
                  <option key={nombre} value={nombre}>{nombre}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 rounded-[4px] border border-tinta/15 bg-papel px-3 py-2.5">
              {tipoContenido === 'video' ? (
                <Video size={15} className="text-tinta/40" />
              ) : (
                <FileText size={15} className="text-tinta/40" />
              )}
              <select
                value={tipoContenido}
                onChange={manejarCambioFiltro(setTipoContenido)}
                aria-label="Filtrar por tipo de contenido"
                className="bg-transparent text-sm text-tinta focus:outline-none"
              >
                <option value="todos">Todo el contenido</option>
                <option value="archivo">Artículos</option>
                <option value="video">Videos</option>
              </select>
            </div>
            <div className="flex items-center gap-2 rounded-[4px] border border-tinta/15 bg-papel px-3 py-2.5">
              <ArrowUpDown size={15} className="text-tinta/40" />
              <select value={orden} onChange={manejarCambioFiltro(setOrden)} aria-label="Ordenar publicaciones" className="bg-transparent text-sm text-tinta focus:outline-none">
                <option value="recientes">Más recientes</option>
                <option value="antiguos">Más antiguos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Navegación rápida a otras áreas */}
        <div className="mt-6 flex flex-wrap gap-2">
          {areas.map((a) => (
            <Link
              key={a.id}
              to={`/areas/${a.id}`}
              className={`rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors ${
                a.id === area.id
                  ? 'border-azulRey-600 bg-azulRey-600 text-papel-suave'
                  : 'border-tinta/15 text-tinta/55 hover:border-azulRey-500 hover:text-azulRey-600'
              }`}
            >
              {a.nombre}
            </Link>
          ))}
        </div>

        {/* Resultados */}
        <div className="mt-10">
          {error && <p className="mb-5 text-sm text-tinta/60">No se pudieron cargar las publicaciones: {error}</p>}
          {!cargando && <p className="mb-5 text-sm text-tinta/50">{filtradas.length} publicaciones encontradas</p>}
          {cargando ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => <TarjetaEsqueleto key={i} />)}
            </div>
          ) : filtradas.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtradas.map((p) => (
                <TarjetaPublicacion key={p.id} publicacion={p} />
              ))}
            </div>
          ) : (
            <div className="rounded-card border border-dashed border-tinta/20 py-16 text-center">
              <p className="text-tinta/50">No encontramos publicaciones con esos filtros.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
