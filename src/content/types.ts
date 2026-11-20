import type { LocationSlug, PhotoKey, ServiceId } from "@/lib/business";

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
    /** Enlace a la página de una sede: "{city}" se reemplaza por la ciudad */
    viewShop: string;
    /** aria-label de las redes de una sede: "{city}" y "{network}" */
    socialLabel: string;
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

/* ------------------------------------------------------------------ */
/* Páginas de sucursal (/locations/<slug>)                             */
/* ------------------------------------------------------------------ */

/** Iconos de las tarjetas "What we do" (PartExplorer los traduce a lucide-react). */
export type PartIcon =
  | "battery-charging"
  | "battery-full"
  | "fan"
  | "cable"
  | "scan-line"
  | "activity"
  | "cpu"
  | "message-circle"
  | "wrench"
  | "repeat"
  | "layers"
  | "wind"
  | "droplet"
  | "gauge";

type TabLabel = { long: string; short: string };

/** Textos de una sección PartExplorer (batería, motor…). */
export type PartExplorerCopy = {
  eyebrow: string;
  /** Primera línea normal, segunda en verde */
  title: [string, string];
  tablistLabel: string;
  /** Pestañas (qué hacemos y el proceso): la etiqueta completa y la corta de móvil */
  tabs: { what: TabLabel; repair: TabLabel };
  intro: string;
  steps: { title: string; text: string }[];
  /** Plazos de garantía, bajo los pasos */
  warranty?: string;
  services: { icon: PartIcon; title: string; text: string }[];
  /** La foto de la pieza, recortada sobre fondo transparente */
  image: { src: string; width: number; height: number; alt: string };
  /** Cierre bajo las tarjetas: los dos sellos junto al botón de llamar */
  badges?: [string, string];
};

export type GalleryItem = { title: string } & (
  | { photo: PhotoKey }
  | { src: string; alt: string; width: number; height: number }
);

export type BranchPageContent = PageMeta & {
  /** Descripción de la sede en el JSON-LD (la misma en todas las páginas) */
  schemaDescription: string;
  /** PNG recortado (ruta dentro de /public) para su imagen Open Graph */
  ogCutout?: string;
  hero: {
    h1: string;
    /** Líneas del titular grande: la última va en verde */
    title: string[];
    lede: string;
    /** "{phone}" se reemplaza por el teléfono de la sede */
    callCta: string;
    directionsCta: string;
    spanish: [string, string];
  };
  battery: PartExplorerCopy;
  engine: PartExplorerCopy;
  common: { step: string };
  /** Fotos del taller (FlexCarousel): las de la sede o, con `photo`, las de business.ts */
  gallery: {
    eyebrow: string;
    title: [string, string];
    lede: string;
    label: string;
    items: GalleryItem[];
  };
  reviews: { eyebrow: string; title: [string, string] };
  faq: { eyebrow: string; title: string; items: FaqItem[] };
  visit: {
    eyebrow: string;
    title: [string, string];
    address: string;
    phone: string;
    hours: string;
    languages: string;
    call: string;
    follow: string;
    mapLabel: string;
    /** Párrafo propio de la sede (referencias, estacionamiento, equipo) */
    note?: string;
  };
  cta: { title: string; text: string };
  bar: { label: string; call: string };
};
