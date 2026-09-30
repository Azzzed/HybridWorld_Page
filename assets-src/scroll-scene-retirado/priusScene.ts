/**
 * Escena real del hero: Toyota Prius 2026 plata de carimage.dev.
 *
 * Dos ángulos —3/4 delantero y 3/4 trasero— que se recorren con el scroll.
 * **Sin zoom**: la escala se queda fija de principio a fin y lo único que se
 * mueve es la posición horizontal, más un fundido corto al cambiar de foto.
 *
 * ⚠️ Licencia: estas imágenes se bajaron con el plan Free de carimage.dev,
 * cuya licencia es solo de evaluación. Para publicar el sitio hace falta el
 * plan Pro ($29/mes), que da licencia comercial mientras esté activo.
 */

const DIR = "/img/prius";

export const PHOTOS = {
  front34: `${DIR}/front-3-4.webp`,
  rear34: `${DIR}/rear-3-4.webp`,
} as const;

/** Todas las que hay que precargar. */
export const PHOTO_SRCS = Object.values(PHOTOS);

export type PhotoKey = {
  at: number;
  src: string;
  /** voltea la imagen en horizontal */
  mirror?: boolean;
  /** desplazamiento en pantalla, en fracción de ancho/alto */
  pan: [number, number];
};

/**
 * El coche entra por la derecha con el 3/4 delantero, cruza a la izquierda y
 * allí cambia al 3/4 trasero. Siempre ocupa la mitad opuesta al texto, y el
 * cambio de foto cae en el hueco sin texto (~0.62–0.74 del avance).
 */
export const PHOTO_PATH: PhotoKey[] = [
  { at: 0.0, src: PHOTOS.front34, pan: [0.3, 0.0] },
  { at: 0.5, src: PHOTOS.front34, pan: [0.22, 0.0] },
  /* El cruce y el cambio de ángulo ocurren aquí, sin texto en pantalla */
  { at: 0.72, src: PHOTOS.rear34, pan: [-0.1, 0.0] },
  { at: 1.0, src: PHOTOS.rear34, pan: [-0.26, 0.0] },
];

/** Escala única para toda la escena: es lo que quita el zoom. */
const SCALE = 1.06;

const smooth = (x: number) => x * x * (3 - 2 * x);
const mix = (a: number, b: number, k: number) => a + (b - a) * k;

export function drawPhotos(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  /** 0 = primer fotograma, 1 = último */
  t: number,
  images: Map<string, HTMLImageElement>,
) {
  ctx.clearRect(0, 0, w, h);

  let i = 0;
  while (i < PHOTO_PATH.length - 2 && t > PHOTO_PATH[i + 1].at) i += 1;
  const a = PHOTO_PATH[i];
  const b = PHOTO_PATH[i + 1];
  const k = smooth(Math.min(Math.max((t - a.at) / (b.at - a.at || 1), 0), 1));

  const portrait = w < h;
  const panX = mix(a.pan[0], b.pan[0], k);
  const panY = mix(a.pan[1], b.pan[1], k);

  /* Tamaño constante: no cambia en todo el recorrido */
  const fit = portrait ? w * 1.12 : Math.min(w * 0.72, h * 1.15);
  const size = fit * SCALE;
  const cx = w / 2 + panX * w * (portrait ? 0.4 : 1);
  const cy = h * (portrait ? 0.3 : 0.5) + panY * h * 0.45;

  const paint = (key: PhotoKey, alpha: number) => {
    if (alpha <= 0.002) return;
    const img = images.get(key.src);
    if (!img?.complete || !img.naturalWidth) return;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(cx, cy);
    if (key.mirror) ctx.scale(-1, 1);
    ctx.drawImage(img, -size / 2, -size / 2, size, size);
    ctx.restore();
  };

  const same = a.src === b.src && !!a.mirror === !!b.mirror;
  if (same) {
    paint(a, 1);
    return;
  }

  /* El cambio de foto se comprime al tramo central del intervalo: repartido
     por todo se ve un fantasma doble durante media escena. */
  const fade = smooth(Math.min(Math.max((k - 0.36) / 0.28, 0), 1));
  paint(a, 1 - fade);
  paint(b, fade);
}
