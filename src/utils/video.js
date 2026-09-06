// Convierte una URL de YouTube (watch?v=, youtu.be/, con o sin parámetros
// extra) en su URL embebible para usar en un <iframe>. Devuelve null si la
// URL no corresponde a un video de YouTube reconocible, para que quien la
// use pueda mostrar un estado alternativo en vez de un iframe roto.
// Si la URL original trae un timestamp (?t=123 o &t=123), se traslada como
// ?start=123 en la URL embebida para que el video arranque en ese punto.
export function obtenerUrlEmbedYoutube(urlVideo) {
  if (!urlVideo) return null;

  const patronWatch = /youtube\.com\/watch\?v=([\w-]{11})/i;
  const patronCorta = /youtu\.be\/([\w-]{11})/i;

  const coincidencia =
    urlVideo.match(patronWatch) || urlVideo.match(patronCorta);

  if (!coincidencia) return null;

  const coincidenciaTiempo = urlVideo.match(/[?&]t=(\d+)/);
  const parametroInicio = coincidenciaTiempo ? `?start=${coincidenciaTiempo[1]}` : '';

  return `https://www.youtube.com/embed/${coincidencia[1]}${parametroInicio}`;
}
