import { locations, type Locale, type LocationSlug } from "@/lib/business";
import { hoursCompact } from "@/lib/i18n";
import type { BranchPageContent } from "../types";
import { mountainView } from "./mountain-view";

/**
 * Textos de las páginas de sucursal, por sede. Una sede con `hasPage` en
 * business.ts tiene que tener aquí sus textos.
 */
const PAGES: Partial<Record<LocationSlug, Record<Locale, BranchPageContent>>> = {
  "mountain-view": mountainView,
};

/** "A, B and C" / "A, B y C", sin coma antes de la última. */
const joinList = (items: string[], locale: Locale) =>
  items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} ${locale === "en" ? "and" : "y"} ${items[items.length - 1]}`;

/**
 * Los textos de la página de una sede con sus datos puestos: {phone},
 * {hours} y {areas} salen de business.ts, así que no se desincronizan.
 */
export function getBranchContent(slug: LocationSlug, locale: Locale): BranchPageContent | undefined {
  const raw = PAGES[slug]?.[locale];
  const l = locations.find((x) => x.slug === slug);
  if (!raw || !l) return undefined;

  const fill = (text: string) =>
    text
      .replace(/\{phone\}/g, l.phone.display)
      .replace(/\{hours\}/g, hoursCompact(l.hours, locale))
      .replace(/\{areas\}/g, joinList([l.city, ...l.nearby], locale));

  return {
    ...raw,
    description: fill(raw.description),
    hero: { ...raw.hero, callCta: fill(raw.hero.callCta) },
    faq: { ...raw.faq, items: raw.faq.items.map((item) => ({ q: fill(item.q), a: fill(item.a) })) },
  };
}

/**
 * Descripción de una sede para su nodo AutoRepair del JSON-LD: la propia de
 * su página si la tiene, para que el nodo diga lo mismo en todas las páginas;
 * si no, la que pasa cada página.
 */
export const shopDescription = (slug: LocationSlug, locale: Locale, fallback: string) =>
  PAGES[slug]?.[locale]?.schemaDescription ?? fallback;
