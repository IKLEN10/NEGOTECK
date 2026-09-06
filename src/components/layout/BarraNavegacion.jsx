import { LogIn, LogOut, Menu, Search, User, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import CapaBusqueda from '../common/CapaBusqueda'
import { cerrarSesion, estaAutenticado, limpiarSesion, obtenerUsuario } from '../../services/servicioAutenticacion'
import { useNotificacion } from '../../hooks/useNotificacion'

const ENLACES = [
  { etiqueta: 'Inicio', to: '/' },
  { etiqueta: 'Revista', to: '/#quienes-somos' },
  { etiqueta: 'Áreas', to: '/#areas' },
  { etiqueta: 'Publicaciones', to: '/#publicaciones' },
  { etiqueta: '¿Cómo publicar?', to: '/#como-publicar' },
  { etiqueta: 'Contacto', to: '/#contacto' },
]

export default function BarraNavegacion() {
  const [conDesplazamiento, setConDesplazamiento] = useState(false)
  const [abierto, setAbierto] = useState(false)
  const [busquedaAbierta, setBusquedaAbierta] = useState(false)
  const [menuCuentaAbierto, setMenuCuentaAbierto] = useState(false)
  const navegar = useNavigate()
  const { pathname } = useLocation()
  const { mostrarNotificacion } = useNotificacion()

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
            {ENLACES.map((enlace) => (
              <a
                key={enlace.etiqueta}
                href={enlace.to}
                className="text-sm font-medium text-tinta/70 transition-colors hover:text-azulRey-600"
              >
                {enlace.etiqueta}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
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
              {ENLACES.map((enlace) => (
                <a
                  key={enlace.etiqueta}
                  href={enlace.to}
                  onClick={() => setAbierto(false)}
                  className="rounded-[4px] px-2 py-2.5 text-sm font-medium text-tinta/75 hover:bg-tinta/5"
                >
                  {enlace.etiqueta}
                </a>
              ))}

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
