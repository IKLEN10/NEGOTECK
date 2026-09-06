import { useEffect, useRef } from 'react'

/**
 * Agrega la clase `es-visible` al elemento cuando entra en el viewport.
 * Se combina con la clase utilitaria `.revelar` para lograr una entrada
 * con desvanecimiento y desplazamiento hacia arriba.
 */
export function useRevelado(opciones = {}) {
  const referencia = useRef(null)

  useEffect(() => {
    const nodo = referencia.current
    if (!nodo) return undefined

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('es-visible')
          observador.unobserve(entrada.target)
        }
      },
      { threshold: 0.15, ...opciones },
    )

    observador.observe(nodo)
    return () => observador.disconnect()
  }, [opciones])

  return referencia
}
