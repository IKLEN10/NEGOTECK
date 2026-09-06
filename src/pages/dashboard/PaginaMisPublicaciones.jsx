import { Eye, Pencil, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Insignia from "../../components/common/Insignia";
import Modal from "../../components/common/Modal";
import ModalEditarPublicacion from "../../components/usuario/ModalEditarPublicacion";
import { useNotificacion } from "../../hooks/useNotificacion";
import {
  obtenerPublicacionesUsuario,
  eliminarPublicacion,
} from "../../services/servicioPublicaciones";

const formateadorFecha = new Intl.DateTimeFormat("es-MX", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const obtenerAccionesPermitidas = (estado) => {
  const acciones = {
    ver: true,
    editar: false,
    eliminar: false,
  };

  switch (estado) {
    case "APROBADO":
      return acciones;
    case "PENDIENTE":
      return { ...acciones, editar: true };
    case "RECHAZADO":
      return { ...acciones, editar: true, eliminar: true };
    default:
      return acciones;
  }
};

export default function PaginaMisPublicaciones() {
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("todos");
  const [aEliminar, setAEliminar] = useState(null);
  const [aEditar, setAEditar] = useState(null);
  const navegar = useNavigate();
  const { mostrarNotificacion } = useNotificacion();
  const [misPublicaciones, setMisPublicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarPublicaciones = async () => {
      try {
        const datos = await obtenerPublicacionesUsuario();
        setMisPublicaciones(datos);
      } catch (error) {
        mostrarNotificacion(
          "No se pudieron cargar las publicaciones",
          "advertencia",
        );
      } finally {
        setCargando(false);
      }
    };

    cargarPublicaciones();
  }, [mostrarNotificacion]);

  const filtradas = misPublicaciones.filter((p) => {
    const coincideBusqueda = p.titulo
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const coincideEstado = estado === "todos" || p.estado === estado;
    return coincideBusqueda && coincideEstado;
  });

  const handleEditar = (publicacion) => {
    if (publicacion.estado === "RECHAZADO") {
      navegar(`/panel/editar/${publicacion.id}`);
    } else if (publicacion.estado === "PENDIENTE") {
      setAEditar(publicacion);
    }
  };

  const handleVer = (publicacion) => {
    if (publicacion.estado === "APROBADO") {
      navegar(`/publicacion/${publicacion.id}`);
    } else {
      navegar(`/panel/publicacion/${publicacion.id}/${publicacion.estado}`);
    }
  };

  const confirmarEliminacion = async () => {
    try {
      await eliminarPublicacion(aEliminar.id);

      setMisPublicaciones((anteriores) =>
        anteriores.filter((p) => p.id !== aEliminar.id),
      );

      mostrarNotificacion("Publicación eliminada correctamente", "exito");
    } catch (error) {
      const mensaje = error.message || "Error al eliminar publicación";
      mostrarNotificacion(mensaje, "error");
    }

    setAEliminar(null);
  };

  const handleGuardarEdicion = (publicacionActualizada) => {
    setMisPublicaciones((anteriores) =>
      anteriores.map((p) =>
        p.id === publicacionActualizada.id ? publicacionActualizada : p,
      ),
    );

    mostrarNotificacion("Publicación actualizada correctamente", "exito");
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="antetitulo">Panel del autor</p>
          <h1 className="mt-3 font-display text-2xl font-medium text-tinta sm:text-3xl">
            Mis publicaciones
          </h1>
        </div>
        <button onClick={() => navegar("/panel/subir")} className="btn-primary">
          Nueva publicación
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-[4px] border border-tinta/15 bg-papel-suave px-3 py-2.5">
          <Search size={16} className="text-tinta/40" />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por título…"
            className="flex-1 bg-transparent text-sm text-tinta placeholder:text-tinta/35 focus:outline-none"
          />
        </div>
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          className="rounded-[4px] border border-tinta/15 bg-papel-suave px-3 py-2.5 text-sm text-tinta focus:outline-none"
        >
          <option value="todos">Todos los estados</option>
          <option value="APROBADO">Aprobado</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="RECHAZADO">Rechazado</option>
        </select>
      </div>

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
            {filtradas.map((p) => {
              const acciones = obtenerAccionesPermitidas(p.estado);
              return (
                <tr
                  key={p.id}
                  className="transition-colors hover:bg-tinta/[0.03]"
                >
                  <td className="max-w-xs px-5 py-3.5 font-medium text-tinta">
                    {p.titulo}
                  </td>
                  <td className="px-5 py-3.5 text-tinta/60">
                    {p.area?.nombre}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-tinta/50">
                    {formateadorFecha.format(new Date(p.fecha))}
                  </td>
                  <td className="px-5 py-3.5">
                    <Insignia estado={p.estado}>{p.estado}</Insignia>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-1.5">
                      {acciones.ver && (
                        <button
                          onClick={() => handleVer(p)}
                          className="rounded-full p-2 text-tinta/45 hover:bg-tinta/5 hover:text-azulRey-600"
                          aria-label="Ver"
                          title="Ver publicación"
                        >
                          <Eye size={15} />
                        </button>
                      )}
                      {acciones.editar && (
                        <button
                          onClick={() => handleEditar(p)}
                          className="rounded-full p-2 text-tinta/45 hover:bg-tinta/5 hover:text-azulRey-600"
                          aria-label="Editar"
                          title="Editar publicación"
                        >
                          <Pencil size={15} />
                        </button>
                      )}
                      {acciones.eliminar && (
                        <button
                          onClick={() => setAEliminar(p)}
                          className="rounded-full p-2 text-tinta/45 hover:bg-naranja-100 hover:text-naranja-600"
                          aria-label="Eliminar"
                          title="Eliminar publicación"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtradas.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-tinta/50">
            Sin resultados.
          </p>
        )}
      </div>

      {/* Tarjetas para móvil */}
      <div className="mt-6 flex flex-col gap-4 md:hidden">
        {filtradas.map((p) => {
          const area = p.area;
          const acciones = obtenerAccionesPermitidas(p.estado);
          return (
            <div
              key={p.id}
              className="rounded-card border border-tinta/10 bg-papel-suave p-4 shadow-soft"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium text-tinta">{p.titulo}</p>
                <Insignia estado={p.estado}>{p.estado}</Insignia>
              </div>
              <p className="mt-1 font-mono text-xs text-tinta/45">
                {area?.nombre} · {formateadorFecha.format(new Date(p.fecha))}
              </p>
              <div className="mt-3 flex gap-2 border-t border-tinta/10 pt-3">
                {acciones.ver && (
                  <button
                    onClick={() => handleVer(p)}
                    className="btn-ghost flex-1 !px-3 !py-2 text-xs"
                  >
                    Ver
                  </button>
                )}
                {acciones.editar && (
                  <button
                    onClick={() => handleEditar(p)}
                    className="btn-ghost flex-1 !px-3 !py-2 text-xs"
                  >
                    Editar
                  </button>
                )}
                {acciones.eliminar && (
                  <button
                    onClick={() => setAEliminar(p)}
                    className="btn-ghost flex-1 !px-3 !py-2 text-xs text-naranja-600"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de edición (solo para PENDIENTE) */}
      <ModalEditarPublicacion
        abierto={!!aEditar}
        alCerrar={() => setAEditar(null)}
        publicacion={aEditar}
        onGuardar={handleGuardarEdicion}
        cargando={cargando}
      />

      {/* Modal de eliminación */}
      <Modal
        abierto={!!aEliminar}
        alCerrar={() => setAEliminar(null)}
        titulo="Eliminar publicación"
        pie={
          <>
            <button
              onClick={() => setAEliminar(null)}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button onClick={confirmarEliminacion} className="btn-naranja">
              Eliminar
            </button>
          </>
        }
      >
        ¿Confirmas que deseas eliminar &ldquo;{aEliminar?.titulo}&rdquo;?
      </Modal>
    </div>
  );
}
