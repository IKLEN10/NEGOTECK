const TONOS = {
  azulRey: 'bg-azulRey-50 text-azulRey-700 border-azulRey-100',
  naranja: 'bg-naranja-100 text-naranja-700 border-naranja-100',
  verde: 'bg-verde-100 text-verde-600 border-verde-100',
  neutro: 'bg-tinta/5 text-tinta/70 border-tinta/10',
}

const TONOS_POR_ESTADO = {
  Aprobado: 'azulRey',
  Pendiente: 'verde',
  Rechazado: 'naranja',
}

export default function Insignia({ children, tono = 'neutro', estado }) {
  const tonoResuelto = estado ? TONOS_POR_ESTADO[estado] || 'neutro' : tono
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] ${TONOS[tonoResuelto]}`}
    >
      {children}
    </span>
  )
}
