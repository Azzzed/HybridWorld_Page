import { useEffect } from 'react'
import type { RefObject } from 'react'

/**
 * Avisa a `onChange` del avance del scroll dentro de la sección: 0 arriba del
 * todo, 1 cuando termina.
 *
 * Se mide contra la sección y no contra el documento, porque debajo del hero
 * sigue habiendo página. Y no pasa por el estado de React: un re-render por
 * cada evento de rueda se notaría.
 */
export function useScrollProgress(
  section: RefObject<HTMLElement | null>,
  onChange: (value: number) => void,
) {
  useEffect(() => {
    const update = () => {
      const el = section.current
      if (!el) return

      const top = el.getBoundingClientRect().top + window.scrollY
      const range = el.offsetHeight - window.innerHeight
      onChange(range > 0 ? Math.min(1, Math.max(0, (window.scrollY - top) / range)) : 0)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [section, onChange])
}
