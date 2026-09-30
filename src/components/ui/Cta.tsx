import type { MouseEventHandler, ReactNode } from "react";
import SpecularButton from "../reactbits/SpecularButton";
import "./cta.css";

/**
 * Botones del sitio.
 *
 * `Cta` (primario) es el SpecularButton de ReactBits con los valores del sitio:
 * esquinas rectas, fondo negro y el borde especular en el verde del logo.
 *
 * `CtaGhost` (secundario) replica la misma silueta con un contorno estático,
 * para que primario y secundario se lean como una familia.
 */

const NEON = "#12e06b";

type Common = {
  children: ReactNode;
  href?: string;
  target?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
};

export function Cta({
  children,
  href,
  target,
  onClick,
  size = "md",
  className = "",
  type = "button",
  ariaLabel,
}: Common) {
  return (
    <SpecularButton
      href={href}
      target={target}
      onClick={onClick}
      type={type}
      size={size}
      ariaLabel={ariaLabel}
      className={`cta ${className}`}
      /* Recto, como el resto del sitio */
      radius={0}
      tint="#0b0b0b"
      tintOpacity={0.85}
      blur={0}
      textColor="#eaf7ef"
      lineColor={NEON}
      baseColor="#1c1c1c"
      intensity={1.15}
      shineSize={70}
      shineFade={24}
      thickness={1.6}
      speed={0.55}
      followMouse
      proximity={150}
      autoAnimate
    >
      {children}
    </SpecularButton>
  );
}

export function CtaGhost({
  children,
  href,
  target,
  onClick,
  size = "md",
  className = "",
  type = "button",
}: Common) {
  const cls = `cta-ghost cta-ghost--${size} ${className}`;
  if (href) {
    return (
      <a
        className={cls}
        href={href}
        target={target}
        rel={target === "_blank" ? "noreferrer noopener" : undefined}
        onClick={onClick as MouseEventHandler<HTMLAnchorElement>}
      >
        {children}
      </a>
    );
  }
  return (
    <button className={cls} type={type} onClick={onClick as MouseEventHandler<HTMLButtonElement>}>
      {children}
    </button>
  );
}
