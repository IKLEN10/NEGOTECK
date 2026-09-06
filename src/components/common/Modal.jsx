import { X } from "lucide-react";
import { useEffect } from "react";

export default function Modal({
  abierto,
  alCerrar,
  titulo,
  children,
  pie,
  ancho = "max-w-md",
}) {
  useEffect(() => {
    if (!abierto) return undefined;
    const alPresionarTecla = (e) => e.key === "Escape" && alCerrar();
    document.addEventListener("keydown", alPresionarTecla);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", alPresionarTecla);
      document.body.style.overflow = "";
    };
  }, [abierto, alCerrar]);

  if (!abierto) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-tinta/50 px-4 backdrop-blur-[2px]"
      onClick={alCerrar}
    >
      <div
        className={`w-full ${ancho} animate-fadeUp rounded-card bg-papel-suave p-6 shadow-card`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 className="font-display text-lg font-medium text-tinta">
            {titulo}
          </h3>
          <button
            onClick={alCerrar}
            className="text-tinta/40 hover:text-tinta/80"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>
        <div className="text-sm text-tinta/75">{children}</div>
        {pie && <div className="mt-6 flex justify-end gap-3">{pie}</div>}
      </div>
    </div>
  );
}

export function ModalPantallCompleta({ alCerrar, titulo, children }) {
  useEffect(() => {
    const alPresionarTecla = (e) => e.key === "Escape" && alCerrar();
    document.addEventListener("keydown", alPresionarTecla);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", alPresionarTecla);
      document.body.style.overflow = "";
    };
  }, [alCerrar]);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-tinta/50 backdrop-blur-[2px]"
      onClick={alCerrar}
    >
      <div
        className="w-full h-full max-h-screen animate-fadeUp rounded-card bg-papel-suave shadow-card flex flex-col"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
      >
        <div className="flex items-center justify-between gap-4 border-b border-tinta/10 px-6 py-4">
          <h3 className="font-display text-lg font-medium text-tinta">
            {titulo}
          </h3>
          <button
            onClick={alCerrar}
            className="text-tinta/40 hover:text-tinta/80"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
