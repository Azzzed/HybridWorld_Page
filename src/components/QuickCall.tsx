"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, Phone, X } from "lucide-react";
import { splitLocale } from "@/lib/i18n";
import "./quickcall.css";

export type QuickCallProps = {
  shops: { slug: string; city: string; phone: { display: string; tel: string } }[];
  whatsapp: string;
  labels: { open: string; close: string; title: string; whatsapp: string };
  /**
   * Páginas de sucursal (ruta sin idioma). En ellas la sede va primero, el
   * WhatsApp es el suyo y, en móvil, el botón se oculta: la página trae su
   * propia barra de contacto (BranchCallBar).
   */
  branches?: { path: string; slug: string; whatsapp: string; whatsappLabel: string }[];
};

/**
 * Botón flotante: llamar a la sucursal que elijas o escribir por WhatsApp.
 * Aparece después del primer tramo de la página y se va al llegar al final
 * (donde ya está el footer con los teléfonos).
 */
export default function QuickCall({ shops: allShops, whatsapp: siteWhatsapp, labels, branches }: QuickCallProps) {
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false);
  const { path } = splitLocale(usePathname() || "/");
  const branch = branches?.find((b) => b.path === path);
  const shops = branch
    ? [...allShops.filter((s) => s.slug === branch.slug), ...allShops.filter((s) => s.slug !== branch.slug)]
    : allShops;
  const whatsapp = branch?.whatsapp ?? siteWhatsapp;
  const whatsappLabel = branch?.whatsappLabel ?? labels.whatsapp;

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      setShown(progress > 0.08 && progress < 0.97);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Si el botón se esconde, el menú se cierra con él
  const menuOpen = open && shown;

  return (
    <div className="qc" data-shown={shown} data-branch-page={branch ? true : undefined} inert={!shown} data-track-area="quick-call">
      <ul className="qc__menu" data-open={menuOpen} inert={!menuOpen} id="quick-call-menu">
        <li className="qc__head">{labels.title}</li>
        {shops.map((s) => (
          <li key={s.slug}>
            <a href={`tel:${s.phone.tel}`}>
              <Phone size={15} />
              <span>
                <strong>{s.city}</strong>
                <em>{s.phone.display}</em>
              </span>
            </a>
          </li>
        ))}
        <li>
          <a className="qc__wa-row" href={whatsapp} target="_blank" rel="noreferrer noopener">
            <MessageCircle size={15} />
            <span>
              <strong>{whatsappLabel}</strong>
            </span>
          </a>
        </li>
      </ul>

      <button
        className={`qc__fab ${menuOpen ? "is-open" : ""}`}
        type="button"
        onClick={() => setOpen(!menuOpen)}
        aria-expanded={menuOpen}
        aria-controls="quick-call-menu"
        aria-label={menuOpen ? labels.close : labels.open}
      >
        {menuOpen ? <X size={21} /> : <Phone size={20} />}
        <span className="qc__ring" aria-hidden />
      </button>
    </div>
  );
}
