import { Navigate, Route, Routes } from "react-router-dom";
import DisenoPrincipal from "../layouts/DisenoPrincipal";
import DisenoAutenticacion from "../layouts/DisenoAutenticacion";
import DisenoPanel from "../layouts/DisenoPanel";
import RutaProtegida from "./RutaProtegida";

import PaginaInicio from "../pages/PaginaInicio";
import PaginaQuienesSomos from "../pages/PaginaQuienesSomos";
import PaginaAreasConocimiento from "../pages/PaginaAreasConocimiento";
import PaginaArea from "../pages/PaginaArea";
import PaginaComoPublicar from "../pages/PaginaComoPublicar";
import PaginaContacto from "../pages/PaginaContacto";
import PaginaDetallePublicacion from "../pages/PaginaDetallePublicacion";
import PaginaIniciarSesion from "../pages/PaginaIniciarSesion";
import PaginaRegistro from "../pages/PaginaRegistro";
import PaginaVerificarCorreo from "../pages/PaginaVerificarCorreo";
import PaginaRecuperarContrasena from "../pages/PaginaRecuperarContrasena";
import PaginaNoEncontrada from "../pages/PaginaNoEncontrada";

import InicioPanel from "../pages/dashboard/InicioPanel";
import PaginaMisPublicaciones from "../pages/dashboard/PaginaMisPublicaciones";
import PaginaSubirPublicacion from "../pages/dashboard/PaginaSubirPublicacion";
import PaginaPerfil from "../pages/dashboard/PaginaPerfil";
import PaginaEditarPublicacion from "../pages/dashboard/PaginaEditarPublicacion";
import PaginaPublicacionNoValidada from "../pages/dashboard/DetallesPublicacion";

import PaginaAdminPublicaciones from "../pages/admin/PaginaAdminPublicaciones";
import PaginaAdminAutores from "../pages/admin/PaginaAdminAutores";
import PaginaAdminAreas from "../pages/admin/PaginaAdminAreas";

export default function EnrutadorApp() {
  return (
    <Routes>
      <Route element={<DisenoPrincipal />}>
        <Route path="/" element={<PaginaInicio />} />
        <Route path="/quienes-somos" element={<PaginaQuienesSomos />} />
        <Route path="/areas" element={<PaginaAreasConocimiento />} />
        <Route path="/areas/:idArea" element={<PaginaArea />} />
        <Route path="/como-publicar" element={<PaginaComoPublicar />} />
        <Route path="/contacto" element={<PaginaContacto />} />
        <Route path="/publicacion/:id" element={<PaginaDetallePublicacion />} />
      </Route>

      <Route element={<DisenoAutenticacion />}>
        <Route path="/login" element={<PaginaIniciarSesion />} />
        <Route path="/registro" element={<PaginaRegistro />} />
        <Route path="/verificar" element={<PaginaVerificarCorreo />} />
        <Route path="/recuperar" element={<PaginaRecuperarContrasena />} />
      </Route>

      <Route element={<RutaProtegida />}>
        <Route path="/panel" element={<DisenoPanel />}>
          <Route index element={<InicioPanel />} />
          <Route path="publicaciones" element={<PaginaMisPublicaciones />} />
          <Route path="subir" element={<PaginaSubirPublicacion />} />
          <Route path="perfil" element={<PaginaPerfil />} />
          <Route path="editar/:id" element={<PaginaEditarPublicacion />} />
          <Route
            path="publicacion/:id/:estado"
            element={<PaginaPublicacionNoValidada />}
          />
        </Route>
      </Route>

      <Route element={<RutaProtegida rolRequerido="ADMINISTRADOR" />}>
        <Route path="/admin" element={<DisenoPanel />}>
          {/* El dashboard de estadísticas queda oculto por ahora (fuera de
              alcance de esta etapa); el índice de /admin va directo a la
              gestión de publicaciones, que es la función principal. */}
          <Route index element={<Navigate to="publicaciones" replace />} />
          <Route path="publicaciones" element={<PaginaAdminPublicaciones />} />
          <Route path="autores" element={<PaginaAdminAutores />} />
          <Route path="areas" element={<PaginaAdminAreas />} />
          <Route path="perfil" element={<PaginaPerfil />} />
        </Route>
      </Route>

      <Route path="*" element={<PaginaNoEncontrada />} />
    </Routes>
  );
}
