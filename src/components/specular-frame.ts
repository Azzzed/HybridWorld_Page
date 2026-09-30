import { Color, Mesh, Program, Renderer, Triangle } from "ogl";
import { SPECULAR_FRAG, SPECULAR_PAD, SPECULAR_VERT } from "./reactbits/specular-shader";

/** Aspecto del borde. Para las tarjetas se usan los valores de los botones (Cta). */
export type SpecularLook = {
  lineColor: string;
  baseColor: string;
  intensity: number;
  /** Ancho de la raya de luz, en grados */
  shineSize: number;
  shineFade: number;
  thickness: number;
  /** Velocidad del barrido cuando el cursor no marca el ángulo */
  speed: number;
  radius: number;
};

export type SpecularFrame = {
  /** Lleva el borde a una tarjeta y lo enciende. `slot` es donde va el lienzo. */
  attach: (card: HTMLElement, slot: HTMLElement) => void;
  /** Lo apaga con un fundido; al terminar, el lienzo se retira de la tarjeta. */
  release: (card: HTMLElement) => void;
  destroy: () => void;
};

/**
 * El borde especular de los botones (SpecularButton), para una tarjeta cada
 * vez: un solo lienzo WebGL que se muda a la tarjeta que tiene el cursor.
 * Un lienzo por tarjeta sumaría seis contextos WebGL a los de los botones, y
 * pasados 16 el navegador empieza a tirar los más viejos.
 */
export function createSpecularFrame(look: SpecularLook): SpecularFrame {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: true, dpr });
  const gl = renderer.gl;
  gl.clearColor(0, 0, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  const geometry = new Triangle(gl);
  if (geometry.attributes.uv) delete geometry.attributes.uv;

  const line = new Color(look.lineColor);
  const base = new Color(look.baseColor);
  const program = new Program(gl, {
    vertex: SPECULAR_VERT,
    fragment: SPECULAR_FRAG,
    uniforms: {
      uCenter: { value: [0, 0] },
      uHalfSize: { value: [1, 1] },
      uRadius: { value: look.radius * dpr },
      uAngle: { value: 2.4 },
      uPx: { value: dpr },
      uLineColor: { value: [line.r, line.g, line.b] },
      uBaseColor: { value: [base.r, base.g, base.b] },
      uIntensity: { value: 0 },
      uShineSize: { value: (look.shineSize * Math.PI) / 180 },
      uShineFade: { value: (look.shineFade * Math.PI) / 180 },
      uThickness: { value: look.thickness * dpr },
      uBaseWidth: { value: dpr },
    },
  });
  const mesh = new Mesh(gl, { geometry, program });
  const canvas = gl.canvas as HTMLCanvasElement;
  canvas.className = "bento-card__specular";

  let host: HTMLElement | null = null;
  let pointerAngle: number | null = null;
  let angle = 2.4;
  let idle = 2.4;
  let bright = 0;
  let target = 0;
  let raf = 0;
  let last = 0;

  // Tamaño fraccionario y centro explícito, como en el botón: así el trazo
  // cae justo sobre el borde de la tarjeta
  const resize = () => {
    if (!host) return;
    const { width: w, height: h } = host.getBoundingClientRect();
    renderer.setSize(w + SPECULAR_PAD * 2, h + SPECULAR_PAD * 2);
    program.uniforms.uCenter.value = [(SPECULAR_PAD + w / 2) * dpr, (SPECULAR_PAD + h / 2) * dpr];
    program.uniforms.uHalfSize.value = [(w / 2) * dpr, (h / 2) * dpr];
  };
  const observer = new ResizeObserver(resize);

  // Encima de la tarjeta, la luz se asienta en la diagonal y se mece un poco
  // con el cursor; es la misma cuenta que hace el botón
  const onPointerMove = (e: PointerEvent) => {
    if (!host) return;
    const r = host.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (inside) {
      const nx = (e.clientX - cx) / (r.width / 2);
      const ny = (cy - e.clientY) / (r.height / 2);
      pointerAngle = Math.atan2(2 / r.height, -2 / r.width) + nx * 0.3 + ny * 0.15;
    } else {
      pointerAngle = Math.atan2(cy - e.clientY, e.clientX - cx);
    }
  };
  window.addEventListener("pointermove", onPointerMove);

  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
    canvas.remove();
    if (host) observer.unobserve(host);
    host = null;
  };

  const tick = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    idle += look.speed * dt;
    const goal = pointerAngle ?? idle;
    const diff = ((goal - angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
    angle += diff * (1 - Math.exp(-dt * 7));
    bright += (target - bright) * (1 - Math.exp(-dt * 8));

    program.uniforms.uAngle.value = angle;
    program.uniforms.uIntensity.value = look.intensity * bright;
    renderer.render({ scene: mesh });

    if (target === 0 && bright < 0.01) {
      stop();
      return;
    }
    raf = requestAnimationFrame(tick);
  };

  const start = () => {
    if (raf) return;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  };

  return {
    attach(card, slot) {
      if (host && host !== card) observer.unobserve(host);
      host = card;
      slot.appendChild(canvas);
      observer.observe(card);
      resize();
      target = 1;
      start();
    },
    release(card) {
      if (host !== card) return;
      target = 0;
      start();
    },
    destroy() {
      stop();
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
