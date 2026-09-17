import {
  ArrowLeft,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  UploadCloud,
  User,
  Users,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useNotificacion } from "../../hooks/useNotificacion";
import {
  cerrarSesion,
  limpiarSesion,
  obtenerUsuario,
  obtenerPerfilCompleto,
} from "../../services/servicioAutenticacion";

const ENLACES_AUTOR = [
  { etiqueta: "Dashboard", to: "/panel", icono: LayoutDashboard, end: true },
  {
    etiqueta: "Mis publicaciones",
    to: "/panel/publicaciones",
    icono: Newspaper,
  },
  { etiqueta: "Subir publicación", to: "/panel/subir", icono: UploadCloud },
  { etiqueta: "Mi perfil", to: "/panel/perfil", icono: User },
];

const ENLACES_ADMIN = [
  { etiqueta: "Publicaciones", to: "/admin/publicaciones", icono: Newspaper },
  { etiqueta: "Autores", to: "/admin/autores", icono: Users },
  { etiqueta: "Áreas", to: "/admin/areas", icono: FolderKanban },
  { etiqueta: "Mi perfil", to: "/admin/perfil", icono: User },
];

export default function BarraLateral() {
  const [abierto, setAbierto] = useState(false);
  const [perfil, setPerfil] = useState(null);
  const navegar = useNavigate();
  const { mostrarNotificacion } = useNotificacion();
  const usuario = obtenerUsuario();
  const esAdministrador = usuario?.rol === "ADMINISTRADOR";
  const enlaces = esAdministrador ? ENLACES_ADMIN : ENLACES_AUTOR;

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const datosPerfil = await obtenerPerfilCompleto();
        setPerfil(datosPerfil);
      } catch (error) {
        console.error("Error al cargar perfil:", error);
        // Usar datos del localStorage como fallback
        setPerfil(usuario);
      }
    };

    cargarPerfil();
  }, []);
  const manejarCierreSesion = async () => {
    try {
      await cerrarSesion();
    } catch {
      // Aunque falle la llamada al servidor, la sesión local se limpia igual.
    } finally {
      limpiarSesion();
      mostrarNotificacion("Sesión cerrada correctamente.", "info");
      navegar("/login");
    }
  };

  const contenido = (
    <>
      <Link
        to="/"
        onClick={() => setAbierto(false)}
        className="flex items-center gap-2 px-1"
        title="Volver a la revista"
      >
        <img
          src="/logo-negoteck.jpg"
          alt="NEGOTECK"
          className="h-[26px] w-[26px] rounded-md object-contain"
        />
        <span className="font-display text-lg font-semibold text-tinta">
          NEGOTECK
        </span>
      </Link>

      <Link
        to="/"
        onClick={() => setAbierto(false)}
        className="mt-3 flex items-center gap-2 rounded-[4px] px-3 py-2 text-xs font-medium text-tinta/55 transition-colors hover:bg-tinta/5 hover:text-azulRey-600"
      >
        <ArrowLeft size={14} /> Volver a la revista
      </Link>

      <div className="mt-3 flex items-center gap-3 rounded-card bg-azulRey-50 p-3">
        {perfil?.foto_perfil ? (
          <img
            src={perfil.foto_perfil}
            alt={perfil?.nombre || "Usuario"}
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-azulRey-100">
            <User size={16} className="text-azulRey-600" />
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-tinta">
            {usuario ? `${usuario.nombre} ${usuario.apellidos}` : "Autora"}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-azulRey-600">
            {esAdministrador
              ? "Administrador general"
              : usuario?.rol || "Autora"}
          </p>
        </div>
      </div>

      <nav className="mt-6 flex flex-1 flex-col gap-1">
        {enlaces.map((enlace) => (
          <NavLink
            key={enlace.to}
            to={enlace.to}
            end={enlace.end}
            onClick={() => setAbierto(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-[4px] px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-azulRey-600 text-papel-suave"
                  : "text-tinta/65 hover:bg-tinta/5 hover:text-tinta"
              }`
            }
          >
            <enlace.icono size={17} />
            {enlace.etiqueta}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={manejarCierreSesion}
        className="mt-auto flex items-center gap-3 rounded-[4px] px-3 py-2.5 text-sm font-medium text-naranja-600 hover:bg-naranja-100/60"
      >
        <LogOut size={17} /> Cerrar sesión
      </button>
    </>
  );

  return (
    <>
      <div className="flex items-center justify-between border-b border-tinta/10 bg-papel-suave px-4 py-3 lg:hidden">
        <Link
          to="/"
          className="font-display text-lg font-semibold text-tinta"
          title="Volver a la revista"
        >
          NEGOTECK
        </Link>
        <button
          onClick={() => setAbierto(true)}
          className="rounded-full p-2 text-tinta/70 hover:bg-tinta/5"
          aria-label="Abrir menú"
        >
          <Menu size={20} />
        </button>
      </div>

      {abierto && (
        <div
          className="fixed inset-0 z-[80] bg-tinta/50 lg:hidden"
          onClick={() => setAbierto(false)}
        >
          <aside
            className="flex h-full w-72 flex-col gap-1 bg-papel-suave p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setAbierto(false)}
              className="ml-auto text-tinta/50"
              aria-label="Cerrar menú"
            >
              <X size={18} />
            </button>
            {contenido}
          </aside>
        </div>
      )}

      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-1 border-r border-tinta/10 bg-papel-suave p-5 lg:flex">
        {contenido}
      </aside>
    </>
  );
}
