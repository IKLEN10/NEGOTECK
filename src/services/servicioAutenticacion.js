import { solicitarApi } from "./config";

const CLAVE_TOKEN = "token_acceso";
const CLAVE_USUARIO = "usuario_actual";

export function guardarSesion(token, usuario) {
  localStorage.setItem(CLAVE_TOKEN, token);
  localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
}

export function obtenerToken() {
  return localStorage.getItem(CLAVE_TOKEN);
}

export function obtenerUsuario() {
  const usuario = localStorage.getItem(CLAVE_USUARIO);
  return usuario ? JSON.parse(usuario) : null;
}

export function estaAutenticado() {
  return Boolean(obtenerToken());
}

export function limpiarSesion() {
  localStorage.removeItem(CLAVE_TOKEN);
  localStorage.removeItem(CLAVE_USUARIO);
}

export function registrarUsuario({ nombre, apellidos, correo, contrasena }) {
  return solicitarApi("/auth/registro.php", {
    method: "POST",
    body: JSON.stringify({ nombre, apellidos, correo, contrasena }),
  });
}

export function verificarRegistro({ correo, token }) {
  return solicitarApi("/auth/verificar-registro.php", {
    method: "POST",
    body: JSON.stringify({ correo, token }),
  });
}

export function reenviarVerificacion({ correo }) {
  return solicitarApi("/auth/reenviar-verificacion.php", {
    method: "POST",
    body: JSON.stringify({ correo }),
  });
}

export function iniciarSesion({ correo, contrasena, recordar }) {
  return solicitarApi("/auth/login.php", {
    method: "POST",
    body: JSON.stringify({ correo, contrasena, recordar: Boolean(recordar) }),
  });
}

export function obtenerPerfil() {
  return solicitarApi("/auth/perfil.php", {
    headers: { Authorization: `Bearer ${obtenerToken()}` },
  });
}

export function cerrarSesion() {
  return solicitarApi("/auth/logout.php", {
    method: "POST",
    headers: { Authorization: `Bearer ${obtenerToken()}` },
  });
}

export function solicitarRecuperacion({ correo }) {
  return solicitarApi("/auth/recuperar-contrasena.php", {
    method: "POST",
    body: JSON.stringify({ correo }),
  });
}

export function restablecerContrasena({ correo, token, contrasenaNueva }) {
  return solicitarApi("/auth/restablecer-contrasena.php", {
    method: "POST",
    body: JSON.stringify({ correo, token, contrasena_nueva: contrasenaNueva }),
  });
}

// Edicion de perfil
export async function obtenerPerfilCompleto() {
  const { datos } = await solicitarApi("/auth/obtener-perfil.php", {
    headers: { Authorization: `Bearer ${obtenerToken()}` },
  });
  return datos;
}

export async function actualizarPerfilUsuario(formData) {
  return await solicitarApi("/auth/editar-info-perfil.php", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${obtenerToken()}`,
    },
  });
}

export async function actualizarFotoPerfil(formData) {
  return await solicitarApi("/auth/actualiza-foto.php", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${obtenerToken()}`,
    },
  });
}

export async function cambiarContrasena(formData) {
  return await solicitarApi("/auth/actualizar-contrasena.php", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${obtenerToken()}`,
    },
  });
}
