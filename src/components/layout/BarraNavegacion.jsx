import { Eye, LogIn, LogOut, Menu, Search, User, Users, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import CapaBusqueda from '../common/CapaBusqueda'
import { cerrarSesion, estaAutenticado, limpiarSesion, obtenerUsuario } from '../../services/servicioAutenticacion'
import { useNotificacion } from '../../hooks/useNotificacion'
import { useContadoresNavbar } from '../../hooks/useContadoresNavbar'

// Cada opción del menú ahora es una ruta independiente de la aplicación
// (navegación interna con react-router, sin pestañas nuevas ni anclas de
// scroll dentro de una sola página larga). `coincide` decide cuándo la
// opción debe verse como activa: "Inicio" solo en la raíz exacta, y el
// resto tanto en su propia ruta como en sub-rutas relacionadas (por
// ejemplo, "Áreas de conocimiento" también se marca dentro del detalle
// de un área específica, /areas/:idArea).
const ENLACES = [
  { etiqueta: 'Inicio', to: '/', coincide: (ruta) => ruta === '/' },
  { etiqueta: 'Quiénes somos', to: '/quienes-somos', coincide: (ruta) => ruta.startsWith('/quienes-somos') },
  { etiqueta: 'Áreas de conocimiento', to: '/areas', coincide: (ruta) => ruta.startsWith('/areas') },
  { etiqueta: 'Cómo publicar', to: '/como-publicar', coincide: (ruta) => ruta.startsWith('/como-publicar') },
  { etiqueta: 'Contacto', to: '/contacto', coincide: (ruta) => ruta.startsWith('/contacto') },
]

// Contadores en vivo junto al buscador: vistas totales de la revista y
// usuarios activos ahora mismo (ver useContadoresNavbar / Estadistica.php
// en el backend). Mientras no ha llegado el primer dato del backend no
// se muestra nada, para no parpadear con un "0" que no es real.
function ContadoresEnVivo({ vistas, activos, compacto = false }) {
  if (vistas === null && activos === null) return null

  return (
    <div className={`flex items-center border-r border-tinta/10 pr-3 text-tinta/55 ${compacto ? 'gap-2 text-[11px]' : 'gap-3 text-xs'}`}>
      {vistas !== null && (
        <span className="flex items-center gap-1" title="Vistas totales">
          <Eye size={compacto ? 13 : 14} />
          {vistas}
        </span>
      )}
      {activos !== null && (
        <span className="flex items-center gap-1" title="Usuarios activos ahora">
          <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-verde-500 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-verde-500" />
          </span>
          <Users size={compacto ? 13 : 14} />
          {activos}
        </span>
      )}
    </div>
  )
}

export default function BarraNavegacion() {
  const [conDesplazamiento, setConDesplazamiento] = useState(false)
  const [abierto, setAbierto] = useState(false)
  const [busquedaAbierta, setBusquedaAbierta] = useState(false)
  const [menuCuentaAbierto, setMenuCuentaAbierto] = useState(false)
  const navegar = useNavigate()
  const { pathname } = useLocation()
  const { mostrarNotificacion } = useNotificacion()
  const { vistas, activos } = useContadoresNavbar()

  // Se recalcula en cada cambio de ruta (por ejemplo, después de iniciar
  // sesión y volver a la home) para reflejar la sesión guardada en
  // localStorage sin depender de que este componente se vuelva a montar.
  const [usuario, setUsuario] = useState(() => (estaAutenticado() ? obtenerUsuario() : null))

  useEffect(() => {
    setUsuario(estaAutenticado() ? obtenerUsuario() : null)
  }, [pathname])

  // El menú permanece visible al hacer scroll (no desaparece); lo que se
  // desplaza y sale de vista es el banner, que va justo antes en el
  // documento y no es sticky. Este listener solo controla que el menú
  // gane un fondo sólido y sombra cuando queda "pegado" arriba, para que
  // se lea bien sobre el contenido que pasa debajo.
  useEffect(() => {
    const alDesplazar = () => setConDesplazamiento(window.scrollY > 8)
    alDesplazar()
    window.addEventListener('scroll', alDesplazar)
    return () => window.removeEventListener('scroll', alDesplazar)
  }, [])

  const manejarCerrarSesion = async () => {
    setMenuCuentaAbierto(false)
    setAbierto(false)
    try {
      await cerrarSesion()
    } catch {
      // Si el token ya expiró o el servidor no responde, igual limpiamos
      // la sesión localmente para no dejar al usuario atorado.
    } finally {
      limpiarSesion()
      setUsuario(null)
      mostrarNotificacion('Sesión cerrada.', 'info')
      navegar('/')
    }
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full border-b transition-colors duration-300 ${
          conDesplazamiento ? 'border-tinta/10 bg-papel/95 backdrop-blur-sm shadow-soft' : 'border-transparent bg-papel'
        }`}
      >
        <nav className="contenedor-pagina flex h-16 items-center justify-between">
          <div className="hidden items-center gap-7 lg:flex">
            {ENLACES.map((enlace) => {
              const estaActivo = enlace.coincide(pathname)
              return (
                <Link
                  key={enlace.etiqueta}
                  to={enlace.to}
                  aria-current={estaActivo ? 'page' : undefined}
                  className={`text-sm font-medium transition-colors hover:text-azulRey-600 ${
                    estaActivo ? 'text-azulRey-600' : 'text-tinta/70'
                  }`}
                >
                  {enlace.etiqueta}
                </Link>
              )
            })}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <ContadoresEnVivo vistas={vistas} activos={activos} />

            <button
              onClick={() => setBusquedaAbierta(true)}
              className="rounded-full p-2 text-tinta/60 hover:bg-tinta/5 hover:text-tinta"
              aria-label="Buscar"
            >
              <Search size={18} />
            </button>

            {usuario ? (
              <div className="relative">
                <button
                  onClick={() => setMenuCuentaAbierto((v) => !v)}
                  className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-sm font-medium text-tinta/80 hover:bg-tinta/5"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-azulRey-50 text-azulRey-600">
                    <User size={15} />
                  </span>
                  {usuario.nombre}
                </button>
                {menuCuentaAbierto && (
                  <div className="absolute right-0 mt-2 w-52 rounded-card border border-tinta/10 bg-papel py-1.5 shadow-card">
                    <Link
                      to="/panel"
                      onClick={() => setMenuCuentaAbierto(false)}
                      className="block px-4 py-2 text-sm text-tinta/75 hover:bg-tinta/5"
                    >
                      Mi panel
                    </Link>
                    <button
                      onClick={manejarCerrarSesion}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-tinta/75 hover:bg-tinta/5"
                    >
                      <LogOut size={14} /> Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => navegar('/login')} className="btn-primary">
                <LogIn size={15} /> Iniciar sesión
              </button>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2 lg:hidden">
            <ContadoresEnVivo vistas={vistas} activos={activos} compacto />

            <button
              onClick={() => setBusquedaAbierta(true)}
              className="rounded-full p-2 text-tinta/60 hover:bg-tinta/5"
              aria-label="Buscar"
            >
              <Search size={18} />
            </button>
            <button onClick={() => setAbierto((v) => !v)} className="rounded-full p-2 text-tinta/70 hover:bg-tinta/5" aria-label="Abrir menú">
              {abierto ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {abierto && (
          <div className="border-t border-tinta/10 bg-papel-suave lg:hidden">
            <div className="contenedor-pagina flex flex-col gap-1 py-3">
              {ENLACES.map((enlace) => {
                const estaActivo = enlace.coincide(pathname)
                return (
                  <Link
                    key={enlace.etiqueta}
                    to={enlace.to}
                    onClick={() => setAbierto(false)}
                    aria-current={estaActivo ? 'page' : undefined}
                    className={`rounded-[4px] px-2 py-2.5 text-sm font-medium hover:bg-tinta/5 ${
                      estaActivo ? 'bg-azulRey-50 text-azulRey-600' : 'text-tinta/75'
                    }`}
                  >
                    {enlace.etiqueta}
                  </Link>
                )
              })}

              {usuario ? (
                <>
                  <div className="mt-2 flex items-center gap-2 rounded-[4px] px-2 py-2 text-sm font-medium text-tinta/80">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-azulRey-50 text-azulRey-600">
                      <User size={15} />
                    </span>
                    {usuario.nombre}
                  </div>
                  <Link
                    to="/panel"
                    onClick={() => setAbierto(false)}
                    className="rounded-[4px] px-2 py-2.5 text-sm font-medium text-tinta/75 hover:bg-tinta/5"
                  >
                    Mi panel
                  </Link>
                  <button
                    onClick={manejarCerrarSesion}
                    className="btn-secondary mt-1 w-full"
                  >
                    <LogOut size={15} /> Cerrar sesión
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setAbierto(false)
                    navegar('/login')
                  }}
                  className="btn-primary mt-2 w-full"
                >
                  <LogIn size={15} /> Iniciar sesión
                </button>
              )}
            </div>
          </div>
        )}
      </header>
      <CapaBusqueda abierta={busquedaAbierta} alCerrar={() => setBusquedaAbierta(false)} />
    </>
  )
}
