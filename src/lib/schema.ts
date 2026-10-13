import { SITE_URL, business, googleListingHref, locations, photos, services, type Locale, type Location } from "./business";
import { localePath } from "./i18n";

/**
 * Datos estructurados (schema.org, JSON-LD). Se arman con los mismos datos
 * que pinta el sitio (business.ts), así que no pueden contradecirlo.
 *
 * Sin reseñas ni `aggregateRating`: Google no admite marcado de reseñas
 * propias en negocios locales; las reseñas viven en las fichas de Google y
 * la página de reseñas las enlaza.
 */

const abs = (path: string) => new URL(path, SITE_URL).href;

/** Los @id son los mismos en los dos idiomas y en todas las páginas: es la misma entidad. */
const ORG_ID = abs("/#organization");
const CATALOG_ID = abs("/services#catalog");
const shopId = (l: Location) => abs(`/locations#${l.slug}`);

const allCities = () => locations.flatMap((l) => [l.city, ...l.nearby]).map((name) => ({ "@type": "City", name: `${name}, CA` }));

function organization(locale: Locale) {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: business.name,
    url: abs(localePath(locale, "/")),
    logo: { "@type": "ImageObject", url: abs(business.logo), width: 400, height: 400 },
    image: abs(photos.team.src),
    email: business.email,
    telephone: business.phone.tel,
    sameAs: [business.facebookUrl, ...locations.map(googleListingHref)],
    knowsLanguage: ["en", "es"],
    subOrganization: locations.map((l) => ({ "@id": shopId(l) })),
  };
}

function autoRepair(l: Location, locale: Locale, description: string) {
  return {
    "@type": "AutoRepair",
    "@id": shopId(l),
    name: `${business.name} — ${l.city}`,
    description,
    url: abs(`${localePath(locale, "/locations")}#${l.slug}`),
    image: abs(photos[l.photo].src),
    logo: abs(business.logo),
    telephone: l.phone.tel,
    email: business.email,
    priceRange: business.priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress: l.street,
      addressLocality: l.city,
      addressRegion: l.region,
      postalCode: l.postalCode,
      addressCountry: "US",
    },
    geo: { "@type": "GeoCoordinates", latitude: l.geo.lat, longitude: l.geo.lng },
    hasMap: googleListingHref(l),
    sameAs: [googleListingHref(l)],
    openingHoursSpecification: l.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    areaServed: [l.city, ...l.nearby].map((name) => ({ "@type": "City", name: `${name}, CA` })),
    knowsLanguage: ["en", "es"],
    parentOrganization: { "@id": ORG_ID },
    hasOfferCatalog: { "@id": CATALOG_ID },
  };
}

function catalog(locale: Locale) {
  return {
    "@type": "OfferCatalog",
    "@id": CATALOG_ID,
    name: locale === "en" ? "Hybrid vehicle services" : "Servicios para autos híbridos",
    url: abs(localePath(locale, "/services")),
    itemListElement: services.map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        "@id": abs(`/services#${s.id}`),
        name: s.name[locale],
        serviceType: s.name.en,
        description: s.short[locale],
        url: abs(`${localePath(locale, "/services")}#${s.id}`),
        image: abs(photos[s.photo].src),
        provider: [{ "@id": ORG_ID }, ...locations.map((l) => ({ "@id": shopId(l) }))],
        areaServed: allCities(),
      },
    })),
  };
}

/** Home: la empresa, el sitio, sus tres talleres y sus servicios. */
export function homeSchema(locale: Locale, shopDescription: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organization(locale),
      {
        "@type": "WebSite",
        "@id": abs("/#website"),
        url: abs(localePath(locale, "/")),
        name: business.name,
        inLanguage: locale,
        publisher: { "@id": ORG_ID },
      },
      ...locations.map((l) => autoRepair(l, locale, shopDescription)),
      catalog(locale),
    ],
  };
}

/** /locations: los tres talleres con todos sus datos. */
export function locationsSchema(locale: Locale, descriptions: Record<Location["slug"], string>) {
  return {
    "@context": "https://schema.org",
    "@graph": [organization(locale), ...locations.map((l) => autoRepair(l, locale, descriptions[l.slug]))],
  };
}

/** /services: el catálogo de servicios. */
export function servicesSchema(locale: Locale) {
  return { "@context": "https://schema.org", "@graph": [organization(locale), catalog(locale)] };
}

export function faqSchema(items: { q: string; a: string }[], locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export type Crumb = { name: string; path: string };

/** Migas: la primera es la home; `path` va sin idioma. */
export function breadcrumbSchema(crumbs: Crumb[], locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: abs(localePath(locale, c.path)),
    })),
  };
}
