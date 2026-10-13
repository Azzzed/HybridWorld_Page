import { fullAddress, locations, type Locale } from "@/lib/business";
import { hoursSummary } from "@/lib/i18n";
import { en } from "./en";
import { es } from "./es";
import type { FaqItem, SiteContent } from "./types";

const CONTENT: Record<Locale, SiteContent> = { en, es };

export const getContent = (locale: Locale) => CONTENT[locale];

const CLOSED: Record<Locale, string> = { en: "closed the rest of the week", es: "cerrado el resto de la semana" };

/**
 * Las preguntas frecuentes con los datos del negocio puestos: el horario y
 * las direcciones de cada sede salen de business.ts, no del texto, para que
 * no se desincronicen.
 */
export function faqItems(locale: Locale): FaqItem[] {
  const hours = locations.map((l) => `${l.city}: ${hoursSummary(l.hours, locale)}`).join(". ") + ` (${CLOSED[locale]}).`;
  const addresses = locations.map((l) => fullAddress(l)).join(" · ");
  return CONTENT[locale].faq.map((item) => ({
    q: item.q,
    a: item.a.replace("{hours}", hours).replace("{addresses}", addresses),
  }));
}
