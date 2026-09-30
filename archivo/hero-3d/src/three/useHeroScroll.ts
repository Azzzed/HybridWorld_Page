import { useEffect, useRef } from 'react'
import { invalidate } from '@react-three/fiber'
import type { RefObject } from 'react'

/**
 * Devuelve una ref con el avance del scroll dentro del hero (0 arriba del
 * todo, 1 cuando el hero termina) y avisa a `onChange` en cada cambio.
 *
 * Se mide contra la sección y no contra el documento, porque debajo del hero
 * sigue habiendo página. Y el valor vive en una ref a propósito: el scroll no
 * puede volver a renderizar React en cada evento de rueda.
 */
export function useHeroScroll(
  section: RefObject<HTMLElement | null>,
  onChange?: (value: number) => void,
) {
  const progress = useRef(0)

  useEffect(() => {
    const update = () => {
      const el = section.current
      if (!el) return

      const top = el.getBoundingClientRect().top + window.scrollY
      const range = el.offsetHeight - window.innerHeight
      const value = range > 0 ? Math.min(1, Math.max(0, (window.scrollY - top) / range)) : 0

      progress.current = value
      onChange?.(value)
      invalidate()
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [section, onChange])

  return progress
}
