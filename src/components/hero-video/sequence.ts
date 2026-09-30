/**
 * Las secuencias del hero: la cámara que gira alrededor del Prius, exportada
 * fotograma a fotograma. Hay dos videos del mismo giro: uno horizontal para
 * escritorio y otro vertical, compuesto para el móvil.
 *
 * Los MP4 originales solo traen dos fotogramas clave en cinco segundos, así
 * que moverlos con `currentTime` al ritmo del scroll daría saltos, sobre todo
 * hacia atrás. Con los fotogramas sueltos, cada posición del scroll es una
 * imagen exacta. Cómo se generan: docs/hero-video.md.
 */

/** Los dos videos tienen los mismos fotogramas: 5 s a 24 por segundo. */
export const FRAME_COUNT = 122

export type Source = {
  dir: string
  width: number
  height: number
  /**
   * Centro horizontal del auto en el cuadro (0 borde izquierdo, 1 derecho),
   * en 12 puntos repartidos por el video.
   */
  focus: number[]
  /**
   * Qué hace el recorte cuando la pantalla es más estrecha que el video:
   * `pan` lo desliza para dejar sitio al texto de los lados (escritorio);
   * `follow` lo centra en el auto (móvil, donde el texto va arriba).
   */
  framing: 'pan' | 'follow'
}

export const SOURCES = {
  /** `focus` medido con scripts/video-frames (analyze=1) y suavizado. */
  wide: {
    dir: '/hero/prius-1280',
    width: 1280,
    height: 720,
    focus: [0.748, 0.754, 0.739, 0.724, 0.612, 0.554, 0.519, 0.473, 0.421, 0.367, 0.326, 0.306],
    framing: 'pan',
  },
  /**
   * El auto va en la mitad de abajo y la pared oscura de arriba deja sitio al
   * texto. Su `focus` se fijó mirando los fotogramas: el auto empieza oscuro
   * y el suelo mojado confunde la medición automática.
   */
  vertical: {
    dir: '/hero/prius-vertical',
    width: 720,
    height: 1280,
    focus: [0.66, 0.65, 0.62, 0.61, 0.62, 0.6, 0.56, 0.5, 0.5, 0.5, 0.49, 0.49],
    framing: 'follow',
  },
} satisfies Record<string, Source>

/**
 * Pantallas que usan el video vertical: móviles y tabletas en vertical. Es el
 * mismo corte con el que el CSS del hero pasa a la composición de móvil; un
 * móvil apaisado usa el video horizontal y la composición de escritorio.
 */
export const VERTICAL_QUERY = '(max-width: 860px) and (orientation: portrait), (max-aspect-ratio: 3/4)'

export const frameUrl = (source: Source, index: number) =>
  `${source.dir}/${String(index + 1).padStart(3, '0')}.webp`

/** Centro del auto en un fotograma, interpolado entre los puntos medidos. */
export function focusAt(source: Source, frame: number) {
  const { focus } = source
  const t = Math.min(focus.length - 1, Math.max(0, (frame / (FRAME_COUNT - 1)) * (focus.length - 1)))
  const i = Math.min(focus.length - 2, Math.floor(t))
  return focus[i] + (focus[i + 1] - focus[i]) * (t - i)
}

/** Cuánto ha cruzado el auto de derecha a izquierda: 0 al empezar, 1 al terminar. */
export function crossingAt(source: Source, frame: number) {
  const start = source.focus[0]
  const end = source.focus[source.focus.length - 1]
  return Math.min(1, Math.max(0, (start - focusAt(source, frame)) / (start - end)))
}
