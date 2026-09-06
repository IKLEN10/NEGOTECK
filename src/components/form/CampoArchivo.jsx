import { useRef } from "react";

export default function CampoArchivo({
  etiqueta,
  ejemplo,
  icono: Icono,
  aceptar,
  nombreArchivo,
  alSeleccionar,
  disabled = false,
}) {
  const referenciaInput = useRef(null);

  return (
    <div>
      <label className="etiqueta-campo">{etiqueta}</label>
      <button
        type="button"
        onClick={() => referenciaInput.current?.click()}
        disabled={disabled}
        className="flex w-full flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed border-tinta/20 bg-papel px-4 py-8 text-center transition-colors hover:border-azulRey-500 hover:bg-azulRey-50/40 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Icono size={22} className="text-tinta/40" />
        <span className="text-sm text-tinta/60">
          {nombreArchivo || `Haz clic para subir ${ejemplo}`}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-tinta/35">
          {aceptar === "application/pdf"
            ? "PDF · máx. 10MB"
            : "JPG o PNG · máx. 5MB"}
        </span>
      </button>
      <input
        ref={referenciaInput}
        type="file"
        accept={aceptar}
        className="hidden"
        onChange={(e) => alSeleccionar(e.target.files[0])}
        disabled={disabled}
      />
    </div>
  );
}
