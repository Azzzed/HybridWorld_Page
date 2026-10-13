"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { createSpecularFrame, type SpecularFrame, type SpecularLook } from "../specular-frame";

/**
 * Los efectos del MagicBento de ReactBits, aplicados sobre las tarjetas que
 * ya pintó el servidor (ServiceBento): partículas al pasar el cursor, un foco
 * que sigue al cursor por toda la rejilla, el borde que se enciende según la
 * cercanía, el imán que atrae la tarjeta, la onda al hacer clic y, en la
 * tarjeta con el cursor, el borde especular de los botones del sitio.
 *
 * Igual que antes:
 *  - gsap es el único dueño del `transform` de la tarjeta;
 *  - sin ratón (móvil, tabletas) se apagan los efectos de cursor; la onda al
 *    tocar se queda como respuesta al toque;
 *  - con prefers-reduced-motion solo se apaga lo que desplaza cosas
 *    (partículas e imán). La luz y el hover se quedan.
 */

const PARTICLES = 12;
const SPOTLIGHT_RADIUS = 300;

/** Efectos de cursor: solo con ratón y a partir del corte de móvil del original (768 px). */
const POINTER_QUERY = "(hover: hover) and (pointer: fine) and (min-width: 769px)";
const CALM_QUERY = "(prefers-reduced-motion: reduce)";

/** El borde de la tarjeta con el cursor encima: los valores de Cta (ui/Cta.tsx). */
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

const createParticle = (x: number, y: number, color: string) => {
  const el = document.createElement("span");
  el.className = "bento-particle";
  el.style.cssText = `left:${x}px;top:${y}px;background:rgba(${color},1);box-shadow:0 0 6px rgba(${color},.6)`;
  return el;
};

type CardOptions = {
  glowColor: string;
  pointerFx: boolean;
  motionFx: boolean;
  frame: { current: SpecularFrame | null };
};

/** Engancha los efectos a una tarjeta. Devuelve la función que los quita. */
function attachCard(el: HTMLElement, { glowColor, pointerFx, motionFx, frame }: CardOptions) {
  const sparks = el.querySelector<HTMLElement>(".bento-card__sparks");
  const fx = el.querySelector<HTMLElement>(".bento-card__fx");
  let live: HTMLElement[] = [];
  let timers: number[] = [];
  let hovered = false;
  let pool: HTMLElement[] = [];
  let magnet: gsap.core.Tween | null = null;

  const clearParticles = () => {
    timers.forEach(clearTimeout);
    timers = [];
    magnet?.kill();
    live.forEach((p) => {
      gsap.to(p, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "back.in(1.7)",
        onComplete: () => p.remove(),
      });
    });
    live = [];
  };

  const spawnParticles = () => {
    if (!hovered) return;
    if (!pool.length) {
      const { width, height } = el.getBoundingClientRect();
      pool = Array.from({ length: PARTICLES }, () => createParticle(Math.random() * width, Math.random() * height, glowColor));
    }
    pool.forEach((particle, i) => {
      const timer = window.setTimeout(() => {
        if (!hovered || !sparks) return;
        const clone = particle.cloneNode(true) as HTMLElement;
        sparks.appendChild(clone);
        live.push(clone);
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
      timers.push(timer);
    });
  };

  // El relleno negro crece desde donde entra el cursor y se recoge hacia
  // donde sale (magic-bento.css: .bento-card__fill)
  const fillFrom = (e: PointerEvent) => {
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--fill-x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--fill-y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  };

  const enter = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    fillFrom(e);
    if (!pointerFx) return;
    hovered = true;
    if (fx) frame.current?.attach(el, fx);
    if (motionFx) spawnParticles();
  };

  const leave = (e: PointerEvent) => {
    if (e.pointerType === "mouse") fillFrom(e);
    if (!hovered) return;
    hovered = false;
    frame.current?.release(el);
    clearParticles();
    gsap.to(el, { x: 0, y: 0, duration: 0.3, ease: "power2.out" });
  };

  const move = (e: PointerEvent) => {
    if (!motionFx || e.pointerType !== "mouse") return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    magnet = gsap.to(el, {
      x: (x - rect.width / 2) * 0.05,
      y: (y - rect.height / 2) * 0.05,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  // Onda que sale del punto del clic (o del toque) y cubre la tarjeta entera
  const click = (e: MouseEvent) => {
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
    (sparks ?? el).appendChild(ripple);
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
    timers.forEach(clearTimeout);
    live.forEach((p) => p.remove());
    gsap.killTweensOf(el);
    gsap.set(el, { x: 0, y: 0 });
  };
}

/** Foco que sigue al cursor por la rejilla y brillo de borde según la cercanía. */
function attachSpotlight(grid: HTMLElement, glowColor: string) {
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
  const proximity = SPOTLIGHT_RADIUS * 0.5;
  const fade = SPOTLIGHT_RADIUS * 0.75;
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
      card.style.setProperty("--glow-radius", `${SPOTLIGHT_RADIUS}px`);
    });

    gsap.to(spot, { left: e.clientX, top: e.clientY, duration: 0.1, ease: "power2.out" });
    const opacity = nearest <= proximity ? 0.8 : nearest <= fade ? ((fade - nearest) / (fade - proximity)) * 0.8 : 0;
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
}

export default function BentoEffects({ gridId, glowColor }: { gridId: string; glowColor: string }) {
  useEffect(() => {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    const pointer = window.matchMedia(POINTER_QUERY);
    const calm = window.matchMedia(CALM_QUERY);
    let cleanup: (() => void) | undefined;

    const setup = () => {
      cleanup?.();
      const pointerFx = pointer.matches;
      const motionFx = pointerFx && !calm.matches;
      const frame: { current: SpecularFrame | null } = { current: null };
      const undo: (() => void)[] = [];

      // Un solo borde especular para toda la rejilla. Sin WebGL, el CSS pinta
      // un borde verde fijo en su lugar (la clase avisa de cuál de los dos hay).
      if (pointerFx) {
        try {
          const created = createSpecularFrame(SPECULAR_LOOK);
          frame.current = created;
          grid.classList.add("bento-grid--specular");
          undo.push(() => {
            created.destroy();
            grid.classList.remove("bento-grid--specular");
          });
        } catch {
          /* sin WebGL */
        }
        undo.push(attachSpotlight(grid, glowColor));
      }

      grid.querySelectorAll<HTMLElement>(".bento-card").forEach((card) => {
        undo.push(attachCard(card, { glowColor, pointerFx, motionFx, frame }));
      });

      cleanup = () => undo.forEach((fn) => fn());
    };

    setup();
    pointer.addEventListener("change", setup);
    calm.addEventListener("change", setup);
    return () => {
      pointer.removeEventListener("change", setup);
      calm.removeEventListener("change", setup);
      cleanup?.();
    };
  }, [gridId, glowColor]);

  return null;
}
