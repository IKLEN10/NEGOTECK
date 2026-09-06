export default function ContadorPalabras({ texto, maximo }) {
  const palabras = texto.trim() ? texto.trim().split(/\s+/).length : 0;

  return (
    <span className="text-xs text-tinta/50">
      {palabras}/{maximo} palabras
    </span>
  );
}
