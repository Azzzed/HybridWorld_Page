"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Navigation, Phone } from "lucide-react";

type Action = { href: string; label: string };

/**
 * Barra fija de móvil en las páginas de sucursal: llamar (verde), WhatsApp y
 * cómo llegar, a partes iguales. Aparece cuando los botones del hero salen de
 * pantalla por arriba y se va al llegar al footer, que ya tiene los teléfonos.
 * En escritorio no se muestra (el header ya tiene el teléfono de la sede).
 */
export default function BranchCallBar({
  watch,
  label,
  call,
  whatsapp,
  directions,
}: {
  /** id del bloque de botones del hero */
  watch: string;
  label: string;
  call: Action;
  whatsapp: Action;
  directions: Action;
}) {
  const [heroGone, setHeroGone] = useState(false);
  const [footerIn, setFooterIn] = useState(false);

  useEffect(() => {
    const hero = document.getElementById(watch);
    const footer = document.querySelector("footer");
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) setHeroGone(!entry.isIntersecting && entry.boundingClientRect.top < 0);
        else setFooterIn(entry.isIntersecting);
      }
    });
    if (hero) io.observe(hero);
    if (footer) io.observe(footer);
    return () => io.disconnect();
  }, [watch]);

  const shown = heroGone && !footerIn;

  return (
    <nav className="bbar" aria-label={label} data-shown={shown} inert={!shown} data-track-area="branch-bar">
      <a className="bbar__btn bbar__btn--call" href={call.href}>
        <Phone size={18} strokeWidth={2.2} aria-hidden="true" />
        {call.label}
      </a>
      <a className="bbar__btn" href={whatsapp.href} target="_blank" rel="noreferrer noopener">
        <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
        {whatsapp.label}
      </a>
      <a className="bbar__btn" href={directions.href} target="_blank" rel="noreferrer noopener">
        <Navigation size={18} strokeWidth={2} aria-hidden="true" />
        {directions.label}
      </a>
    </nav>
  );
}
