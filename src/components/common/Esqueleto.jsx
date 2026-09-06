export function TarjetaEsqueleto() {
  return (
    <div className="flex flex-col overflow-hidden rounded-card bg-papel-suave shadow-card">
      <div className="esqueleto h-44 w-full" />
      <div className="flex flex-col gap-3 p-4">
        <div className="esqueleto h-3 w-24" />
        <div className="esqueleto h-4 w-full" />
        <div className="esqueleto h-4 w-3/4" />
        <div className="esqueleto h-3 w-1/2" />
      </div>
    </div>
  )
}

export function LineaEsqueleto({ className = '' }) {
  return <div className={`esqueleto h-3 ${className}`} />
}

export function Cargador({ etiqueta = 'Cargando…' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-10 text-tinta/60">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-azulRey-500 border-t-transparent" />
      <span className="font-mono text-xs uppercase tracking-[0.14em]">{etiqueta}</span>
    </div>
  )
}
