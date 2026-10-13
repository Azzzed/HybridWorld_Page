"use client";

import { useEffect, useState } from "react";
import ScrollExpand from "./reactbits/ScrollExpand";
import { Cta } from "./ui/Cta";
import "./shop-reveal.css";

/**
 * ScrollExpand de ReactBits: la foto del equipo arranca como un marco
 * pequeño y se abre a pantalla completa conforme bajas.
 */
export default function ShopReveal({
  photo,
  title,
  hint,
  text,
  cta,
  ctaHref,
  label,
}: {
  photo: { src: string; width: number; height: number; alt: string };
  title: string;
  hint: string;
  text: string;
  cta: string;
  ctaHref: string;
  label: string;
}) {
  /* En móvil la pista de scroll se acorta: si no, la foto ocupa casi
     tres pantallas antes de dejar pasar a la siguiente sección. */
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const check = () => setCompact(window.innerWidth <= 760);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section className="shop-reveal" aria-label={label}>
      <ScrollExpand
        src={photo.src}
        width={photo.width}
        height={photo.height}
        alt={photo.alt}
        title={title}
        scrollHint={hint}
        /* Sin esto el componente mide la altura de su propio contenedor
           (que aquí es auto) y se queda en 0. */
        useWindowScroll
        startWidth={compact ? 76 : 38}
        startHeight={compact ? 38 : 52}
        startRadius={0}
        endRadius={0}
        mediaZoom={1.18}
        scrollDistance={compact ? 0.7 : 1.15}
        holdDistance={compact ? 0.15 : 0.35}
        overlayScrim={0.7}
        className="shop-reveal__frame"
      >
        <div className="shop-reveal__overlay">
          <p>{text}</p>
          <Cta href={ctaHref}>{cta}</Cta>
        </div>
      </ScrollExpand>
    </section>
  );
}
