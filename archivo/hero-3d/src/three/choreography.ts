/**
 * COREOGRAFÍA DEL AUTO — CONFIGURACIÓN CONGELADA
 * ==============================================
 *
 * Los valores de este archivo están cerrados: son el resultado de varias
 * rondas de ajuste y verificación contra la geometría real del modelo, y no
 * deben tocarse al personalizar el hero. Lo que cambie en adelante (tipografía,
 * paleta, paneles, luces, copy) va en los componentes, no aquí.
 *
 * Verificado sobre camry.glb (858.289 vértices) en 16:9, 16:10 y móvil:
 *   - hero inmóvil de 0 a 15% del scroll
 *   - giro de 0° exactos al 32% a 180,00° exactos al 80%
 *   - todo estabilizado del 85% al 100%
 *   - las tres magnitudes monótonas: el giro nunca retrocede, el
 *     desplazamiento nunca vuelve a la derecha, la escala nunca vuelve a crecer
 *   - salto máximo 0,35° por cada 0,05% de scroll
 *
 * Encuadre resultante (porcentajes del ancho de pantalla):
 *   escritorio 16:9   hero 59%..117%   final  4%..54%
 *   móvil 375         hero 23%..117%   final 14%..82%  (centrado)
 *
 * El recorrido: primer plano del frente sangrando por un borde → retroceso →
 * media vuelta → pose final de tres cuartos trasera. Solo el movimiento
 * necesario para llegar ahí.
 */

export type Range = { from: number; to: number }
export type Responsive = { narrow: number; wide: number }

export type CarState = {
  /** Tamaño relativo a la pose final. */
  scale: number
  /** Posición horizontal en medios anchos de pantalla: + es a la derecha. */
  offset: number
  /** Giro sobre su eje vertical, en radianes. */
  rotationY: number
}

/**
 * Tramos de scroll de cada parte del movimiento. El retroceso va por delante
 * del giro a propósito: cuando el auto se pone de perfil ya se ha reducido lo
 * suficiente para caber en pantalla.
 */
export const TIMELINE = {
  zoomOut: { from: 0.15, to: 0.62 } as Range,
  rotation: { from: 0.32, to: 0.8 } as Range,
  travel: { from: 0.2, to: 0.85 } as Range,
}

/** Desde que termina el retroceso, el auto ya no se corta en ningún momento. */
export const FRAMED_WINDOW: Range = { from: 0.62, to: 1 }

/** Media vuelta: lo justo para pasar de mirar al frente a mostrar la trasera. */
export const TOTAL_TURN = Math.PI

/**
 * Composición, dada para un móvil estrecho y para pantalla de portátil en
 * adelante. Cualquier ancho intermedio recibe una mezcla de las dos, así que
 * no hay salto en ningún breakpoint.
 *
 * En pantalla ancha el auto ocupa un lado y el texto el otro. Un móvil no
 * tiene sitio para eso: el primer plano es más suave y la pose final queda
 * centrada, con el texto encima y debajo.
 */
export const HERO_SCALE: Responsive = { narrow: 1.45, wide: 1.58 }
export const HERO_OFFSET: Responsive = { narrow: 0.45, wide: 0.85 }
export const FINAL_SCALE = 1
export const FINAL_OFFSET: Responsive = { narrow: 0, wide: -0.35 }

export const NARROW_WIDTH = 380
export const WIDE_WIDTH = 1100

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value)

/**
 * Smootherstep: velocidad *y* aceleración valen cero en los dos extremos, así
 * que cada tramo entra y sale sin tirón.
 */
export function ease(t: number) {
  const x = clamp01(t)
  return x * x * x * (x * (x * 6 - 15) + 10)
}

const stage = (progress: number, { from, to }: Range) => ease((progress - from) / (to - from))
const blend = (pair: Responsive, viewport: number) =>
  pair.narrow + (pair.wide - pair.narrow) * viewport

/** 0 en el móvil más estrecho, 1 desde ancho de portátil: una rampa, no un breakpoint. */
export function viewportBlend(width: number) {
  return clamp01((width - NARROW_WIDTH) / (WIDE_WIDTH - NARROW_WIDTH))
}

/**
 * Estado del auto en un punto del scroll. Al ser una función pura del scroll,
 * ir hacia arriba reproduce el movimiento al revés y detener el scroll deja al
 * auto exactamente donde está.
 */
export function choreographyAt(progress: number, viewport = 1): CarState {
  const p = clamp01(progress)
  const heroScale = blend(HERO_SCALE, viewport)
  const heroOffset = blend(HERO_OFFSET, viewport)
  const finalOffset = blend(FINAL_OFFSET, viewport)

  return {
    scale: heroScale + (FINAL_SCALE - heroScale) * stage(p, TIMELINE.zoomOut),
    offset: heroOffset + (finalOffset - heroOffset) * stage(p, TIMELINE.travel),
    rotationY: TOTAL_TURN * stage(p, TIMELINE.rotation),
  }
}
