export default function TarjetaEstadistica({ icono: Icono, etiqueta, valor, tono = 'azulRey' }) {
  const tonos = {
    azulRey: 'bg-azulRey-50 text-azulRey-600',
    verde: 'bg-verde-100 text-verde-600',
    naranja: 'bg-naranja-100 text-naranja-600',
    neutro: 'bg-tinta/5 text-tinta/60',
  }
  return (
    <div className="rounded-card border border-tinta/10 bg-papel-suave p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <span className={`flex h-10 w-10 items-center justify-center rounded-full ${tonos[tono]}`}>
          <Icono size={18} />
        </span>
      </div>
      <p className="mt-4 font-display text-3xl font-semibold text-tinta">{valor}</p>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-tinta/45">{etiqueta}</p>
    </div>
  )
}
