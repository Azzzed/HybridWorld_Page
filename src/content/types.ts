import type { LocationSlug, ServiceId } from "@/lib/business";

/**
 * Forma del contenido de cada idioma. en.ts y es.ts la cumplen entera, así
 * que si falta un texto en un idioma, TypeScript lo marca.
 */

export type FaqItem = { q: string; a: string };

export type PageMeta = {
  /** <title> completo */
  title: string;
  description: string;
};

export type SiteContent = {
  ui: {
    skip: string;
    mainNav: string;
    homeLabel: string;
    nav: { services: string; locations: string; reviews: string; faq: string };
    /** Enlaces de las secciones de la home a su página */
    seeAll: { services: string; locations: string; reviews: string; faq: string };
    breadcrumbHome: string;
    breadcrumbLabel: string;
    switchLanguage: string;
    call: string;
    whatsapp: string;
    askWhatsapp: string;
    freeQuote: string;
    directions: string;
    menuOpen: string;
    menuClose: string;
    quickContact: string;
    quickContactClose: string;
    quickContactTitle: string;
    closed: string;
    serviceAdvisor: string;
    languages: string;
    newBadge: string;
    mainBadge: string;
    viewService: string;
    starsLabel: string;
    reviewsLabel: string;
    googleReview: string;
    readReviews: string;
    writeReview: string;
    whatsappMessage: string;
    cta: { title: string; text: string };
    /** Enlaces a /privacy-policy y /terms (solo en inglés) */
    legal: { privacy: string; terms: string; englishOnly: string };
    footer: {
      pitch: string;
      spanish: string;
      locations: string;
      hours: string;
      navigation: string;
      quoteWhatsapp: string;
      googleListing: string;
      facebook: string;
      rights: string;
      credits: string;
    };
  };
  home: PageMeta & {
    hero: {
      h1: string;
      wordmark: [string, string];
      lede: string;
      callCta: string;
      aboutCta: string;
      features: [string, string][];
      outroTitle: [string, string];
      outroLede: string;
      locationsCta: string;
      scrollCue: string;
      posterAlt: string;
    };
    brandsLabel: string;
    services: { eyebrow: string; title: [string, string]; lede: string };
    team: { title: string; text: string; cta: string; hint: string };
    cars: { eyebrow: string; title: string };
    locations: { eyebrow: string; title: string; showAll: string; mapCredit: string };
    reviews: { eyebrow: string; title: string; source: string };
    faq: { eyebrow: string; title: string };
    gallery: { label: string };
  };
  servicesPage: PageMeta & {
    h1: string;
    intro: string;
    modelsTitle: string;
    items: Record<ServiceId, { paragraphs: string[]; listTitle: string; list: string[]; models: string[] }>;
  };
  locationsPage: PageMeta & {
    h1: string;
    intro: string;
    hoursTitle: string;
    contactTitle: string;
    nearbyTitle: string;
    googleTitle: string;
    items: Record<LocationSlug, { heading: string; paragraphs: string[] }>;
  };
  reviewsPage: PageMeta & {
    h1: string;
    intro: string;
    /** "{rating}" y "{count}" se reemplazan con los datos de Google */
    summary: string;
    placesTitle: string;
    latestTitle: string;
    bundledNote: string;
  };
  faqPage: PageMeta & { h1: string; intro: string };
  /** Las primeras 4 van en la home; todas en /faq. "{hours}" y "{addresses}" salen de business.ts */
  faq: FaqItem[];
};
