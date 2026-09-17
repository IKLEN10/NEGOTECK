// Encabezado compartido por las páginas independientes que antes eran
// secciones del inicio (Quiénes somos, Áreas de conocimiento, Cómo
// publicar, Contacto). Reutiliza el mismo patrón visual que ya existía
// para el detalle de un área (fondo azul rey con degradado), así todas
// las páginas "institucionales" se sienten parte de la misma familia
// visual en vez de una mezcla de estilos nuevos.
export default function EncabezadoPagina({ etiqueta, titulo, descripcion }) {
  return (
    <header className="relative overflow-hidden bg-azulRey-700">
      <div className="absolute inset-0 bg-gradient-to-br from-azulRey-800 via-azulRey-700 to-azulRey-600" />
      <div className="contenedor-pagina relative py-14 sm:py-20">
        <p className="antetitulo text-papel-suave/70 before:bg-papel-suave/60">{etiqueta}</p>
        <h1 className="mt-3 max-w-xl font-display text-3xl font-medium text-papel-suave sm:text-4xl">{titulo}</h1>
        {descripcion && (
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-papel-suave/75">{descripcion}</p>
        )}
      </div>
    </header>
  )
}
