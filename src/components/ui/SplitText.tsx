import type { CSSProperties, ReactNode } from "react";

/**
 * Titular que entra letra por letra. El texto se renderiza entero en el
 * servidor; RevealObserver lo parte en letras al entrar en pantalla y el CSS
 * (ui.css) las anima con un retraso escalonado. Sin JavaScript se ve normal.
 *
 * Solo para titulares fijos de la home: React no debe volver a pintar este
 * texto después de partirlo.
 */
export default function SplitText({
  children,
  as: Tag = "h2",
  className,
  step = 18,
  id,
}: {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  /** ms entre letras */
  step?: number;
  id?: string;
}) {
  return (
    <Tag id={id} className={className} data-split="" style={{ "--split-step": `${step}ms` } as CSSProperties}>
      {children}
    </Tag>
  );
}
