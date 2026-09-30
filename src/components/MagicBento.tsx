import { useCallback, useEffect, useRef, useSyncExternalStore, type CSSProperties, type ReactNode, type RefObject } from "react";
import { gsap } from "gsap";
import { ArrowRight, Tag } from "lucide-react";
import { createSpecularFrame, type SpecularFrame, type SpecularLook } from "./specular-frame";
import "./magic-bento.css";

/**
 * MagicBento — el componente de ReactBits (MagicBento-JS-CSS) en TypeScript.
 *
 * Conserva sus efectos: partículas al pasar el cursor, un foco que sigue al
 * cursor por toda la rejilla, el borde que se enciende según la cercanía, el
 * imán que atrae la tarjeta hacia el cursor, la onda al hacer clic y la
 * inclinación 3D (apagada, como en el original). Al pasar el cursor, además,
 * la foto se tapa de negro, el borde pasa a ser el especular de los botones
 * del sitio (specular-frame.ts) y aparecen la descripción y el enlace.
 *
 * Cambios respecto al original:
 *  - las tarjetas llegan por props, con foto, etiqueta, insignia y enlace;
 *  - paleta del sitio (el verde del logo) y esquinas rectas;
 *  - gsap es el único dueño del `transform` de la tarjeta: el CSS no mueve
 *    nada en :hover, que es lo que hacía saltar la tarjeta con el imán;
 *  - sin ratón (móvil, tabletas) se apagan los efectos de cursor; la onda al
 *    tocar se queda como respuesta al toque;
 *  - con prefers-reduced-motion solo se apaga lo que desplaza cosas
 *    (partículas, imán, inclinación). El original no mira esa preferencia.
 */

const DEFAULT_GLOW = "18, 224, 107";
const DEFAULT_PARTICLES = 12;
const DEFAULT_RADIUS = 300;

/** Efectos de cursor: solo con ratón y a partir del corte de móvil del original (768 px). */
const POINTER_QUERY = "(hover: hover) and (pointer: fine) and (min-width: 769px)";
const CALM_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Borde de la tarjeta con el cursor encima: el mismo borde especular de los
 * botones del sitio (los valores de Cta en ui/Cta.tsx).
 */
const SPECULAR_LOOK: SpecularLook = {
  lineColor: "#12e06b",
  baseColor: "#1c1c1c",
  intensity: 1.15,
  shineSize: 70,
  shineFade: 24,
  thickness: 1.6,
  speed: 0.55,
  radius: 0,
};

export type BentoCard = {
  id: string;
  /** Hueco en la rejilla de escritorio: grande (2/3), mediana (1/3) o pequeña (1/4) */
  size: "lg" | "md" | "sm";
  label: string;
  title: string;
  description: string;
  icon: ReactNode;
  /** El icono va sobre un cuadro verde sólido: la especialidad del taller */
  accent?: boolean;
  image: {
    src: string;
    srcSet: string;
    sizes: string;
    alt: string;
    width: number;
    height: number;
    /** object-position de la foto */
    focus: string;
  };
  badge?: string;
  link: { href: string; label: string; ariaLabel: string };
};

function useMedia(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

const createParticle = (x: number, y: number, color: string) => {
  const el = document.createElement("span");
  el.className = "bento-particle";
  el.style.cssText = `left:${x}px;top:${y}px;background:rgba(${color},1);box-shadow:0 0 6px rgba(${color},.6)`;
  return el;
};

/* ---------------- Tarjeta ---------------- */

function ParticleCard({
  card,
  glowColor,
  particleCount,
  pointerFx,
  motionFx,
  frame,
  enableStars,
  enableTilt,
  enableMagnetism,
  clickEffect,
}: {
  card: BentoCard;
  glowColor: string;
  particleCount: number;
  /** Hay ratón: relleno negro, borde especular y demás efectos de luz */
  pointerFx: boolean;
  /** Además no se pidió reducir el movimiento: partículas, imán e inclinación */
  motionFx: boolean;
  /** El borde especular que comparten todas las tarjetas */
  frame: RefObject<SpecularFrame | null>;
  enableStars: boolean;
  enableTilt: boolean;
  enableMagnetism: boolean;
  clickEffect: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  /** Capa de partículas y ondas, por encima del texto y recortada a la tarjeta */
  const sparks = useRef<HTMLSpanElement>(null);
  /** Hueco del lienzo del borde especular: sobresale de la tarjeta */
  const fx = useRef<HTMLSpanElement>(null);
  const live = useRef<HTMLElement[]>([]);
  const timers = useRef<number[]>([]);
  const hovered = useRef(false);
  const pool = useRef<HTMLElement[]>([]);
  const ready = useRef(false);
  const magnet = useRef<gsap.core.Tween | null>(null);

  const clearParticles = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    magnet.current?.kill();
    live.current.forEach((p) => {
      gsap.to(p, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "back.in(1.7)",
        onComplete: () => p.parentNode?.removeChild(p),
      });
    });
    live.current = [];
  }, []);

  const spawnParticles = useCallback(() => {
    const el = ref.current;
    if (!el || !hovered.current) return;

    if (!ready.current) {
      const { width, height } = el.getBoundingClientRect();
      pool.current = Array.from({ length: particleCount }, () =>
        createParticle(Math.random() * width, Math.random() * height, glowColor),
      );
      ready.current = true;
    }

    pool.current.forEach((particle, i) => {
      const timer = window.setTimeout(() => {
        if (!hovered.current || !sparks.current) return;
        const clone = particle.cloneNode(true) as HTMLElement;
        sparks.current.appendChild(clone);
        live.current.push(clone);
        gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" });
        gsap.to(clone, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: "none",
          repeat: -1,
          yoyo: true,
        });
        gsap.to(clone, { opacity: 0.3, duration: 1.5, ease: "power2.inOut", repeat: -1, yoyo: true });
      }, i * 100);
      timers.current.push(timer);
    });
  }, [particleCount, glowColor]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // El relleno negro crece desde donde entra el cursor y se recoge hacia
    // donde sale (services: .bento-card__fill)
    const fillFrom = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--fill-x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
      el.style.setProperty("--fill-y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
    };

    const enter = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      fillFrom(e);
      if (!pointerFx) return;
      hovered.current = true;
      if (fx.current) frame.current?.attach(el, fx.current);
      if (!motionFx) return;
      if (enableStars) spawnParticles();
      if (enableTilt) {
        gsap.to(el, { rotateX: 5, rotateY: 5, duration: 0.3, ease: "power2.out", transformPerspective: 1000 });
      }
    };

    const leave = (e: PointerEvent) => {
      if (e.pointerType === "mouse") fillFrom(e);
      if (!hovered.current) return;
      hovered.current = false;
      frame.current?.release(el);
      clearParticles();
      if (enableTilt) gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.3, ease: "power2.out" });
      if (enableMagnetism) gsap.to(el, { x: 0, y: 0, duration: 0.3, ease: "power2.out" });
    };

    const move = (e: PointerEvent) => {
      if (!motionFx || e.pointerType !== "mouse" || (!enableTilt && !enableMagnetism)) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      if (enableTilt) {
        gsap.to(el, {
          rotateX: ((y - cy) / cy) * -10,
          rotateY: ((x - cx) / cx) * 10,
          duration: 0.1,
          ease: "power2.out",
          transformPerspective: 1000,
        });
      }
      if (enableMagnetism) {
        magnet.current = gsap.to(el, { x: (x - cx) * 0.05, y: (y - cy) * 0.05, duration: 0.3, ease: "power2.out" });
      }
    };

    // Onda que sale del punto del clic (o del toque) y cubre la tarjeta entera
    const click = (e: MouseEvent) => {
      if (!clickEffect) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const reach = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height),
      );
      const ripple = document.createElement("span");
      ripple.className = "bento-ripple";
      ripple.style.cssText = `width:${reach * 2}px;height:${reach * 2}px;left:${x - reach}px;top:${y - reach}px;background:radial-gradient(circle,rgba(${glowColor},.4) 0%,rgba(${glowColor},.2) 30%,transparent 70%)`;
      (sparks.current ?? el).appendChild(ripple);
      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        { scale: 1, opacity: 0, duration: 0.8, ease: "power2.out", onComplete: () => ripple.remove() },
      );
    };

    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("pointercancel", leave);
    el.addEventListener("pointermove", move);
    el.addEventListener("click", click);

    return () => {
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("pointercancel", leave);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("click", click);
      // El borde especular no se suelta aquí: este efecto solo se rehace si
      // cambia pointerFx, y entonces la rejilla lo destruye entero
      hovered.current = false;
      timers.current.forEach(clearTimeout);
      timers.current = [];
      live.current.forEach((p) => p.parentNode?.removeChild(p));
      live.current = [];
      gsap.killTweensOf(el);
      gsap.set(el, { x: 0, y: 0, rotateX: 0, rotateY: 0 });
    };
  }, [pointerFx, motionFx, frame, enableStars, enableTilt, enableMagnetism, clickEffect, glowColor, spawnParticles, clearParticles]);

  const { image } = card;

  return (
    <article
      ref={ref}
      className={`bento-card bento-card--${card.size}`}
      style={{ "--glow-color": glowColor } as CSSProperties}
    >
      <header className="bento-card__head">
        <span className={`bento-card__icon${card.accent ? " bento-card__icon--accent" : ""}`} aria-hidden="true">
          {card.icon}
        </span>
        <span className="bento-card__label">{card.label}</span>
      </header>

      <div className="bento-card__body">
        <h3 className="bento-card__title">{card.title}</h3>
        {card.badge && (
          <p className="bento-card__badge">
            <Tag size={14} strokeWidth={2.4} aria-hidden="true" />
            {card.badge}
          </p>
        )}
        {/* Con ratón, la descripción y el enlace aparecen al pasar por encima */}
        <div className="bento-card__more">
          <div className="bento-card__more-inner">
            <p className="bento-card__desc">{card.description}</p>
            <a
              className="bento-card__link"
              href={card.link.href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={card.link.ariaLabel}
            >
              {card.link.label}
              <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      {/* La foto va al final: se lee primero el título y después su descripción.
          Encima de ella, el negro que la tapa en el hover. */}
      <div className="bento-card__clip">
        <div className="bento-card__media">
          <img
            src={image.src}
            srcSet={image.srcSet}
            sizes={image.sizes}
            alt={image.alt}
            width={image.width}
            height={image.height}
            loading="lazy"
            decoding="async"
            style={{ objectPosition: image.focus }}
          />
        </div>
        <div className="bento-card__fill" />
      </div>
      <span className="bento-card__sparks" ref={sparks} aria-hidden="true" />
      <span className="bento-card__fx" ref={fx} aria-hidden="true" />
    </article>
  );
}

/* ---------------- Foco global que sigue al cursor ---------------- */

function useGlobalSpotlight(
  gridRef: RefObject<HTMLDivElement | null>,
  enabled: boolean,
  radius: number,
  glowColor: string,
) {
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || !enabled) return;

    const spot = document.createElement("div");
    spot.className = "bento-spotlight";
    spot.style.background = `radial-gradient(circle,
      rgba(${glowColor},0.15) 0%,
      rgba(${glowColor},0.08) 15%,
      rgba(${glowColor},0.04) 25%,
      rgba(${glowColor},0.02) 40%,
      rgba(${glowColor},0.01) 65%,
      transparent 70%)`;
    document.body.appendChild(spot);

    // Como en el original: a media distancia del radio la tarjeta brilla
    // entera, y se apaga del todo a tres cuartos
    const proximity = radius * 0.5;
    const fade = radius * 0.75;
    const cards = () => Array.from(grid.querySelectorAll<HTMLElement>(".bento-card"));

    const reset = () => {
      gsap.to(spot, { opacity: 0, duration: 0.3, ease: "power2.out" });
      cards().forEach((c) => c.style.setProperty("--glow-intensity", "0"));
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = grid.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) {
        reset();
        return;
      }

      let nearest = Infinity;
      cards().forEach((card) => {
        const cr = card.getBoundingClientRect();
        const distance = Math.max(
          0,
          Math.hypot(e.clientX - (cr.left + cr.width / 2), e.clientY - (cr.top + cr.height / 2)) -
            Math.max(cr.width, cr.height) / 2,
        );
        nearest = Math.min(nearest, distance);
        const glow = distance <= proximity ? 1 : distance <= fade ? (fade - distance) / (fade - proximity) : 0;
        card.style.setProperty("--glow-x", `${((e.clientX - cr.left) / cr.width) * 100}%`);
        card.style.setProperty("--glow-y", `${((e.clientY - cr.top) / cr.height) * 100}%`);
        card.style.setProperty("--glow-intensity", glow.toFixed(3));
        card.style.setProperty("--glow-radius", `${radius}px`);
      });

      gsap.to(spot, { left: e.clientX, top: e.clientY, duration: 0.1, ease: "power2.out" });
      const opacity =
        nearest <= proximity ? 0.8 : nearest <= fade ? ((fade - nearest) / (fade - proximity)) * 0.8 : 0;
      gsap.to(spot, { opacity, duration: opacity > 0 ? 0.2 : 0.5, ease: "power2.out" });
    };

    document.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", reset);
    window.addEventListener("blur", reset);

    return () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", reset);
      window.removeEventListener("blur", reset);
      gsap.killTweensOf(spot);
      spot.remove();
      cards().forEach((c) => c.style.setProperty("--glow-intensity", "0"));
    };
  }, [gridRef, enabled, radius, glowColor]);
}

/* ---------------- Rejilla ---------------- */

export default function MagicBento({
  cards,
  glowColor = DEFAULT_GLOW,
  spotlightRadius = DEFAULT_RADIUS,
  particleCount = DEFAULT_PARTICLES,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  enableTilt = false,
  enableMagnetism = true,
  clickEffect = true,
}: {
  cards: BentoCard[];
  glowColor?: string;
  spotlightRadius?: number;
  particleCount?: number;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  clickEffect?: boolean;
}) {
  const gridRef = useRef<HTMLDivElement>(null);
  const frame = useRef<SpecularFrame | null>(null);
  const hasPointer = useMedia(POINTER_QUERY);
  const calm = useMedia(CALM_QUERY);
  // Con "reducir movimiento" (en Windows, los efectos de animación apagados)
  // se quedan la luz y el hover —el negro, el borde de los botones, la
  // información—, que solo responden al cursor, como los botones del sitio.
  // Se apaga lo que desplaza cosas: partículas, imán e inclinación.
  const pointerFx = hasPointer;
  const motionFx = hasPointer && !calm;

  useGlobalSpotlight(gridRef, enableSpotlight && pointerFx, spotlightRadius, glowColor);

  // Un solo borde especular para toda la rejilla. Sin WebGL, el CSS pinta un
  // borde verde fijo en su lugar (la clase avisa de cuál de los dos hay).
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || !pointerFx) return;
    let created: SpecularFrame;
    try {
      created = createSpecularFrame(SPECULAR_LOOK);
    } catch {
      return;
    }
    frame.current = created;
    grid.classList.add("bento-grid--specular");
    return () => {
      created.destroy();
      frame.current = null;
      grid.classList.remove("bento-grid--specular");
    };
  }, [pointerFx]);

  return (
    <div className={`bento-grid${enableBorderGlow ? " bento-grid--glow" : ""}`} ref={gridRef}>
      {cards.map((card) => (
        <ParticleCard
          key={card.id}
          card={card}
          glowColor={glowColor}
          particleCount={particleCount}
          pointerFx={pointerFx}
          motionFx={motionFx}
          frame={frame}
          enableStars={enableStars}
          enableTilt={enableTilt}
          enableMagnetism={enableMagnetism}
          clickEffect={clickEffect}
        />
      ))}
    </div>
  );
}
