import { ArrowUpRight, Eye, PlayCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { obtenerAreaPorId } from '../../data/areas'
import { obtenerAutorPorId } from '../../data/autores'
import { obtenerUrlEmbedYoutube } from '../../utils/video'
import Insignia from './Insignia'

const formateadorFecha = new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })

// Compatibilidad con dos formatos de `publicacion`:
// 1) Viene de la API (home): ya trae `area` y `autor` embebidos (JOIN en PHP).
// 2) Viene de src/data/publicaciones.js (páginas aún no migradas, fuera de
//    este alcance): solo trae `idArea`/`idAutor` y hay que resolverlos
//    contra los catálogos estáticos, igual que hacía el componente original.
export default function TarjetaPublicacion({ publicacion, variante = 'default' }) {
  const navegar = useNavigate()
  const area = publicacion.area ?? obtenerAreaPorId(publicacion.idArea)
  const autor = publicacion.autor ?? obtenerAutorPorId(publicacion.idAutor)
  const compacta = variante === 'compact'
  const esVideo = publicacion.tipoContenido === 'video'
  const urlEmbed = esVideo ? obtenerUrlEmbedYoutube(publicacion.urlVideo) : null

  return (
    <article className={`tarjeta-cita group flex h-full flex-col overflow-hidden ${compacta ? 'min-w-[280px] max-w-[280px]' : ''}`}>
      <div className="relative overflow-hidden">
        {esVideo ? (
          urlEmbed ? (
            <iframe
              src={urlEmbed}
              title={publicacion.titulo}
              loading="lazy"
              allowFullScreen
              className={`w-full border-0 ${compacta ? 'h-36' : 'h-44'}`}
            />
          ) : (
            <div className={`flex w-full items-center justify-center bg-tinta/5 text-tinta/30 ${compacta ? 'h-36' : 'h-44'}`}>
              <PlayCircle size={32} />
            </div>
          )
        ) : (
          <img
            src={publicacion.imagen || '/logo-negoteck.jpg'}
            alt={`Portada de ${publicacion.titulo}`}
            loading="lazy"
            onError={(evento) => {
              evento.currentTarget.onerror = null
              evento.currentTarget.src = '/logo-negoteck.jpg'
            }}
            className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${compacta ? 'h-36' : 'h-44'}`}
          />
        )}
        {publicacion.destacado && (
          <span className="absolute right-0 top-3 bg-verde-500 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-tinta shadow-soft">
            Destacado
          </span>
        )}
        {typeof publicacion.visitas === 'number' && (
          <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-tinta/60 px-2 py-1 font-mono text-[10px] text-papel-suave backdrop-blur-sm">
            <Eye size={11} /> {publicacion.visitas}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-2">
          {area && <Insignia tono={area.color}>{area.nombre}</Insignia>}
          <span className="font-mono text-[11px] text-tinta/45">{formateadorFecha.format(new Date(publicacion.fecha))}</span>
        </div>
        <h3 className={`font-display font-medium leading-snug text-tinta ${compacta ? 'text-base' : 'text-lg'}`}>
          {publicacion.titulo}
        </h3>
        {!compacta && <p className="line-clamp-2 text-sm text-tinta/65">{publicacion.resumen}</p>}
        <div className="mt-auto flex items-center justify-between border-t border-tinta/10 pt-3">
          <span className="font-mono text-xs text-tinta/55">Por {autor?.nombre || 'Autor invitado'}</span>
          <button
            onClick={() => navegar(`/publicacion/${publicacion.id}`)}
            className="inline-flex items-center gap-1 text-sm font-semibold text-azulRey-600 transition-colors hover:text-azulRey-700"
          >
            Leer <ArrowUpRight size={15} />
          </button>
        </div>
      </div>
    </article>
  )
}
