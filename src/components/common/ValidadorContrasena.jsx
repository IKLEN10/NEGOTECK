import { CheckCircle2 } from "lucide-react";

function evaluarContrasena(valor) {
  return {
    longitud: valor.length >= 8,
    mayuscula: /[A-Z]/.test(valor),
    minuscula: /[a-z]/.test(valor),
    numero: /[0-9]/.test(valor),
    especial: /[^A-Za-z0-9]/.test(valor),
  };
}

function ReglaContrasena({ cumple, children }) {
  return (
    <li
      className={`flex items-center gap-1.5 ${cumple ? "text-verde-600" : "text-tinta/45"}`}
    >
      <CheckCircle2
        size={13}
        className={cumple ? "opacity-100" : "opacity-30"}
      />
      {children}
    </li>
  );
}

export default function ValidadorContrasena({ valor, mostrarReglas = true }) {
  const reglas = evaluarContrasena(valor);

  return (
    <>
      {mostrarReglas && (
        <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
          <ReglaContrasena cumple={reglas.longitud}>
            8+ caracteres
          </ReglaContrasena>
          <ReglaContrasena cumple={reglas.mayuscula}>
            Una mayúscula
          </ReglaContrasena>
          <ReglaContrasena cumple={reglas.minuscula}>
            Una minúscula
          </ReglaContrasena>
          <ReglaContrasena cumple={reglas.numero}>Un número</ReglaContrasena>
          <ReglaContrasena cumple={reglas.especial}>
            Un carácter especial
          </ReglaContrasena>
        </ul>
      )}
    </>
  );
}

export { evaluarContrasena };
