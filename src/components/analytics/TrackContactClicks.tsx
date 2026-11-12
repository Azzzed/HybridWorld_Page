"use client";

import { useEffect } from "react";
import type { ContactEvent } from "@/lib/analytics";

type Shop = { slug: string; tel: string; whatsapp: string; placeId: string };

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/** De dónde vino el clic: header, footer, botón flotante o la sección de la página. */
function clickArea(link: Element) {
  const area = link.closest("[data-track-area], header, footer, section[id], main");
  if (!area) return "page";
  return area.getAttribute("data-track-area") ?? (area.id || area.tagName.toLowerCase());
}

/**
 * Escucha todos los clics del documento (un solo listener) y, cuando es un
 * enlace de contacto, empuja un evento al dataLayer de GTM:
 *
 *   phone_click · whatsapp_click · directions_click · email_click
 *
 * con `branch` (la sede, por el teléfono, el número de WhatsApp o el Place ID),
 * `click_area` y `link_url`. En GTM, cada evento es un activador de
 * "Evento personalizado" para las conversiones de Google Ads y GA4.
 */
export default function TrackContactClicks({ shops }: { shops: Shop[] }) {
  useEffect(() => {
    const byTel = new Map(shops.map((s) => [s.tel.replace(/\D/g, ""), s.slug]));
    const byWhatsapp = new Map(shops.map((s) => [s.whatsapp, s.slug]));
    const byPlace = new Map(shops.map((s) => [s.placeId, s.slug]));

    function classify(href: string): { event: ContactEvent; branch?: string } | null {
      if (href.startsWith("tel:")) return { event: "phone_click", branch: byTel.get(href.replace(/\D/g, "")) };
      if (href.startsWith("mailto:")) return { event: "email_click" };
      let url: URL;
      try {
        url = new URL(href, location.href);
      } catch {
        return null;
      }
      if (url.hostname === "wa.me") return { event: "whatsapp_click", branch: byWhatsapp.get(url.pathname.slice(1)) };
      if (url.hostname.endsWith("google.com") && url.pathname.startsWith("/maps/dir")) {
        return { event: "directions_click", branch: byPlace.get(url.searchParams.get("destination_place_id") ?? "") };
      }
      return null;
    }

    function onClick(e: MouseEvent) {
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      const hit = classify(href);
      if (!hit) return;
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: hit.event,
        branch: hit.branch ?? "general",
        click_area: clickArea(link),
        link_url: href,
        page_path: location.pathname,
      });
    }

    // Fase de captura: llega aunque algún componente detenga la propagación
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [shops]);

  return null;
}
