import { Lock } from "lucide-react";
import { useState } from "react";
import Modal from "../common/Modal";
import ValidadorContrasena from "../common/ValidadorContrasena";
import { cambiarContrasena } from "../../services/servicioAutenticacion";
import { useNotificacion } from "../../hooks/useNotificacion";

export default function ModalCambiarContrasena({ abierto, alCerrar }) {
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState({});
  const [formData, setFormData] = useState({
    contrasena_actual: "",
    contrasena_nueva: "",
    confirmacion: "",
  });
  const { mostrarNotificacion } = useNotificacion();

  const handleChange = (e) => {
    const { name, value } = e.target;

    let erroresTemp = { ...errores };

    // ✅ Validar confirmación cuando cambia nueva contraseña
    if (name === "contrasena_nueva") {
      if (formData.confirmacion) {
        if (value !== formData.confirmacion) {
          erroresTemp.confirmacion = "Las contraseñas no coinciden.";
        } else {
          delete erroresTemp.confirmacion;
        }
      }
    }

    // ✅ Validar confirmación cuando se escribe en confirmar
    if (name === "confirmacion") {
      if (value !== formData.contrasena_nueva && value.length > 0) {
        erroresTemp.confirmacion = "Las contraseñas no coinciden.";
      } else {
        delete erroresTemp.confirmacion;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrores(erroresTemp);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setErrores({});

    try {
      const datos = new FormData();
      datos.append("contrasena_actual", formData.contrasena_actual);
      datos.append("contrasena_nueva", formData.contrasena_nueva);
      datos.append("confirmacion", formData.confirmacion);

      await cambiarContrasena(datos);

      mostrarNotificacion("Contraseña actualizada correctamente.", "exito");
      setFormData({
        contrasena_actual: "",
        contrasena_nueva: "",
        confirmacion: "",
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
        setErrores(errorData.errores);
        mostrarNotificacion(
          "Por favor, corrige los errores del formulario",
          "advertencia",
        );
      } else {
        mostrarNotificacion(
          errorData.error || "Error al cambiar contraseña",
          "error",
        );
      }
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal
      abierto={abierto}
      alCerrar={() => {
        alCerrar();
        setFormData({
          contrasena_actual: "",
          contrasena_nueva: "",
          confirmacion: "",
        });
        setErrores({});
      }}
      titulo="Cambiar contraseña"
      ancho="max-w-md"
      pie={
        <>
          <button
            onClick={() => {
              alCerrar();
              setFormData({
                contrasena_actual: "",
                contrasena_nueva: "",
                confirmacion: "",
              });
              setErrores({});
            }}
            disabled={guardando}
            className="btn-secondary"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            disabled={guardando}
            className="btn-primary flex items-center gap-2"
          >
            <Lock size={16} />
            {guardando ? "Guardando…" : "Cambiar contraseña"}
          </button>
        </>
      }
    >
      <form className="space-y-4">
        <div>
          <label className="etiqueta-campo">Contraseña actual</label>
          <input
            type="password"
            name="contrasena_actual"
            value={formData.contrasena_actual}
            onChange={handleChange}
            disabled={guardando}
            className={`campo-entrada ${
              errores.contrasena_actual ? "border-red-500 bg-red-50" : ""
            }`}
            placeholder="Tu contraseña actual"
          />
          {errores.contrasena_actual && (
            <p className="mt-1 text-xs text-red-600">
              {errores.contrasena_actual}
            </p>
          )}
        </div>

        <div>
          <label className="etiqueta-campo">Contraseña nueva</label>
          <input
            type="password"
            name="contrasena_nueva"
            value={formData.contrasena_nueva}
            onChange={handleChange}
            disabled={guardando}
            className={`campo-entrada ${
              errores.contrasena_nueva ? "border-red-500 bg-red-50" : ""
            }`}
            placeholder="Mínimo 8 caracteres"
            minLength="8"
            maxLength="72"
          />
          <ValidadorContrasena valor={formData.contrasena_nueva} />
          {errores.contrasena_nueva && (
            <p className="mt-1 text-xs text-red-600">
              {errores.contrasena_nueva}
            </p>
          )}
        </div>

        <div>
          <label className="etiqueta-campo">Confirmar contraseña</label>
          <input
            type="password"
            name="confirmacion"
            value={formData.confirmacion}
            onChange={handleChange}
            disabled={guardando}
            className={`campo-entrada ${
              errores.confirmacion ? "border-red-500 bg-red-50" : ""
            }`}
            placeholder="Repite la contraseña nueva"
            minLength="8"
            maxLength="72"
          />
          {errores.confirmacion && (
            <p className="mt-1 text-xs text-red-600">{errores.confirmacion}</p>
          )}
        </div>
      </form>
    </Modal>
  );
}
