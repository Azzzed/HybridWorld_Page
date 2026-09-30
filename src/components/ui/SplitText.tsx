import { createElement, useEffect, useRef, type ReactNode } from "react";
import { animate, splitText, stagger } from "animejs";

/**
 * Revelado de texto carácter por carácter con anime.js v4 (`splitText`).
 * Cada letra entra rotando sobre el eje X -> el titular se "voltea" en 3D.
 */
type Props = {
  text: string;
  /**
   * Marcado en lugar de `text` (un salto de línea, una palabra en otro
   * color): `splitText` conserva la estructura. `text` sigue siendo el
   * mismo texto en plano.
   */
  children?: ReactNode;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  /** ms entre letras */
  step?: number;
  /** anima al entrar en viewport en lugar de al montar */
  onView?: boolean;
};

export default function SplitText({
  text,
  children,
  as = "h2",
  className,
  delay = 0,
  step = 18,
  onView = true,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* El título se monta con opacity 0 para poder revelarlo; pase lo que pase
       después, aquí ya queda visible: nunca debe quedarse un título en blanco. */
    el.style.opacity = "1";

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let splitter: ReturnType<typeof splitText>;
    try {
      splitter = splitText(el, {
        words: { class: "st-word" },
        chars: { class: "st-char" },
        accessible: true,
      });
    } catch {
      return; // sin animación, pero con el texto intacto
    }

    const play = () =>
      animate(splitter.chars, {
        opacity: [0, 1],
        y: ["0.5em", "0em"],
        duration: 700,
        delay: stagger(step, { start: delay }),
        ease: "out(3)",
      });

    let io: IntersectionObserver | undefined;
    if (onView) {
      io = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            play();
            io?.disconnect();
          }
        },
        { threshold: 0.2 },
      );
      io.observe(el);
    } else {
      play();
    }

    return () => {
      io?.disconnect();
      splitter.revert();
    };
  }, [text, delay, step, onView]);

  return createElement(
    as,
    { ref, className, style: { opacity: 0 } },
    children ?? text,
  );
}
