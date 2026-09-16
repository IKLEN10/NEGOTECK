import { Link } from 'react-router-dom'

// Mismas rutas internas que usa el menú principal (BarraNavegacion), sin
// anclas de scroll: cada enlace navega a su propia página dentro de la
// misma aplicación.
const COLUMNAS = [
  {
    titulo: 'Explorar',
    enlaces: [
      { etiqueta: 'Inicio', to: '/' },
      { etiqueta: 'Áreas de conocimiento', to: '/areas' },
      { etiqueta: '¿Cómo publicar?', to: '/como-publicar' },
    ],
  },
  {
    titulo: 'Cuenta',
    enlaces: [
      { etiqueta: 'Iniciar sesión', to: '/login' },
      { etiqueta: 'Crear cuenta', to: '/registro' },
      { etiqueta: 'Panel del autor', to: '/panel' },
    ],
  },
  {
    titulo: 'Revista',
    enlaces: [
      { etiqueta: 'Quiénes somos', to: '/quienes-somos' },
      { etiqueta: 'Contacto', to: '/contacto' },
    ],
  },
]

export default function PiePagina() {
  return (
    <footer className="border-t border-tinta/10 bg-azulRey-900 text-papel-suave/85">
      <div className="contenedor-pagina grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-semibold text-papel-suave">NEGOTECK</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-papel-suave/60">
            Revista digital de investigación y divulgación académica. Publicación de acceso abierto desde 2019.
          </p>
        </div>

        {COLUMNAS.map((columna) => (
          <div key={columna.titulo}>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.14em] text-papel-suave/50">{columna.titulo}</h4>
            <ul className="mt-4 flex flex-col gap-2.5">
              {columna.enlaces.map((enlace) => (
                <li key={enlace.etiqueta}>
                  <Link to={enlace.to} className="text-sm text-papel-suave/75 hover:text-papel-suave">
                    {enlace.etiqueta}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-papel-suave/10">
        <div className="contenedor-pagina flex flex-col items-center justify-between gap-2 py-5 text-xs text-papel-suave/50 sm:flex-row">
          <span>© {new Date().getFullYear()} NEGOTECK. Todos los derechos reservados.</span>
        </div>
      </div>
    </footer>
  )
}
