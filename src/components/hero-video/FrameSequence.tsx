'use client'

import { useEffect, useImperativeHandle, useRef } from 'react'
import type { Ref } from 'react'
import { FRAME_COUNT, SOURCES, VERTICAL_QUERY, crossingAt, focusAt, frameUrl } from './sequence'
import type { Source } from './sequence'

export type FrameSequenceHandle = {
  /** Lleva el video a una posición: 0 es el primer fotograma, 1 el último. */
  seek: (position: number) => void
}

/** Fracción de la distancia al scroll que queda tras un segundo. */
const SMOOTHING = 0.0015

/**
 * Recorte del video horizontal en pantallas más estrechas que él (4:3,
 * 16:10): se desliza con el giro, y al empezar deja más sitio a la izquierda,
 * donde va el texto de la apertura, y al terminar a la derecha, donde va el
 * del cierre. Es la fracción del margen sobrante que se usa en cada extremo.
 */
const PAN = { start: -0.3, end: 0.8 }

/** Descargas simultáneas. */
const PARALLEL = 6

/**
 * Orden de descarga: el fotograma que se ve, los dos extremos y después de
 * grueso a fino (uno de cada 16, de cada 8…). Si se hace scroll antes de que
 * termine la descarga, el giro ya se entiende con los que hay.
 *
 * `step` salta fotogramas: con 2 se baja uno de cada dos (móvil) y el giro
 * usa el vecino más cercano para los que faltan.
 */
function loadOrder(first: number, step: number) {
  const snap = (i: number) => Math.min(FRAME_COUNT - 1, Math.round(i / step) * step)
  const order = [snap(first), 0, FRAME_COUNT - 1]
  for (let stride = 16; stride >= step; stride /= 2) {
    for (let i = 0; i < FRAME_COUNT; i += stride) order.push(i)
  }
  return [...new Set(order)]
}

/** Móvil: el video vertical baja la mitad de los fotogramas. */
const stepFor = (source: Source) => (source.framing === 'follow' ? 2 : 1)

type NetworkInformation = { saveData?: boolean; effectiveType?: string }

/**
 * Sin secuencia, solo el póster: con el ahorro de datos activado o en
 * conexiones lentas no vale la pena bajar decenas de imágenes.
 */
function posterOnly() {
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection
  return Boolean(connection?.saveData) || ['slow-2g', '2g', '3g'].includes(connection?.effectiveType ?? '')
}

type FrameSet = {
  source: Source
  images: HTMLImageElement[]
  ready: boolean[]
  queue: number[]
}

/**
 * El video del hero, pintado en un canvas fotograma a fotograma según el
 * scroll. Sigue al scroll con un amortiguado ligero, así que la cámara nunca
 * se mueve por su cuenta: parar el scroll la deja quieta y subir la hace
 * volver.
 *
 * El video vertical va en móviles y tabletas en vertical; el horizontal, en
 * el resto. Cada uno se descarga la primera vez que hace falta, así que girar
 * el móvil cambia de uno a otro sin volver a bajar el que ya estaba.
 *
 * Debajo del canvas está el póster (el primer fotograma, en el HTML del
 * servidor). El canvas no se ve hasta pintar su primer fotograma, y la
 * secuencia no empieza a bajar hasta que la página terminó de cargar (o hasta
 * el primer scroll), así no compite con lo que se ve al entrar.
 */
export default function FrameSequence({ ref }: { ref?: Ref<FrameSequenceHandle> }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const seek = useRef<(position: number) => void>(() => {})

  useImperativeHandle(ref, () => ({ seek: (position) => seek.current(position) }), [])

  useEffect(() => {
    const el = canvas.current
    const ctx = el?.getContext('2d', { alpha: false })
    if (!el || !ctx) return

    const vertical = window.matchMedia(VERTICAL_QUERY)
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sets = new Map<Source, FrameSet>()
    let active: FrameSet | null = null
    let inFlight = 0
    let disposed = false

    let width = 0
    let height = 0
    let dpr = 1
    let target = 0
    let current = 0
    let drawn: HTMLImageElement | null = null
    let raf = 0
    let last = 0
    /** La secuencia puede empezar a bajar: página cargada o primer scroll */
    let allowed = false

    /** El fotograma descargado de un video más cercano al que toca. */
    const nearest = (set: FrameSet, wanted: number) => {
      for (let d = 0; d < FRAME_COUNT; d += 1) {
        if (wanted - d >= 0 && set.ready[wanted - d]) return wanted - d
        if (wanted + d < FRAME_COUNT && set.ready[wanted + d]) return wanted + d
      }
      return -1
    }

    // El video cubre la pantalla; lo que sobra de los lados se recorta según
    // el encuadre de cada video.
    const paint = (set: FrameSet, index: number) => {
      const { source } = set
      const scale = Math.max(width / source.width, height / source.height)
      const w = source.width * scale
      const h = source.height * scale
      const visible = width / w
      let focus: number
      if (source.framing === 'pan') {
        const side = PAN.start + (PAN.end - PAN.start) * crossingAt(source, index)
        focus = 0.5 + ((1 - visible) / 2) * side
      } else {
        focus = Math.min(1 - visible / 2, Math.max(visible / 2, focusAt(source, index)))
      }
      ctx.drawImage(set.images[index], (width / 2 - focus * w) * dpr, ((height - h) / 2) * dpr, w * dpr, h * dpr)
      el.classList.add('is-painted')
    }

    /**
     * Pinta solo si cambia la imagen que toca. Si el video activo todavía no
     * tiene nada descargado (justo después de girar el móvil), usa el otro.
     */
    const render = () => {
      if (width === 0) return
      const wanted = Math.round(current)
      for (const set of new Set([active, ...sets.values()])) {
        if (!set) continue
        const index = nearest(set, wanted)
        if (index < 0) continue
        if (set.images[index] !== drawn) {
          paint(set, index)
          drawn = set.images[index]
        }
        return
      }
    }

    const load = () => {
      const set = active
      if (!set) return
      while (inFlight < PARALLEL && set.queue.length) {
        const index = set.queue.shift() as number
        const img = new Image()
        img.decoding = 'async'
        if (!set.images.length) img.fetchPriority = 'high'
        img.src = frameUrl(set.source, index)
        set.images[index] = img
        inFlight += 1
        img
          .decode()
          .then(() => {
            if (disposed) return
            set.ready[index] = true
            render()
          })
          // Si uno falla, se usa el vecino más cercano
          .catch(() => {})
          .finally(() => {
            inFlight -= 1
            if (!disposed) load()
          })
      }
    }

    /** Activa el video que toca y reanuda su descarga desde el fotograma visible. */
    const activate = (source: Source) => {
      let set = sets.get(source)
      if (!set) {
        set = { source, images: [], ready: [], queue: loadOrder(Math.round(target), stepFor(source)) }
        sets.set(source, set)
      }
      active = set
      drawn = null
      load()
      render()
    }

    const tick = (now: number) => {
      raf = 0
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 60
      last = now
      current += (target - current) * (1 - Math.pow(SMOOTHING, dt))
      if (calm.matches || Math.abs(target - current) < 0.02) current = target
      render()
      if (current !== target) raf = requestAnimationFrame(tick)
      else last = 0
    }

    seek.current = (position) => {
      target = Math.min(1, Math.max(0, position)) * (FRAME_COUNT - 1)
      // La primera posición llega al montar: si la página se abre a mitad del
      // hero, se empieza por ese fotograma y sin animar desde el principio.
      if (!active) {
        current = target
        if (allowed) activate(vertical.matches ? SOURCES.vertical : SOURCES.wide)
        return
      }
      if (!raf) raf = requestAnimationFrame(tick)
    }

    // Arranque de la secuencia: tras el load y con el navegador libre, o con
    // el primer scroll si llega antes. Con ahorro de datos, nunca: se queda
    // el póster.
    const allow = () => {
      if (allowed || disposed) return
      allowed = true
      window.removeEventListener('scroll', allow)
      current = target
      activate(vertical.matches ? SOURCES.vertical : SOURCES.wide)
    }
    let idle = 0
    const onLoad = () => {
      idle =
        typeof window.requestIdleCallback === 'function'
          ? window.requestIdleCallback(allow, { timeout: 2000 })
          : window.setTimeout(allow, 200)
    }
    if (!posterOnly()) {
      window.addEventListener('scroll', allow, { once: true, passive: true })
      if (document.readyState === 'complete') onLoad()
      else window.addEventListener('load', onLoad, { once: true })
    }

    // Cambiar el tamaño del canvas lo borra: se repinta enseguida.
    const resize = () => {
      const rect = el.getBoundingClientRect()
      width = rect.width
      height = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      el.width = Math.round(width * dpr)
      el.height = Math.round(height * dpr)
      ctx.imageSmoothingQuality = 'high'
      drawn = null
      render()
    }
    const observer = new ResizeObserver(resize)
    observer.observe(el)

    const reorient = () => {
      if (active) activate(vertical.matches ? SOURCES.vertical : SOURCES.wide)
    }
    vertical.addEventListener('change', reorient)

    return () => {
      disposed = true
      window.removeEventListener('scroll', allow)
      window.removeEventListener('load', onLoad)
      if (typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(idle)
      window.clearTimeout(idle)
      cancelAnimationFrame(raf)
      observer.disconnect()
      vertical.removeEventListener('change', reorient)
      seek.current = () => {}
    }
  }, [])

  return <canvas ref={canvas} className="hero-scroll__frames" aria-hidden="true" />
}
