import type { CSSProperties, ReactNode } from "react";

/**
 * Revelado al hacer scroll. Es solo una clase: RevealObserver (en el layout)
 * le pone `is-in` cuando entra en pantalla, y el CSS hace la transición.
 * El texto está en el HTML desde el principio; sin JavaScript se ve tal cual
 * (ui.css solo lo esconde con `scripting: enabled`).
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  /** segundos */
  delay?: number;
  className?: string;
  as?: "div" | "span" | "p";
}) {
  return (
    <Tag className={`reveal ${className}`.trim()} style={delay ? ({ "--reveal-delay": `${delay}s` } as CSSProperties) : undefined}>
      {children}
    </Tag>
  );
}
