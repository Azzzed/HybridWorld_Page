'use client';

import { useRef, useEffect, type CSSProperties, type ReactNode, type MouseEventHandler, type RefObject } from 'react';
import { SPECULAR_FRAG, SPECULAR_PAD, SPECULAR_VERT } from './specular-shader';
import { layoutSize } from '../layout-size';
import './SpecularButton.css';

type ButtonSize = 'sm' | 'md' | 'lg';

export interface SpecularButtonProps {
  children?: ReactNode;
  size?: ButtonSize;
  radius?: number;
  tint?: string;
  tintOpacity?: number;
  blur?: number;
  textColor?: string;
  lineColor?: string;
  baseColor?: string;
  intensity?: number;
  shineSize?: number;
  shineFade?: number;
  thickness?: number;
  speed?: number;
  followMouse?: boolean;
  proximity?: number;
  autoAnimate?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  /** Si se pasa, el componente se renderiza como <a> en vez de <button>.
      La mayoría de los CTA del sitio son enlaces. */
  href?: string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
}

interface ShaderProps {
  radius: number;
  lineColor: string;
  baseColor: string;
  intensity: number;
  shineSize: number;
  shineFade: number;
  thickness: number;
  speed: number;
  followMouse: boolean;
  proximity: number;
  autoAnimate: boolean;
}

// Mismo shader que el hover de las tarjetas de servicios (specular-shader.ts)
const PAD = SPECULAR_PAD;
const VERT = SPECULAR_VERT;
const FRAG = SPECULAR_FRAG;

/** Espera a que el navegador esté libre (o 300 ms donde no hay requestIdleCallback). */
const whenIdle = () =>
  new Promise<void>((done) =>
    'requestIdleCallback' in window ? window.requestIdleCallback(() => done(), { timeout: 2500 }) : setTimeout(done, 300)
  );

const SpecularButton = ({
  children = 'Get Started',
  size = 'lg',
  radius = 18,
  tint = '#ffffff',
  tintOpacity = 0,
  blur = 0,
  textColor = '#f5f5f5',
  lineColor = '#ffffff',
  baseColor = '#525252',
  intensity = 1,
  shineSize = 10,
  shineFade = 40,
  thickness = 1,
  speed = 0.35,
  followMouse = true,
  proximity = 250,
  autoAnimate = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  href,
  target,
  rel,
  ariaLabel
}: SpecularButtonProps) => {
  const btnRef = useRef<HTMLElement>(null);
  const fxRef = useRef<HTMLSpanElement>(null);
  const propsRef = useRef<ShaderProps>({} as ShaderProps);

  propsRef.current = { radius, lineColor, baseColor, intensity, shineSize, shineFade, thickness, speed, followMouse, proximity, autoAnimate };

  /*
   * El borde WebGL es una mejora progresiva: el botón llega en el HTML con un
   * borde CSS fijo (SpecularButton.css) y el lienzo se crea después, solo
   * cuando el botón está en pantalla y el navegador está libre. ogl se carga
   * en ese momento, fuera del bundle inicial, y el bucle de dibujo se pausa
   * cuando el botón sale de pantalla.
   */
  useEffect(() => {
    const btn = btnRef.current;
    const fx = fxRef.current;
    if (!btn || !fx) return;
    // Sin ratón (móviles, tabletas) el borde es CSS (SpecularButton.css): el
    // efecto sigue al cursor, y ahí no vale lo que cuesta un contexto WebGL
    // por botón.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let disposed = false;
    let started = false;
    let visible = false;
    let teardown: (() => void) | undefined;
    let resume: (() => void) | undefined;

    const init = async () => {
      started = true;
      await whenIdle();
      const { Renderer, Program, Mesh, Triangle, Color } = await import('ogl');
      if (disposed) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      let renderer: InstanceType<typeof Renderer>;
      try {
        renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: true, dpr });
      } catch {
        return; // sin WebGL se queda el borde CSS
      }
      const gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

      const geometry = new Triangle(gl);
      if (geometry.attributes.uv) delete geometry.attributes.uv;

      const program = new Program(gl, {
        vertex: VERT,
        fragment: FRAG,
        uniforms: {
          uCenter: { value: [0, 0] },
          uHalfSize: { value: [1, 1] },
          uRadius: { value: 0 },
          uAngle: { value: 2.4 },
          uPx: { value: dpr },
          uLineColor: { value: [1, 1, 1] },
          uBaseColor: { value: [0.32, 0.32, 0.32] },
          uIntensity: { value: 1 },
          uShineSize: { value: 0.17 },
          uShineFade: { value: 0.7 },
          uThickness: { value: 1 },

          uBaseWidth: { value: dpr }
        }
      });

      const mesh = new Mesh(gl, { geometry, program });
      fx.appendChild(gl.canvas);
      btn.classList.add('specular-button--ready');

      const sizeRef = { w: 1, h: 1 };
      const resize = () => {
        // Fractional size + explicit center keep the SDF pinned to the exact
        // CSS border, instead of drifting up to a pixel from offsetWidth rounding.
        // Tamaño de layout: no se encoge si una sección antepasada está escalada.
        const { w, h } = layoutSize(btn);
        sizeRef.w = w;
        sizeRef.h = h;
        renderer.setSize(w + PAD * 2, h + PAD * 2);
        program.uniforms.uCenter.value = [(PAD + w / 2) * dpr, (PAD + h / 2) * dpr];
        program.uniforms.uHalfSize.value = [(w / 2) * dpr, (h / 2) * dpr];
      };
      const ro = new ResizeObserver(resize);
      ro.observe(btn);
      resize();

      // Light angle steers toward the pointer (anywhere on the page) and falls
      // back to a slow sweep when the pointer hasn't moved yet.
      let pointerAngle: number | null = null;
      let proximityT = 0;
      const onPointerMove = (e: PointerEvent) => {
        if (!visible) return;
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = Math.max(rect.left - e.clientX, 0, e.clientX - rect.right);
        const dy = Math.max(rect.top - e.clientY, 0, e.clientY - rect.bottom);
        const dist = Math.hypot(dx, dy);
        // Over the button itself the light settles on the diagonal (framing the
        // corners) and gently sways with the cursor position within the button.
        if (dist === 0) {
          const nx = (e.clientX - cx) / (rect.width / 2);
          const ny = (cy - e.clientY) / (rect.height / 2);
          pointerAngle = Math.atan2(2 / rect.height, -2 / rect.width) + nx * 0.3 + ny * 0.15;
        } else {
          pointerAngle = Math.atan2(cy - e.clientY, e.clientX - cx);
        }
        const t = Math.max(0, 1 - dist / Math.max(propsRef.current.proximity, 1));
        proximityT = t * t * (3 - 2 * t);
      };
      window.addEventListener('pointermove', onPointerMove, { passive: true });

      let angle = 2.4;
      let idleAngle = 2.4;
      let bright = 0;
      let last = performance.now();
      let raf = 0;

      const lineC = new Color();
      const baseC = new Color();

      const update = (now: number) => {
        raf = visible ? requestAnimationFrame(update) : 0;
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        const p = propsRef.current;

        idleAngle += p.speed * dt;
        const target =
          p.followMouse && pointerAngle != null && (!p.autoAnimate || proximityT > 0) ? pointerAngle : idleAngle;
        const diff = ((target - angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
        angle += diff * (1 - Math.exp(-dt * 7));

        // Shine fades in with pointer proximity unless autoAnimate keeps it on
        const brightTarget = p.autoAnimate ? 1 : proximityT;
        bright += (brightTarget - bright) * (1 - Math.exp(-dt * 8));

        lineC.set(p.lineColor);
        baseC.set(p.baseColor);
        program.uniforms.uAngle.value = angle;
        program.uniforms.uRadius.value = Math.min(p.radius, Math.min(sizeRef.w, sizeRef.h) / 2) * dpr;
        program.uniforms.uLineColor.value = [lineC.r, lineC.g, lineC.b];
        program.uniforms.uBaseColor.value = [baseC.r, baseC.g, baseC.b];
        program.uniforms.uIntensity.value = p.intensity * bright;
        program.uniforms.uShineSize.value = (p.shineSize * Math.PI) / 180;
        program.uniforms.uShineFade.value = (p.shineFade * Math.PI) / 180;
        program.uniforms.uThickness.value = p.thickness * dpr;
        renderer.render({ scene: mesh });
      };

      resume = () => {
        if (raf) return;
        last = performance.now();
        raf = requestAnimationFrame(update);
      };
      if (visible) resume();

      teardown = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        window.removeEventListener('pointermove', onPointerMove);
        if (gl.canvas.parentNode === fx) fx.removeChild(gl.canvas);
        btn.classList.remove('specular-button--ready');
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      };
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (!visible) return;
        if (!started) void init();
        else resume?.();
      },
      { rootMargin: '120px' }
    );
    io.observe(btn);

    return () => {
      disposed = true;
      io.disconnect();
      teardown?.();
    };
  }, []);

  const shared = {
    className: `specular-button specular-button--${size}${className ? ` ${className}` : ''}`,
    style: {
      '--sb-radius': `${radius}px`,
      '--sb-tint': tint,
      '--sb-tint-opacity': tintOpacity,
      '--sb-blur': `${blur}px`,
      '--sb-text-color': textColor,
      '--sb-line': lineColor
    } as CSSProperties,
    'aria-label': ariaLabel
  };

  const inner = (
    <>
      <span ref={fxRef} className="specular-button__fx" aria-hidden="true" />
      <span className="specular-button__label">{children}</span>
    </>
  );

  if (href) {
    return (
      <a
        ref={btnRef as RefObject<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel ?? (target === '_blank' ? 'noreferrer noopener' : undefined)}
        onClick={onClick as unknown as MouseEventHandler<HTMLAnchorElement>}
        {...shared}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      ref={btnRef as RefObject<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      onClick={onClick}
      {...shared}
    >
      {inner}
    </button>
  );
};

export default SpecularButton;
