import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react'

const ContextoNotificacion = createContext(null)

const ICONOS = {
  exito: CheckCircle2,
  info: Info,
  advertencia: TriangleAlert,
}

const TONOS = {
  exito: 'border-azulRey-500 text-azulRey-700',
  info: 'border-tinta/20 text-tinta',
  advertencia: 'border-verde-500 text-verde-600',
}

export function ProveedorNotificaciones({ children }) {
  const [notificaciones, setNotificaciones] = useState([])
  const idRef = useRef(0)

  const descartar = useCallback((id) => {
    setNotificaciones((anteriores) => anteriores.filter((n) => n.id !== id))
  }, [])

  const mostrarNotificacion = useCallback(
    (mensaje, tipo = 'info') => {
      const id = ++idRef.current
      setNotificaciones((anteriores) => [...anteriores, { id, mensaje, tipo }])
      setTimeout(() => descartar(id), 4000)
    },
    [descartar],
  )

  return (
    <ContextoNotificacion.Provider value={{ mostrarNotificacion }}>
      {children}
      <div className="fixed top-5 right-5 z-[100] flex w-[calc(100%-2.5rem)] max-w-sm flex-col gap-2.5">
        {notificaciones.map((notificacion) => {
          const Icono = ICONOS[notificacion.tipo] || Info
          return (
            <div
              key={notificacion.id}
              className={`animate-toastIn flex items-start gap-3 rounded-[4px] border-l-4 bg-papel-suave px-4 py-3 shadow-card ${TONOS[notificacion.tipo] || TONOS.info}`}
              role="status"
            >
              <Icono size={18} className="mt-0.5 shrink-0" />
              <p className="flex-1 text-sm text-tinta/90">{notificacion.mensaje}</p>
              <button
                onClick={() => descartar(notificacion.id)}
                className="text-tinta/40 hover:text-tinta/80"
                aria-label="Cerrar notificación"
              >
                <X size={15} />
              </button>
            </div>
          )
        })}
      </div>
    </ContextoNotificacion.Provider>
  )
}

export function useNotificacion() {
  const contexto = useContext(ContextoNotificacion)
  if (!contexto) throw new Error('useNotificacion debe usarse dentro de ProveedorNotificaciones')
  return contexto
}
