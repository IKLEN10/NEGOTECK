import { useNavigate, useParams } from "react-router-dom";
import { useNotificacion } from "../../hooks/useNotificacion";
import {
  obtenerPublicacionEditar,
  actualizarPublicacion,
} from "../../services/servicioPublicaciones";
import FormularioPublicacion from "../../components/form/FormularioPublicaciones";
import { useState, useEffect } from "react";

export default function PaginaEditarPublicacion() {
  const { id } = useParams();
  const [enviando, setEnviando] = useState(false);
  const [publicacion, setPublicacion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const navegar = useNavigate();
  const { mostrarNotificacion } = useNotificacion();

  useEffect(() => {
    const cargar = async () => {
      try {
        const datos = await obtenerPublicacionEditar(id);
        setPublicacion(datos);
      } catch (error) {
        console.error("Error al cargar:", error);
        mostrarNotificacion("No se pudo cargar la publicación", "error");
        navegar("/panel/publicaciones");
      } finally {
        setCargando(false);
      }
    };

    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleEnviar = async (formData, setErroresFormulario) => {
    setEnviando(true);

    try {
      await actualizarPublicacion(id, formData);

      mostrarNotificacion("¡Publicación actualizada correctamente!", "exito");

      setTimeout(() => {
        navegar("/panel/publicaciones");
      }, 2000);
    } catch (error) {
      // Intentar parsear si es una respuesta con errores múltiples
      let errorData;

      try {
        errorData = JSON.parse(error.message);
      } catch {
        errorData = { error: error.message };
      }

      // Si hay errores de formulario (array de errores por campo)
      if (errorData.errores && typeof errorData.errores === "object") {
        setErroresFormulario(errorData.errores);
        mostrarNotificacion(
          "Por favor, corrige los errores del formulario",
          "advertencia",
        );
      } else {
        // Error general
        const mensaje =
          errorData.error ||
          error.message ||
          "Error al actualizar la publicación";
        mostrarNotificacion(mensaje, "error");
      }

      setEnviando(false);
    }
  };

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-10">
        <p className="text-tinta/60">Cargando publicación...</p>
      </div>
    );
  }

  if (!publicacion) {
    return (
      <div className="flex items-center justify-center py-10">
        <p className="text-tinta/60">No se pudo cargar la publicación</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <p className="antetitulo">Panel del autor</p>
      <h1 className="mt-3 font-display text-2xl font-medium text-tinta sm:text-3xl">
        Editar publicación
      </h1>
      <p className="mt-2 text-sm text-tinta/55">
        Actualiza la información de tu artículo.
      </p>

      <FormularioPublicacion
        publicacion={publicacion}
        onEnviar={handleEnviar}
        enviando={enviando}
        buttonText="Guardar cambios"
        mostrarMotivo={publicacion?.estado === "RECHAZADO"}
      />
    </div>
  );
}
