import { useEffect, useRef, type ReactNode } from "react";
import { animate, createScope, type Scope } from "animejs";
import "./marquee.css";

/**
 * Tira horizontal infinita. La lista se duplica y anime.js la desplaza
 * de 0% a -50%, así el salto del bucle no se ve.
 *
 * El movimiento es automático siempre. Con prefers-reduced-motion activo no
 * se detiene —el cliente lo pidió explícitamente— pero baja a un tercio de
 * velocidad, que es un desplazamiento apenas perceptible.
 */
export default function Marquee({
  children,
  duration = 45,
  reverse = false,
  className = "",
  gap = 56,
}: {
  children: ReactNode;
  duration?: number;
  reverse?: boolean;
  className?: string;
  gap?: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<Scope | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    scopeRef.current = createScope({ root }).add(() => {
      const track = root.querySelector<HTMLElement>(".mq__track");
      if (!track) return;

      const anim = animate(track, {
        x: reverse ? ["-50%", "0%"] : ["0%", "-50%"],
        duration: duration * (reduced ? 3000 : 1000),
        ease: "linear",
        loop: true,
      });

      const enter = () => anim.pause();
      const leave = () => anim.play();
      root.addEventListener("pointerenter", enter);
      root.addEventListener("pointerleave", leave);
      return () => {
        root.removeEventListener("pointerenter", enter);
        root.removeEventListener("pointerleave", leave);
      };
    });

    return () => scopeRef.current?.revert();
  }, [duration, reverse]);

  return (
    <div className={`mq ${className}`} ref={rootRef}>
      <div className="mq__track">
        {[0, 1].map((copy) => (
          <div
            className="mq__group"
            key={copy}
            aria-hidden={copy === 1}
            style={{ gap: `${gap}px`, paddingRight: `${gap}px` }}
          >
            {children}
          </div>
        ))}
      </div>
      <span className="mq__fade mq__fade--l" aria-hidden />
      <span className="mq__fade mq__fade--r" aria-hidden />
    </div>
  );
}
