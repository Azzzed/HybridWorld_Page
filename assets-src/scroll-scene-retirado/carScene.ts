/**
 * Fuente de fotogramas para la escena de scroll del hero.
 *
 * Hay dos tipos y el componente `ScrollScene` trata a los dos igual, así que
 * pasar de la prueba al coche real es cambiar una sola constante:
 *
 *   - `placeholder`: dibuja un volumen de prueba en 3D dentro del canvas, sin
 *     pedir nada a la red. Sirve para ajustar el recorrido de cámara, el
 *     encuadre y el ritmo ANTES de gastar créditos.
 *   - `frames`: una lista de imágenes ya renderizadas (el Prius). Se precargan
 *     y se pintan según el avance del scroll.
 */

export const FRAME_COUNT = 100;

export type SceneSource =
  | { kind: "placeholder" }
  | { kind: "photos" }
  | { kind: "frames"; urls: string[] };

/**
 * Fuente activa.
 *   "photos"      -> Prius 2026 plata real (src/lib/priusScene.ts)
 *   "placeholder" -> el volumen 3D de prueba, para recalibrar la cámara
 */
export const SCENE_SOURCE: SceneSource = { kind: "photos" };

const NEON = "18, 224, 107";

/* ------------------------------------------------------------------ *
 *  Modelo de prueba: un crossover low-poly.
 *  Ejes en espacio del coche: +X morro, +Y arriba, +Z costado derecho.
 * ------------------------------------------------------------------ */

type Vec3 = [number, number, number];

const L = 2.25; // medio largo
const W = 0.9; // medio ancho
const H = 0.95; // alto de la cintura (hasta las ventanas)
const FLOOR = 0.34; // altura de los bajos

const VERTS: Vec3[] = [
  /* carrocería, abajo (0-3) */
  [-L, FLOOR, -W], [L * 0.98, FLOOR + 0.04, -W], [L * 0.98, FLOOR + 0.04, W], [-L, FLOOR, W],
  /* carrocería, cintura (4-7): el morro cae un poco */
  [-L * 0.96, H, -W], [L * 0.9, H * 0.78, -W * 0.94], [L * 0.9, H * 0.78, W * 0.94], [-L * 0.96, H, W],
  /* habitáculo, base (8-11) */
  [-L * 0.68, H, -W * 0.85], [L * 0.32, H * 0.9, -W * 0.86], [L * 0.32, H * 0.9, W * 0.86], [-L * 0.68, H, W * 0.85],
  /* habitáculo, techo (12-15): más corto y estrecho */
  [-L * 0.5, H + 0.5, -W * 0.6], [0, H + 0.53, -W * 0.64], [0, H + 0.53, W * 0.64], [-L * 0.5, H + 0.5, W * 0.6],
];

type Face = { idx: number[]; tone: number; glass?: boolean };

const FACES: Face[] = [
  { idx: [4, 5, 6, 7], tone: 1.0 },       // capó
  { idx: [0, 1, 5, 4], tone: 0.8 },       // costado -Z
  { idx: [3, 7, 6, 2], tone: 0.8 },       // costado +Z
  { idx: [1, 2, 6, 5], tone: 0.95 },      // frente
  { idx: [0, 4, 7, 3], tone: 0.6 },       // trasera
  { idx: [12, 13, 14, 15], tone: 1.0 },   // techo
  { idx: [8, 9, 13, 12], tone: 0.6, glass: true },
  { idx: [11, 15, 14, 10], tone: 0.6, glass: true },
  { idx: [9, 10, 14, 13], tone: 0.5, glass: true }, // parabrisas
  { idx: [8, 12, 15, 11], tone: 0.5, glass: true }, // luneta
];

/** Ruedas: centro, radio y semiancho, en espacio del coche. */
const WHEELS: { c: Vec3; r: number }[] = [
  { c: [L * 0.63, 0.37, -W * 0.94], r: 0.37 },
  { c: [L * 0.63, 0.37, W * 0.94], r: 0.37 },
  { c: [-L * 0.63, 0.37, -W * 0.94], r: 0.37 },
  { c: [-L * 0.63, 0.37, W * 0.94], r: 0.37 },
];

const NOSE: Vec3 = [L * 0.84, H * 0.72, -W * 0.2];
const CENTER: Vec3 = [0, H * 0.72, 0];
const FRONT: Vec3 = [L * 0.5, H * 0.78, 0];

/* ------------------------------------------------------------------ *
 *  Recorrido de cámara
 *
 *  Basado en las referencias: (1) la punta del morro en primerísimo plano,
 *  (2) se asienta, (3) zoom out al coche entero, (4) media vuelta exacta
 *  (+180°) y cruza al otro lado mostrando el costado contrario.
 *
 *  El coche siempre ocupa la mitad opuesta al texto: nunca se pisan.
 * ------------------------------------------------------------------ */

type Key = {
  at: number;
  /** multiplicador de focal: alto = teleobjetivo, bajo = plano general */
  zoom: number;
  /** giro del coche, en grados */
  yaw: number;
  /** punto del coche que se queda en el centro del encuadre */
  anchor: Vec3;
  /** desplazamiento en pantalla, en fracción de ancho/alto */
  pan: [number, number];
};

/* El giro pasa POR EL FRENTE: 146° -> 90° (frontal recto) -> 34°. El coche
   acaba espejado pero siguiendo de cara, que es lo que muestra la referencia.
   Girar los 180° literales lo habría dejado de espaldas. */
const PATH: Key[] = [
  /* 1. La punta del frontal llena la mitad derecha */
  { at: 0.0, zoom: 1.95, yaw: 152, anchor: NOSE, pan: [0.3, 0.05] },
  /* 2. Se asienta, todavía en primer plano */
  { at: 0.24, zoom: 1.6, yaw: 150, anchor: NOSE, pan: [0.27, 0.04] },
  /* 3. Zoom out al coche entero, aún a la derecha */
  { at: 0.5, zoom: 0.88, yaw: 146, anchor: CENTER, pan: [0.24, 0.0] },
  /* 4. Empieza a girar, todavía a la derecha. Aquí ya no hay texto. */
  { at: 0.62, zoom: 1.0, yaw: 126, anchor: CENTER, pan: [0.2, 0.0] },
  /* 5. Cruza pasando por el frontal recto, con la pantalla para él solo */
  { at: 0.78, zoom: 1.3, yaw: 60, anchor: CENTER, pan: [-0.22, 0.04] },
  /* 6. Se acerca al encuadre de la referencia */
  { at: 0.9, zoom: 1.8, yaw: 60, anchor: FRONT, pan: [-0.27, 0.12] },
  /* 7. Reposo: 3/4 frontal espejado, grande y cortado por el borde izquierdo.
        Más cerca de 90° = más morro a la vista, que es lo que pide la
        referencia; 34° dejaba demasiado costado. */
  { at: 1.0, zoom: 2.1, yaw: 54, anchor: FRONT, pan: [-0.29, 0.14] },
];

const smooth = (x: number) => x * x * (3 - 2 * x);
const mix = (a: number, b: number, k: number) => a + (b - a) * k;

function sampleCamera(t: number): Key {
  let i = 0;
  while (i < PATH.length - 2 && t > PATH[i + 1].at) i += 1;
  const a = PATH[i];
  const b = PATH[i + 1];
  const k = smooth(Math.min(Math.max((t - a.at) / (b.at - a.at || 1), 0), 1));
  return {
    at: t,
    zoom: mix(a.zoom, b.zoom, k),
    yaw: mix(a.yaw, b.yaw, k),
    anchor: [
      mix(a.anchor[0], b.anchor[0], k),
      mix(a.anchor[1], b.anchor[1], k),
      mix(a.anchor[2], b.anchor[2], k),
    ],
    pan: [mix(a.pan[0], b.pan[0], k), mix(a.pan[1], b.pan[1], k)],
  };
}

/* ------------------------------------------------------------------ */

export function drawPlaceholder(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  /** 0 = primer fotograma, 1 = último */
  t: number,
) {
  ctx.clearRect(0, 0, w, h);

  const portrait = w < h;
  const cam = sampleCamera(t);

  /* En vertical el coche sube y la mitad de abajo queda para el texto. */
  const base = portrait ? w * 1.05 : Math.min(w * 0.66, h * 1.0);
  const focal = base * cam.zoom;
  const dist = 9;
  const cx = w / 2 + cam.pan[0] * w * (portrait ? 0.4 : 1);
  const cy = h * (portrait ? 0.3 : 0.52) + cam.pan[1] * h * 0.2;

  const rad = (cam.yaw * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  /** coche -> mundo (la cámara está en el origen mirando hacia +Z) */
  const toWorld = (v: Vec3): Vec3 => {
    const x = v[0] - cam.anchor[0];
    const y = v[1] - cam.anchor[1];
    const z = v[2] - cam.anchor[2];
    return [x * cos + z * sin, y, -x * sin + z * cos + dist];
  };

  /** mundo -> pantalla */
  const project = (p: Vec3): [number, number] => [
    cx + (p[0] / p[2]) * focal,
    cy - (p[1] / p[2]) * focal,
  ];

  const NEAR = 0.6;
  const world = VERTS.map(toWorld);
  const screen = world.map(project);

  /* ---------- Sombra en el suelo ----------
     Se desvanece con el zoom: en el primerísimo plano no debe verse. */
  const shadowAlpha = Math.max(0, Math.min(1, (1.6 - cam.zoom) / 0.8)) * 0.16;
  if (shadowAlpha > 0.01) {
    const c = toWorld([0, 0.02, 0]);
    const edge = toWorld([L, 0.02, 0]);
    if (c[2] > NEAR && edge[2] > NEAR) {
      const pc = project(c);
      const pe = project(edge);
      const gr = Math.min(Math.hypot(pe[0] - pc[0], pe[1] - pc[1]) * 1.25, Math.max(w, h));
      if (gr > 2 && Number.isFinite(pc[0]) && Number.isFinite(pc[1])) {
        const g = ctx.createRadialGradient(pc[0], pc[1], 0, pc[0], pc[1], gr);
        g.addColorStop(0, `rgba(${NEON},${shadowAlpha})`);
        g.addColorStop(1, `rgba(${NEON},0)`);
        ctx.save();
        ctx.translate(pc[0], pc[1]);
        ctx.scale(1, 0.26);
        ctx.translate(-pc[0], -pc[1]);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(pc[0], pc[1], gr, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }

  /* ---------- Piezas ordenadas por profundidad ----------
     Ruedas y caras entran en la misma lista para que una rueda delantera
     tape la carrocería y una trasera quede detrás. */
  type Piece = { z: number; draw: () => void };
  const pieces: Piece[] = [];

  /* Caras */
  for (const f of FACES) {
    const pts = f.idx.map((i) => world[i]);
    if (pts.some((p) => p[2] < NEAR)) continue;

    const [a, b, c] = pts;
    const u: Vec3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    const v: Vec3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    const n: Vec3 = [
      u[1] * v[2] - u[2] * v[1],
      u[2] * v[0] - u[0] * v[2],
      u[0] * v[1] - u[1] * v[0],
    ];
    const nl = Math.hypot(n[0], n[1], n[2]) || 1;
    const al = Math.hypot(a[0], a[1], a[2]) || 1;
    /* >0 cuando la cara mira a la cámara */
    const facing = -(n[0] * a[0] + n[1] * a[1] + n[2] * a[2]) / (nl * al);
    if (facing <= 0.02) continue;

    const lambert = Math.max(0, (n[0] * -0.35 + n[1] * 0.88 + n[2] * -0.32) / nl);
    const z = pts.reduce((s, p) => s + p[2], 0) / pts.length;
    const sp = f.idx.map((i) => screen[i]);

    pieces.push({
      z,
      draw: () => {
        ctx.beginPath();
        ctx.moveTo(sp[0][0], sp[0][1]);
        for (let i = 1; i < sp.length; i += 1) ctx.lineTo(sp[i][0], sp[i][1]);
        ctx.closePath();
        /* Relleno sólido: así el orden por profundidad realmente tapa lo de
           atrás y el coche se lee como volumen, no como alambre. */
        if (f.glass) {
          const g = Math.round(18 + lambert * 34);
          ctx.fillStyle = `rgb(${Math.round(g * 0.5)}, ${Math.round(g * 0.85)}, ${g + 14})`;
        } else {
          const g = Math.round(13 + lambert * 62 * f.tone);
          ctx.fillStyle = `rgb(${g}, ${g + 1}, ${g + 3})`;
        }
        ctx.fill();
        ctx.strokeStyle = `rgba(255,255,255,${(0.18 + facing * 0.3).toFixed(3)})`;
        ctx.lineWidth = Math.max(1, focal * 0.0011);
        ctx.stroke();
      },
    });
  }

  /* Ruedas como discos 3D: la perspectiva les da el escorzo correcto.
     El costado que mira a la cámara es el que tiene cos(yaw) < 0 en +Z. */
  const nearSide = Math.cos(rad) < 0 ? 1 : -1;
  const farWheels: (() => void)[] = [];
  const nearWheels: (() => void)[] = [];

  const SEG = 18;
  for (const wheel of WHEELS) {
    const ring: Vec3[] = [];
    for (let i = 0; i < SEG; i += 1) {
      const a = (i / SEG) * Math.PI * 2;
      ring.push([
        wheel.c[0] + Math.cos(a) * wheel.r,
        wheel.c[1] + Math.sin(a) * wheel.r,
        wheel.c[2],
      ]);
    }
    const rw = ring.map(toWorld);
    if (rw.some((p) => p[2] < NEAR)) continue;
    const rs = rw.map(project);

    const paint = () => {
      ctx.beginPath();
      ctx.moveTo(rs[0][0], rs[0][1]);
      for (let i = 1; i < rs.length; i += 1) ctx.lineTo(rs[i][0], rs[i][1]);
      ctx.closePath();
      ctx.fillStyle = "rgb(9, 10, 11)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.42)";
      ctx.lineWidth = Math.max(1, focal * 0.0016);
      ctx.stroke();
    };

    if (Math.sign(wheel.c[2]) === nearSide) nearWheels.push(paint);
    else farWheels.push(paint);
  }

  /* Ruedas del lado lejano, carrocería, y ruedas del lado cercano encima */
  farWheels.forEach((d) => d());
  pieces.sort((a, b) => b.z - a.z).forEach((p) => p.draw());
  nearWheels.forEach((d) => d());

  /* ---------- Firma de luz delantera ---------- */
  const lampA = toWorld([L * 0.95, H * 0.66, -W * 0.8]);
  const lampB = toWorld([L * 0.95, H * 0.66, W * 0.8]);
  if (lampA[2] > NEAR && lampB[2] > NEAR) {
    const a = project(lampA);
    const b = project(lampB);
    ctx.strokeStyle = `rgba(${NEON},0.9)`;
    ctx.lineWidth = Math.max(1.5, focal * 0.0024);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.stroke();
    ctx.lineCap = "butt";
  }
}
