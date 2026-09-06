import { Mail, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { calcularPublicacionesPorAutor } from '../../data/estadisticasAdmin'
import Insignia from '../../components/common/Insignia'

export default function PaginaAdminAutores() {
  const [busqueda, setBusqueda] = useState('')
  const autores = useMemo(() => calcularPublicacionesPorAutor(), [])

  const filtrados = autores.filter((a) => a.nombre.toLowerCase().includes(busqueda.toLowerCase()))

  return (
    <div>
      <div>
        <p className="antetitulo">Panel administrativo</p>
        <h1 className="mt-3 font-display text-2xl font-medium text-tinta sm:text-3xl">Autores registrados</h1>
        <p className="mt-2 text-sm text-tinta/55">Consulta de autores y su actividad editorial. {autores.length} en total.</p>
      </div>

      <div className="mt-6 flex max-w-sm items-center gap-2 rounded-[4px] border border-tinta/15 bg-papel-suave px-3 py-2.5">
        <Search size={16} className="text-tinta/40" />
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre…"
          className="flex-1 bg-transparent text-sm text-tinta placeholder:text-tinta/35 focus:outline-none"
        />
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtrados.map((autor) => (
          <div key={autor.id} className="rounded-card border border-tinta/10 bg-papel-suave p-5 shadow-soft">
            <div className="flex items-center gap-3">
              <img src={autor.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-medium text-tinta">{autor.nombre}</p>
                <p className="truncate text-xs text-tinta/50">{autor.rol}</p>
              </div>
            </div>

            <a href={`mailto:${autor.correo}`} className="mt-3 flex items-center gap-2 text-xs text-tinta/50 hover:text-azulRey-600">
              <Mail size={12} /> {autor.correo}
            </a>

            <div className="mt-4 flex items-center justify-between border-t border-tinta/10 pt-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-tinta/45">
                {autor.total} publicación{autor.total === 1 ? '' : 'es'}
              </span>
              {autor.pendientes > 0 && <Insignia estado="Pendiente">{autor.pendientes} pendiente{autor.pendientes === 1 ? '' : 's'}</Insignia>}
            </div>
          </div>
        ))}
        {filtrados.length === 0 && <p className="col-span-full py-10 text-center text-sm text-tinta/50">Sin resultados.</p>}
      </div>
    </div>
  )
}
