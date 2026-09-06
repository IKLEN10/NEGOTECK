// URL base del backend en PHP (apunta a la subcarpeta `api/`, donde viven
// los endpoints). Ajusta VITE_API_URL en un archivo .env si tu instalación
// de XAMPP/Apache usa otra ruta, por ejemplo:
// VITE_API_URL=http://localhost/revista-api/api
export const URL_BASE_API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8080/revista-digital-com-integrado/backend-php/api";

export async function solicitarApi(ruta, opciones = {}) {
  const { headers, ...resto } = opciones;

  const headersFinales =
    resto.body instanceof FormData
      ? headers
      : { "Content-Type": "application/json", ...headers };

  const respuesta = await fetch(`${URL_BASE_API}${ruta}`, {
    ...resto,
    headers: headersFinales,
  });

  const texto = await respuesta.text();

  let cuerpo = null;

  try {
    cuerpo = JSON.parse(texto);
  } catch {
    // La respuesta no era JSON válido (p. ej. error HTML del servidor);
    // `cuerpo` se queda en null y el bloque de abajo lanza un error legible.
  }

  // Si esta era una petición autenticada (llevaba Authorization) y el
  // servidor respondió 401, el token guardado ya no es válido (expiró o
  // fue revocado). En vez de dejar que cada pantalla falle en silencio o
  // muestre un error confuso, se avisa una sola vez a nivel global para
  // que la app limpie la sesión y mande al usuario a /login con un
  // mensaje claro. Un 401 de /auth/login.php (contraseña incorrecta) NO
  // dispara esto: esa petición nunca lleva Authorization, porque ahí el
  // usuario todavía no tiene sesión.
  if (respuesta.status === 401 && Boolean(headersFinales?.Authorization)) {
    window.dispatchEvent(new CustomEvent("sesion-expirada"));
  }

  if (!cuerpo || cuerpo.exito === false) {
    throw new Error(cuerpo?.error || cuerpo?.message || texto);
  }

  if (!respuesta.ok) {
    throw new Error(texto);
  }

  return cuerpo;
}
