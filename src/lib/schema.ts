import {
  SITE_URL,
  business,
  googleListingHref,
  locationPagePath,
  locations,
  photos,
  services,
  socialLinks,
  type Locale,
  type Location,
} from "./business";
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
const WEBSITE_ID = abs("/#website");

/** La página de la sede si tiene una; si no, su sección de /locations. */
const shopUrl = (l: Location, locale: Locale) =>
  abs(l.hasPage ? localePath(locale, locationPagePath(l)) : `${localePath(locale, "/locations")}#${l.slug}`);

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
    // Mismo nombre que la ficha de Google; la sede se distingue por @id, dirección y teléfono
    name: business.name,
    branchCode: l.slug,
    description,
    url: shopUrl(l, locale),
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
    // La ficha de Google y las redes propias de la sede
    sameAs: [googleListingHref(l), ...socialLinks(l).map((s) => s.url)],
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

function website(locale: Locale) {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: abs(localePath(locale, "/")),
    name: business.name,
    inLanguage: locale,
    publisher: { "@id": ORG_ID },
  };
}

/** Home: la empresa, el sitio, sus tres talleres y sus servicios. */
export function homeSchema(locale: Locale, descriptions: Record<Location["slug"], string>) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organization(locale),
      website(locale),
      ...locations.map((l) => autoRepair(l, locale, descriptions[l.slug])),
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

/**
 * Página de una sede (/locations/<slug>): la empresa, el sitio, la sede, la
 * página (WebPage, que trata de la sede) y sus migas. Cada @id una sola vez.
 */
export function branchPageSchema(
  l: Location,
  locale: Locale,
  page: { title: string; description: string; shopDescription: string; crumbs: Crumb[] },
) {
  const url = abs(localePath(locale, locationPagePath(l)));
  return {
    "@context": "https://schema.org",
    "@graph": [
      organization(locale),
      website(locale),
      autoRepair(l, locale, page.shopDescription),
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: page.title,
        description: page.description,
        inLanguage: locale,
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": shopId(l) },
        mainEntity: { "@id": shopId(l) },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: page.crumbs.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.name,
          item: abs(localePath(locale, c.path)),
        })),
      },
    ],
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
