import type { CSSProperties, ReactNode } from "react";
import "./marquee.css";

/**
 * Tira horizontal infinita, solo con CSS: la lista va dos veces y una
 * animación la desplaza de 0 a -50%, así el salto del bucle no se ve. Se
 * pausa con el cursor encima.
 *
 * Con prefers-reduced-motion no se detiene (lo pidió el cliente) pero va a
 * un tercio de velocidad (marquee.css).
 */
export default function Marquee({
  children,
  duration = 45,
  reverse = false,
  className = "",
  gap = 56,
}: {
  children: ReactNode;
  /** segundos por vuelta */
  duration?: number;
  reverse?: boolean;
  className?: string;
  gap?: number;
}) {
  return (
    <div className={`mq ${className}`} style={{ "--mq-duration": `${duration}s` } as CSSProperties}>
      <div className={`mq__track${reverse ? " mq__track--reverse" : ""}`}>
        {[0, 1].map((copy) => (
          <div
            className="mq__group"
            key={copy}
            aria-hidden={copy === 1 || undefined}
            inert={copy === 1 || undefined}
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
