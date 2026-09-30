import * as THREE from 'three'

/**
 * Texturas de hormigón generadas por código: nada de fotos, y siempre iguales
 * porque el azar lleva semilla fija.
 *
 * Son mosaicos que se repiten sin costura: el ruido envuelve por los bordes y
 * las juntas del encofrado caen justo en el borde de la tesela.
 */

/** mulberry32: un PRNG diminuto con semilla. */
function seeded(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const smooth = (t: number) => t * t * (3 - 2 * t)

/**
 * Ruido de valor por octavas (fBm), periódico en los dos ejes para que la
 * tesela se repita sin corte. Devuelve valores en 0..1.
 */
function noiseField(w: number, h: number, seed: number, cells: number, octaves: number) {
  const rand = seeded(seed)
  const out = new Float32Array(w * h)
  let amp = 1
  let total = 0

  for (let o = 0; o < octaves; o += 1) {
    const cx = cells << o
    const cy = Math.max(1, Math.round((cells * h) / w)) << o
    const grid = new Float32Array(cx * cy)
    for (let i = 0; i < grid.length; i += 1) grid[i] = rand()

    for (let y = 0; y < h; y += 1) {
      const fy = (y / h) * cy
      const y0 = Math.floor(fy)
      const ty = smooth(fy - y0)
      const y1 = (y0 + 1) % cy
      for (let x = 0; x < w; x += 1) {
        const fx = (x / w) * cx
        const x0 = Math.floor(fx)
        const tx = smooth(fx - x0)
        const x1 = (x0 + 1) % cx
        const a = grid[y0 * cx + x0]
        const b = grid[y0 * cx + x1]
        const c = grid[y1 * cx + x0]
        const d = grid[y1 * cx + x1]
        out[y * w + x] += amp * (a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty)
      }
    }

    total += amp
    amp *= 0.5
  }

  for (let i = 0; i < out.length; i += 1) out[i] /= total
  return out
}

/** Pinta un campo de ruido como gris, a baja resolución, y lo escala sobre el lienzo. */
function paintMottling(
  ctx: CanvasRenderingContext2D,
  size: { w: number; h: number },
  field: Float32Array,
  fieldSize: { w: number; h: number },
  base: number,
  spread: number,
) {
  const img = ctx.createImageData(fieldSize.w, fieldSize.h)
  for (let i = 0; i < field.length; i += 1) {
    const v = base + (field[i] - 0.5) * spread
    img.data[i * 4] = v
    img.data[i * 4 + 1] = v + 1
    img.data[i * 4 + 2] = v + 2
    img.data[i * 4 + 3] = 255
  }
  const tmp = document.createElement('canvas')
  tmp.width = fieldSize.w
  tmp.height = fieldSize.h
  tmp.getContext('2d')?.putImageData(img, 0, 0)
  ctx.imageSmoothingEnabled = true
  ctx.drawImage(tmp, 0, 0, size.w, size.h)
}

/** Grano fino píxel a píxel: lo que hace que el gris parezca material. */
function addGrain(ctx: CanvasRenderingContext2D, w: number, h: number, seed: number, amount: number) {
  const rand = seeded(seed)
  const img = ctx.getImageData(0, 0, w, h)
  const d = img.data
  for (let i = 0; i < d.length; i += 4) {
    const n = (rand() - 0.5) * amount
    d[i] += n
    d[i + 1] += n
    d[i + 2] += n
  }
  ctx.putImageData(img, 0, 0)
}

function toTexture(canvas: HTMLCanvasElement) {
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}

/** Tamaño en unidades de mundo que cubre una tesela del muro (4 × 4 paneles de 2,4 × 1,2). */
export const WALL_TILE = { w: 9.6, h: 4.8 }
/** Tamaño en unidades de mundo que cubre una tesela del suelo. */
export const FLOOR_TILE = 6

/**
 * Hormigón visto de encofrado: paneles de 2:1 con sus juntas, los agujeros de
 * los tensores en rejilla y algún chorreón vertical de agua.
 */
export function wallTexture() {
  const W = 2048
  const H = 1024
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) return toTexture(canvas)

  const field = noiseField(1024, 512, 11, 6, 5)
  paintMottling(ctx, { w: W, h: H }, field, { w: 1024, h: 512 }, 84, 64)

  const rand = seeded(31)

  // Chorreones: oscurecen de arriba abajo, muy suaves
  for (let i = 0; i < 26; i += 1) {
    const x = rand() * W
    const width = 14 + rand() * 70
    const top = rand() * H * 0.6
    const length = 120 + rand() * 420
    const streak = ctx.createLinearGradient(0, top, 0, top + length)
    streak.addColorStop(0, `rgba(0,0,0,${0.06 + rand() * 0.1})`)
    streak.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = streak
    ctx.fillRect(x, top, width, length)
  }

  // Juntas del encofrado, con un filo claro que les da relieve
  const panelW = W / 4
  const panelH = H / 4
  for (let x = 0; x < W; x += panelW) {
    ctx.fillStyle = 'rgba(0,0,0,0.42)'
    ctx.fillRect(x - 1, 0, 3, H)
    ctx.fillStyle = 'rgba(255,255,255,0.05)'
    ctx.fillRect(x + 2, 0, 1, H)
  }
  for (let y = 0; y < H; y += panelH) {
    ctx.fillStyle = 'rgba(0,0,0,0.32)'
    ctx.fillRect(0, y - 1, W, 2)
    ctx.fillStyle = 'rgba(255,255,255,0.04)'
    ctx.fillRect(0, y + 1, W, 1)
  }

  // Agujeros de tensores: tres columnas por dos filas en cada panel
  for (let px = 0; px < W; px += panelW) {
    for (let py = 0; py < H; py += panelH) {
      for (const fx of [0.18, 0.5, 0.82]) {
        for (const fy of [0.28, 0.72]) {
          const cx = px + panelW * fx
          const cy = py + panelH * fy
          ctx.fillStyle = 'rgba(255,255,255,0.08)'
          ctx.beginPath()
          ctx.arc(cx + 1, cy + 1, 6.5, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = 'rgba(0,0,0,0.62)'
          ctx.beginPath()
          ctx.arc(cx, cy, 5.5, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }
  }

  addGrain(ctx, W, H, 7, 18)
  return toTexture(canvas)
}

/** Hormigón pulido del suelo: manchas amplias de desgaste y grano, sin juntas. */
export function floorTexture() {
  const S = 1024
  const canvas = document.createElement('canvas')
  canvas.width = S
  canvas.height = S
  const ctx = canvas.getContext('2d')
  if (!ctx) return toTexture(canvas)

  const field = noiseField(512, 512, 5, 5, 5)
  paintMottling(ctx, { w: S, h: S }, field, { w: 512, h: 512 }, 70, 48)

  // Desgaste: manchas grandes y oscuras, muy difusas
  const wear = noiseField(128, 128, 19, 2, 3)
  const img = ctx.getImageData(0, 0, S, S)
  const d = img.data
  for (let y = 0; y < S; y += 1) {
    const wy = Math.floor((y / S) * 128)
    for (let x = 0; x < S; x += 1) {
      const w = wear[wy * 128 + Math.floor((x / S) * 128)]
      const shade = w > 0.55 ? (w - 0.55) * 60 : 0
      const i = (y * S + x) * 4
      d[i] -= shade
      d[i + 1] -= shade
      d[i + 2] -= shade
    }
  }
  ctx.putImageData(img, 0, 0)

  addGrain(ctx, S, S, 3, 14)
  return toTexture(canvas)
}

/**
 * Halo de las ranuras de luz: una franja que se apaga hacia los lados. Blanca,
 * para que el color lo ponga el material.
 */
export function glowTexture() {
  const W = 128
  const H = 8
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const g = ctx.createLinearGradient(0, 0, W, 0)
    g.addColorStop(0, 'rgba(255,255,255,0)')
    g.addColorStop(0.42, 'rgba(255,255,255,0.35)')
    g.addColorStop(0.5, 'rgba(255,255,255,1)')
    g.addColorStop(0.58, 'rgba(255,255,255,0.35)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

/**
 * Gobo para el foco que baña el muro: una banda diagonal de bordes suaves, con
 * un canto más marcado, como la luz que entra por una ventana alta. El foco
 * multiplica su color por esta textura: negro no ilumina, blanco ilumina.
 */
export function goboTexture() {
  const S = 512
  const canvas = document.createElement('canvas')
  canvas.width = S
  canvas.height = S
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, S, S)

    ctx.save()
    ctx.translate(S / 2, S / 2)
    ctx.rotate(-Math.PI / 5)
    const band = ctx.createLinearGradient(-S * 0.3, 0, S * 0.3, 0)
    band.addColorStop(0, 'rgba(255,255,255,0)')
    band.addColorStop(0.28, 'rgba(255,255,255,0.75)')
    band.addColorStop(0.6, 'rgba(255,255,255,1)')
    band.addColorStop(0.68, 'rgba(255,255,255,0.3)')
    band.addColorStop(0.8, 'rgba(255,255,255,0)')
    ctx.fillStyle = band
    ctx.fillRect(-S * 0.3, -S, S * 0.6, S * 2)
    ctx.restore()

    // Se apaga hacia los bordes: el círculo del foco no debe notarse
    const fade = ctx.createRadialGradient(S / 2, S / 2, S * 0.18, S / 2, S / 2, S / 2)
    fade.addColorStop(0, 'rgba(0,0,0,0)')
    fade.addColorStop(1, 'rgba(0,0,0,1)')
    ctx.fillStyle = fade
    ctx.fillRect(0, 0, S, S)
  }
  return new THREE.CanvasTexture(canvas)
}
