import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { useNotificacion } from "../../hooks/useNotificacion";
import FormularioPerfil from "../../components/usuario/FormularioPerfil";
import ModalCambiarContrasena from "../../components/usuario/ModalContrasena";
import { obtenerPerfilCompleto } from "../../services/servicioAutenticacion";

export default function PaginaPerfil() {
  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [abrirCambiarContrasena, setAbrirCambiarContrasena] = useState(false);
  const { mostrarNotificacion } = useNotificacion();

  useEffect(() => {
    const cargar = async () => {
      try {
        const datos = await obtenerPerfilCompleto();
        setPerfil(datos);
      } catch (error) {
        console.error(error);
        mostrarNotificacion("No se pudo cargar el perfil", "error");
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, [mostrarNotificacion]);

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-10">
        <p className="text-tinta/60">Cargando perfil...</p>
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="flex items-center justify-center py-10">
        <p className="text-tinta/60">No se pudo cargar el perfil</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <p className="antetitulo">Panel del autor</p>
      <h1 className="mt-3 font-display text-2xl font-medium text-tinta sm:text-3xl">
        Mi perfil
      </h1>

      <FormularioPerfil perfil={perfil} onActualizar={setPerfil} />

      <div className="mt-8 border-t border-tinta/10 pt-6">
        <button
          type="button"
          onClick={() => setAbrirCambiarContrasena(true)}
          className="btn-secondary flex items-center gap-2"
        >
          <Lock size={16} />
          Cambiar contraseña
        </button>
      </div>

      <ModalCambiarContrasena
        abierto={abrirCambiarContrasena}
        alCerrar={() => setAbrirCambiarContrasena(false)}
      />
    </div>
  );
}
