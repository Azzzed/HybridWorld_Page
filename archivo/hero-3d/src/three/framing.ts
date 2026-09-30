import * as THREE from 'three'
import { choreographyAt, viewportBlend, FRAMED_WINDOW } from './choreography'
import type { CarState } from './choreography'

/**
 * ENCUADRE DE CÁMARA — CONFIGURACIÓN CONGELADA
 * ============================================
 *
 * Igual que la coreografía: estos valores están cerrados. Colocan la cámara
 * una sola vez, lo bastante atrás para que el auto no se corte desde que
 * termina el retroceso, y calculan el ancho visible contra el que la
 * coreografía posiciona el auto.
 */

/** Objetivo largo: perspectiva plana, la que se usa en fotografía de automoción. */
export const FOV = 28

/**
 * Hasta dónde puede llegar la pose final respecto al borde. Su propio
 * desplazamiento lateral cuenta dentro de este margen, así que el auto acaba
 * tan grande como permita el hueco que deja el texto, en cualquier forma de
 * pantalla y sin ajustes por dispositivo.
 */
export const FILL = 0.92

/** Dirección de cámara: tres cuartos frontal, algo por encima de la cintura. */
export const VIEW_DIR = new THREE.Vector3(1, 0.36, 1.18).normalize()

const WORLD_UP = new THREE.Vector3(0, 1, 0)

/** Momentos de la ventana que se comprueban, y puntos por momento. */
const SAMPLES = 32
const SCAN_STRIDE = 6

export type CameraBasis = {
  forward: THREE.Vector3
  right: THREE.Vector3
  up: THREE.Vector3
}

export type CarFit = {
  scale: number
  position: [number, number, number]
  size: THREE.Vector3
  points: Float32Array
}

export type Stage = {
  basis: CameraBasis
  target: THREE.Vector3
  distance: number
  halfWidth: number
  composition: number
}

/** Ejes de cámara para la dirección de vista. */
export function cameraBasis(): CameraBasis {
  const forward = VIEW_DIR.clone() // del objetivo hacia la cámara
  const right = new THREE.Vector3().crossVectors(WORLD_UP, forward).normalize()
  const up = new THREE.Vector3().crossVectors(forward, right).normalize()
  return { forward, right, up }
}

/**
 * Distancia que necesita la cámara para un instante congelado de la
 * coreografía: el auto girado, escalado y desplazado, con todos los puntos
 * muestreados todavía dentro del cuadro.
 */
function stateDistance(
  points: Float32Array,
  state: CarState,
  offset: number,
  basis: CameraBasis,
  target: THREE.Vector3,
  tanH: number,
  tanV: number,
) {
  const { forward, right, up } = basis
  const cos = Math.cos(state.rotationY)
  const sin = Math.sin(state.rotationY)
  const moveX = right.x * offset - target.x
  const moveY = -target.y
  const moveZ = right.z * offset - target.z
  let distance = 0

  for (let i = 0; i < points.length; i += 3 * SCAN_STRIDE) {
    const px = points[i]
    const py = points[i + 1]
    const pz = points[i + 2]
    const x = (px * cos + pz * sin) * state.scale + moveX
    const y = py * state.scale + moveY
    const z = (pz * cos - px * sin) * state.scale + moveZ
    const along = x * forward.x + y * forward.y + z * forward.z
    const across = Math.abs(x * right.x + y * right.y + z * right.z)
    const vertical = Math.abs(x * up.x + y * up.y + z * up.z)
    distance = Math.max(distance, along + across / tanH, along + vertical / tanV)
  }

  return distance
}

/**
 * Coloca la cámara una sola vez e informa del ancho visible que usa la
 * coreografía. El primer plano de apertura sangra por el borde a propósito, de
 * modo que queda fuera de la comprobación.
 */
export function computeStage(fit: CarFit, width: number, height: number): Stage {
  const basis = cameraBasis()
  const composition = viewportBlend(width)
  const vFov = THREE.MathUtils.degToRad(FOV)
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * (width / height))
  const tanH = Math.tan(hFov / 2) * FILL
  const tanV = Math.tan(vFov / 2) * FILL
  const target = new THREE.Vector3(0, fit.size.y * 0.45, 0)
  const span = FRAMED_WINDOW.to - FRAMED_WINDOW.from

  // El desplazamiento lateral es una fracción del ancho visible, que a su vez
  // depende de la distancia, así que los dos se asientan uno contra otro en
  // unas pocas pasadas. Converge porque el desplazamiento mantiene su
  // fracción de pantalla sea cual sea la distancia, mientras que el auto se
  // encoge conforme la cámara retrocede.
  let halfWidth = Math.max(fit.size.x, fit.size.z)
  let distance = halfWidth * 2

  for (let pass = 0; pass < 4; pass += 1) {
    distance = 0

    for (let step = 0; step <= SAMPLES; step += 1) {
      const progress = FRAMED_WINDOW.from + (span * step) / SAMPLES
      const state = choreographyAt(progress, composition)
      distance = Math.max(
        distance,
        stateDistance(fit.points, state, state.offset * halfWidth, basis, target, tanH, tanV),
      )
    }

    halfWidth = distance * Math.tan(hFov / 2)
  }

  return { basis, target, distance, halfWidth, composition }
}

/** Posición en el mundo del auto para un instante del movimiento. */
export function worldOffset(state: CarState, stage: Stage, out: THREE.Vector3) {
  return out.copy(stage.basis.right).multiplyScalar(state.offset * stage.halfWidth)
}
