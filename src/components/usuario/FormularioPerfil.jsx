import { Camera, Save } from "lucide-react";
import { useRef, useState } from "react";
import { useNotificacion } from "../../hooks/useNotificacion";
import {
  actualizarPerfilUsuario,
  actualizarFotoPerfil,
} from "../../services/servicioAutenticacion";

export default function FormularioPerfil({ perfil, onActualizar }) {
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState({});
  const inputFotoRef = useRef(null);
  const [fotoSeleccionada, setFotoSeleccionada] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(null);
  const [formData, setFormData] = useState({
    nombre: perfil.nombre,
    apellidos: perfil.apellidos,
    correo: perfil.correo,
    institucion: perfil.institucion || "",
    biografia: perfil.biografia || "",
  });
  const { mostrarNotificacion } = useNotificacion();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrores({ ...errores, [name]: "" });
  };

  const handleSeleccionarFoto = (e) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    setFotoSeleccionada(archivo);
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewFoto(event.target?.result);
    };
    reader.readAsDataURL(archivo);

    if (inputFotoRef.current) {
      inputFotoRef.current.value = "";
    }
  };

  const manejarGuardado = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setErrores({});

    try {
      if (fotoSeleccionada) {
        const datosArchivo = new FormData();
        datosArchivo.append("foto", fotoSeleccionada);
        const resultadoFoto = await actualizarFotoPerfil(datosArchivo);
        onActualizar({
          ...perfil,
          foto_perfil: resultadoFoto.datos.foto_perfil,
        });
        setFotoSeleccionada(null);
        setPreviewFoto(null);
      }

      const datos = new FormData();
      datos.append("nombre", formData.nombre);
      datos.append("apellidos", formData.apellidos);
      datos.append("institucion", formData.institucion);
      datos.append("biografia", formData.biografia);

      await actualizarPerfilUsuario(datos);

      onActualizar({ ...perfil, ...formData });
      setEditando(false);
      mostrarNotificacion("Perfil actualizado correctamente.", "exito");
    } catch (error) {
      let errorData;
      try {
        errorData = JSON.parse(error.message);
      } catch {
        errorData = { error: error.message };
      }

      if (errorData.errores && typeof errorData.errores === "object") {
        setErrores(errorData.errores);
        mostrarNotificacion(
          "Por favor, corrige los errores del formulario",
          "advertencia",
        );
      } else {
        mostrarNotificacion(
          errorData.error || "Error al actualizar el perfil",
          "error",
        );
      }
    } finally {
      setGuardando(false);
    }
  };

  const renderAvatar = () => {
    if (previewFoto || perfil.foto_perfil) {
      return (
        <img
          src={previewFoto || perfil.foto_perfil}
          alt="Avatar"
          className="h-20 w-20 rounded-full object-cover"
        />
      );
    }

    const iniciales =
      `${perfil?.nombre?.[0] || "A"}${perfil?.apellidos?.[0] || "U"}`.toUpperCase();

    return (
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-azulRey-500 to-azulRey-700 text-3xl font-bold text-white shadow-md">
        {iniciales}
      </div>
    );
  };

  return (
    <div className="mt-8 rounded-card border border-tinta/10 bg-papel-suave p-6 shadow-soft sm:p-8">
      <div className="flex items-center gap-5">
        <div className="relative">
          {renderAvatar()} {/* ← Aquí va el avatar con iniciales */}
          {editando && (
            <>
              <button
                type="button"
                onClick={() => inputFotoRef.current?.click()}
                disabled={guardando}
                className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-azulRey-600 text-papel-suave shadow-soft hover:bg-azulRey-700 disabled:opacity-50"
                aria-label="Cambiar foto"
              >
                <Camera size={14} />
              </button>
              <input
                ref={inputFotoRef}
                type="file"
                accept="image/*"
                onChange={handleSeleccionarFoto}
                disabled={guardando}
                className="hidden"
              />
            </>
          )}
        </div>
        <div>
          <h2 className="font-display text-lg font-medium text-tinta">
            {perfil.nombre} {perfil.apellidos}
          </h2>
          <p className="text-sm text-tinta/55">{perfil.correo}</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-azulRey-600">
            Autora verificada
          </p>
        </div>
      </div>

      <form
        onSubmit={manejarGuardado}
        className="mt-8 grid gap-5 border-t border-tinta/10 pt-6 sm:grid-cols-2"
      >
        <div>
          <label className="etiqueta-campo">Nombre</label>
          <input
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            disabled={!editando}
            className={`campo-entrada disabled:bg-papel disabled:text-tinta/50 ${
              errores.nombre ? "border-red-500 bg-red-50" : ""
            }`}
          />
          {errores.nombre && (
            <p className="mt-1 text-xs text-red-600">{errores.nombre}</p>
          )}
        </div>

        <div>
          <label className="etiqueta-campo">Apellidos</label>
          <input
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            disabled={!editando}
            className={`campo-entrada disabled:bg-papel disabled:text-tinta/50 ${
              errores.apellidos ? "border-red-500 bg-red-50" : ""
            }`}
          />
          {errores.apellidos && (
            <p className="mt-1 text-xs text-red-600">{errores.apellidos}</p>
          )}
        </div>

        <div>
          <label className="etiqueta-campo">Correo</label>
          <input
            disabled
            value={formData.correo}
            className="campo-entrada disabled:bg-papel disabled:text-tinta/50"
          />
        </div>

        <div>
          <label className="etiqueta-campo">Institución</label>
          <input
            name="institucion"
            value={formData.institucion}
            onChange={handleChange}
            disabled={!editando}
            className={`campo-entrada disabled:bg-papel disabled:text-tinta/50 ${
              errores.institucion ? "border-red-500 bg-red-50" : ""
            }`}
          />
          {errores.institucion && (
            <p className="mt-1 text-xs text-red-600">{errores.institucion}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="etiqueta-campo">Biografía</label>
          <textarea
            name="biografia"
            value={formData.biografia}
            onChange={handleChange}
            disabled={!editando}
            rows={3}
            className={`campo-entrada resize-none disabled:bg-papel disabled:text-tinta/50 ${
              errores.biografia ? "border-red-500 bg-red-50" : ""
            }`}
          />
          {errores.biografia && (
            <p className="mt-1 text-xs text-red-600">{errores.biografia}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          {editando ? (
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={guardando}
                className="btn-primary"
              >
                {guardando ? (
                  "Guardando…"
                ) : (
                  <>
                    <Save size={15} /> Guardar cambios
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditando(false);
                  setErrores({});
                  setFotoSeleccionada(null);
                  setPreviewFoto(null);
                }}
                className="btn-secondary"
                disabled={guardando}
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setEditando(true)}
              className="btn-primary"
            >
              Editar perfil
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
