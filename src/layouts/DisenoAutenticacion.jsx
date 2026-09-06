import { Link, Outlet } from 'react-router-dom'
import { useDesplazamientoArriba } from '../hooks/useDesplazamientoArriba'

export default function DisenoAutenticacion() {
  useDesplazamientoArriba()
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-azulRey-700 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25% 25%, rgba(247,249,252,0.5) 0px, transparent 45%), radial-gradient(circle at 80% 70%, rgba(242,120,12,0.55) 0px, transparent 40%)',
          }}
        />
        <Link to="/" className="relative flex items-center gap-2">
          <img src="/logo-negoteck.jpg" alt="NEGOTECK" className="h-[30px] w-[30px] rounded-lg object-contain" />
          <span className="font-display text-xl font-semibold text-papel-suave">NEGOTECK</span>
        </Link>
        <blockquote className="relative max-w-md font-display text-2xl font-medium leading-snug text-papel-suave">
          “La divulgación seria no simplifica la evidencia: la hace legible.”
        </blockquote>
        <p className="relative font-mono text-xs uppercase tracking-[0.14em] text-papel-suave/50">
          Comité Editorial — NEGOTECK
        </p>
      </div>
      <div className="flex items-center justify-center bg-papel px-6 py-14 sm:px-10">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
