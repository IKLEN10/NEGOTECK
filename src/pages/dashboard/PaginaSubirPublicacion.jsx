import { useNavigate } from "react-router-dom";
import { useNotificacion } from "../../hooks/useNotificacion";
import { crearPublicacion } from "../../services/servicioPublicaciones";
import FormularioPublicacion from "../../components/form/FormularioPublicaciones";
import { useState } from "react";

export default function PaginaSubirPublicacion() {
  const [enviando, setEnviando] = useState(false);
  const navegar = useNavigate();
  const { mostrarNotificacion } = useNotificacion();

  const handleEnviar = async (formData, setErroresFormulario) => {
    setEnviando(true);

    try {
      await crearPublicacion(formData);

      // Si llegó aquí, fue exitoso
      mostrarNotificacion("¡Publicación enviada correctamente!", "exito");

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
          errorData.error || error.message || "Error al enviar la publicación";
        mostrarNotificacion(mensaje, "error");
      }

      setEnviando(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <p className="antetitulo">Panel del autor</p>
      <h1 className="mt-3 font-display text-2xl font-medium text-tinta sm:text-3xl">
        Subir publicación
      </h1>
      <p className="mt-2 text-sm text-tinta/55">
        Completa la información de tu artículo para enviarlo a revisión.
      </p>

      <FormularioPublicacion onEnviar={handleEnviar} enviando={enviando} />
    </div>
  );
}
