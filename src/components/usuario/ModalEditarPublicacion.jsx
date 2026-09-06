import { useState, useEffect } from "react";
import FormularioPublicacion from "../form/FormularioPublicaciones";
import Modal from "../common/Modal";
import { actualizarPublicacionRapido } from "../../services/servicioPublicaciones";
import { useNotificacion } from "../../hooks/useNotificacion";

export default function ModalEditarPublicacion({
  abierto,
  alCerrar,
  publicacion,
  onGuardar,
}) {
  const [cargando, setCargando] = useState(false);
  const { mostrarNotificacion } = useNotificacion();

  useEffect(() => {
    if (!abierto) {
      setCargando(false);
    }
  }, [abierto]);

  const handleEnviar = async (formData, setErroresFormulario) => {
    setCargando(true);

    try {
      const datosLimitados = new FormData();
      datosLimitados.append("id", publicacion.id);
      datosLimitados.append("titulo", formData.get("titulo"));
      datosLimitados.append("resumen", formData.get("resumen"));

      await actualizarPublicacionRapido(publicacion.id, datosLimitados);

      onGuardar({
        ...publicacion,
        titulo: formData.get("titulo"),
        resumen: formData.get("resumen"),
      });

      alCerrar();
    } catch (error) {
      let errorData;

      try {
        errorData = JSON.parse(error.message);
      } catch {
        errorData = { error: error.message };
      }

      if (errorData.errores && typeof errorData.errores === "object") {
        setErroresFormulario(errorData.errores);
        mostrarNotificacion(
          "Por favor, corrige los errores del formulario",
          "advertencia",
        );
      } else {
        const mensaje =
          errorData.error ||
          error.message ||
          "Error al actualizar la publicación";
        mostrarNotificacion(mensaje, "error");
      }

      setCargando(false);
    }
  };

  return (
    <Modal
      abierto={abierto}
      alCerrar={alCerrar}
      titulo="Editar publicación"
      ancho="max-w-2xl"
      pie={null}
    >
      <div>
        {publicacion && (
          <FormularioPublicacion
            publicacion={publicacion}
            onEnviar={handleEnviar}
            enviando={cargando}
            buttonText="Guardar cambios"
            modoLimitado={true}
          />
        )}
      </div>
    </Modal>
  );
}
