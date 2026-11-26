"use client";

import { useRef } from "react";
import { preload } from "react-dom";
import { ArrowRight, MessageCircle, Phone, X } from "lucide-react";
import type { BranchPromo as Promo } from "@/content/types";
import "./branch-promo.css";

const DIALOG_ID = "branch-promo";

/**
 * Promoción de la sede: una franja arriba del hero que abre el flyer y, cada
 * vez que se carga la página, el flyer abierto antes que nada.
 *
 * Para que salga lo primero (sin esperar a que cargue React), un script en
 * línea justo después del diálogo lo abre mientras el navegador lee el HTML, y
 * la imagen se pide desde el <head> con prioridad alta. La página se regenera
 * una vez al día: si la promo termina entre medias, el mismo script no abre el
 * flyer y esconde la franja.
 */
export default function BranchPromo({
  promo,
  tel,
  whatsappHref,
}: {
  promo: Promo;
  tel: string;
  whatsappHref: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  const srcSet = `${promo.image.src600} 600w, ${promo.image.src900} 900w`;
  // Ancho con el que se ve: casi toda la pantalla en el teléfono, hasta 480 px
  const sizes = "(max-width: 520px) 92vw, 480px";
  // La imagen del flyer, pedida desde el <head> con prioridad alta: es lo primero que se ve
  preload(promo.image.src600, { as: "image", imageSrcSet: srcSet, imageSizes: sizes, fetchPriority: "high" });

  // Solo con datos propios del sitio (id del diálogo y fecha): nada que venga del usuario
  const boot = `(function(){var d=document.getElementById(${JSON.stringify(DIALOG_ID)});if(!d)return;if(Date.now()>Date.parse(${JSON.stringify(
    promo.until,
  )})){var b=document.querySelector("[data-promo-bar]");if(b)b.hidden=true;return}try{d.showModal()}catch(e){d.setAttribute("open","")}})()`;

  return (
    <>
      <div className="promo-bar" data-promo-bar data-track-area="promo-bar" suppressHydrationWarning>
        <button type="button" className="promo-bar__btn" onClick={open} aria-haspopup="dialog" aria-controls={DIALOG_ID}>
          <span className="promo-bar__text">{promo.bar.text}</span>
          <span className="promo-bar__cta">
            {promo.bar.cta} <ArrowRight size={15} strokeWidth={2.4} aria-hidden="true" />
          </span>
        </button>
      </div>

      <dialog
        ref={dialogRef}
        id={DIALOG_ID}
        className="promo"
        aria-labelledby="branch-promo-title"
        data-track-area="promo"
        // Clic en el fondo (fuera del flyer): cerrar
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        suppressHydrationWarning
      >
        <div className="promo__box">
          <h2 id="branch-promo-title" className="sr-only">
            {promo.dialog.title}
          </h2>
          <button type="button" className="promo__close" onClick={close} aria-label={promo.dialog.close} autoFocus>
            <X size={22} strokeWidth={2.4} aria-hidden="true" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="promo__img"
            src={promo.image.src600}
            srcSet={srcSet}
            sizes={sizes}
            alt={promo.alt}
            width={promo.image.width}
            height={promo.image.height}
            fetchPriority="high"
          />
          <div className="promo__actions">
            <a className="hero-scroll__btn promo__call" href={tel}>
              <Phone size={18} strokeWidth={2.2} aria-hidden="true" />
              {promo.dialog.call}
            </a>
            <a className="promo__wa" href={whatsappHref} target="_blank" rel="noreferrer noopener">
              <MessageCircle size={18} aria-hidden="true" /> WhatsApp
            </a>
          </div>
        </div>
      </dialog>
      <script dangerouslySetInnerHTML={{ __html: boot }} />
    </>
  );
}

