"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, MessageCircle, Phone, X } from "lucide-react";
import type { Locale } from "@/lib/business";
import { splitLocale } from "@/lib/i18n";
import { Cta } from "../ui/Cta";
import LangSwitch from "./LangSwitch";
import "../navbar.css";

export type HeaderProps = {
  locale: Locale;
  homeHref: string;
  brand: { logoMark: string; homeLabel: string };
  /** Las páginas del menú */
  nav: { href: string; label: string }[];
  phone: { display: string; tel: string };
  whatsapp: string;
  cta: { href: string; label: string };
  labels: { menuOpen: string; menuClose: string; call: string; whatsapp: string; switchLanguage: string; nav: string };
};

/**
 * Header del sitio.
 *
 * - Móvil: siempre visible, con llamar y WhatsApp a la vista.
 * - Escritorio, home: no está al cargar; entra cuando el hero sale de
 *   pantalla, para que el primer scroll sea solo el hero.
 * - Escritorio, resto de páginas: fijo arriba.
 */
export default function SiteHeader({ locale, homeHref, brand, nav, phone, whatsapp, cta, labels }: HeaderProps) {
  const pathname = usePathname() || "/";
  const isHome = splitLocale(pathname).path === "/";
  const [heroGone, setHeroGone] = useState(false);
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // El menú móvil se cierra al cambiar de página
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  // En la home, el header aparece cuando el hero (#top) deja de verse. El
  // observer avisa en cuanto empieza a observar, así que el estado inicial
  // también lo pone él.
  useEffect(() => {
    const hero = isHome ? document.getElementById("top") : null;
    if (!hero) return;
    const io = new IntersectionObserver(([entry]) => setHeroGone(!entry.isIntersecting), { threshold: 0 });
    io.observe(hero);
    return () => io.disconnect();
  }, [isHome]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="nav" data-hidden={isHome && !heroGone && !open}>
        <div className="shell nav__in">
          <Link href={homeHref} className="nav__brand" aria-label={brand.homeLabel}>
            <Image src={brand.logoMark} alt="" width={48} height={35} />
            <span>
              <strong>Hybrid World</strong>
              <em>Auto Repair</em>
            </span>
          </Link>

          <nav className="nav__links" aria-label={labels.nav}>
            {nav.map((item) => (
              <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined}>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="nav__actions">
            <a className="nav__phone" href={`tel:${phone.tel}`}>
              <Phone size={15} strokeWidth={2.2} />
              {phone.display}
            </a>
            <LangSwitch locale={locale} label={labels.switchLanguage} className="nav__lang" />
            <span className="nav__cta">
              <Cta href={cta.href} target="_blank" size="sm">
                {cta.label}
              </Cta>
            </span>

            {/* Móvil: llamar y WhatsApp siempre a la vista */}
            <a className="nav__icon" href={`tel:${phone.tel}`} aria-label={`${labels.call} ${phone.display}`}>
              <Phone size={19} strokeWidth={2} />
            </a>
            <a className="nav__icon nav__icon--wa" href={whatsapp} target="_blank" rel="noreferrer noopener" aria-label={labels.whatsapp}>
              <MessageCircle size={19} strokeWidth={2} />
            </a>
            <button
              className="nav__burger"
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? labels.menuClose : labels.menuOpen}
              aria-expanded={open}
              aria-controls="site-drawer"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <div className="drawer" id="site-drawer" data-open={open} inert={!open}>
        {nav.map((item, i) => (
          <Link key={item.href} href={item.href} onClick={() => setOpen(false)} style={{ transitionDelay: `${0.05 + i * 0.04}s` }}>
            {item.label}
          </Link>
        ))}
        <span className="drawer__cta">
          <Cta href={cta.href} target="_blank" onClick={() => setOpen(false)}>
            {cta.label}
          </Cta>
        </span>
        <a className="drawer__phone" href={`tel:${phone.tel}`}>
          <Phone size={16} /> {phone.display}
        </a>
        <LangSwitch locale={locale} label={labels.switchLanguage} className="drawer__lang" />
      </div>
    </>
  );
}
