/**
 * Fuente única de verdad del negocio: datos de contacto, sedes, horario,
 * servicios y fotos. Lo consumen las secciones de la página, el header, el
 * footer, el mapa, el botón flotante y el JSON-LD, así que cambiar un dato
 * aquí lo cambia en todo el sitio.
 *
 * Los textos de cada idioma viven en src/content.
 *
 * Todo lo marcado con `TODO(cliente)` está pendiente de confirmar con Hybrid
 * World; la lista completa está en docs/pendientes-cliente.md.
 */

export const SITE_URL = "https://hybridworldinc.com";

export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];
export type Localized<T = string> = Record<Locale, T>;

/* ------------------------------------------------------------------ */
/* Contacto general                                                    */
/* ------------------------------------------------------------------ */

export type Phone = { display: string; tel: string };

export const business = {
  name: "Hybrid World Inc",
  shortName: "Hybrid World",
  email: "hybridworldinc25@gmail.com",
  // TODO(cliente): confirmar el teléfono general. El sitio anterior muestra
  // también el (562) 376-0149: preguntar si sigue activo y para qué se usa.
  phone: { display: "(562) 991-0729", tel: "+15629910729" } satisfies Phone,
  // TODO(cliente): confirmar que este es el único WhatsApp para las tres sedes.
  whatsapp: { display: "+1 562-991-0729", number: "15629910729" },
  logo: "/img/logo.png",
  logoMark: "/img/logo-mark.png",
  // TODO(cliente): confirmar el rango de precios que se declara a Google.
  priceRange: "$$",
  facebookUrl: "https://www.facebook.com/100188585137782",
  googleMapsUrl: "https://maps.google.com/maps?cid=5416074954660802581",
  languages: ["English", "Spanish"],
} as const;

/** Enlace de WhatsApp con un mensaje ya escrito. */
export const whatsappHref = (text?: string) =>
  `https://wa.me/${business.whatsapp.number}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

/* ------------------------------------------------------------------ */
/* Horario                                                             */
/* ------------------------------------------------------------------ */

export const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
export type Weekday = (typeof WEEKDAYS)[number];

/** Franjas de apertura. Los días que no aparecen, el taller está cerrado. */
export type OpeningHours = { days: Weekday[]; opens: string; closes: string }[];

/* Horarios tal como están publicados en la ficha de Google de cada sede
   (revisado el 12/10/2026). Si cambian, hay que cambiarlos aquí y en Google. */
const MON_SAT_8_4: OpeningHours = [
  { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "08:00", closes: "16:00" },
];
// TODO(cliente): Google dice que Fullerton abre de lunes a viernes de 8:30 a 4 y
// cierra los sábados; el sitio anterior decía lunes a sábado de 8 a 4. Confirmar.
const MON_FRI_830_4: OpeningHours = [
  { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:30", closes: "16:00" },
];

/* ------------------------------------------------------------------ */
/* Sedes                                                               */
/* ------------------------------------------------------------------ */

export type LocationSlug = "norwalk" | "fullerton" | "mountain-view";

export type Location = {
  slug: LocationSlug;
  city: string;
  /** Zona que cubre, para rótulos cortos */
  area: Localized;
  street: string;
  postalCode: string;
  region: "CA";
  /** Teléfono directo de la sede (confirmado por el cliente) */
  phone: Phone;
  geo: { lat: number; lng: number };
  hours: OpeningHours;
  /** Ficha de Google Business de la sede: reseñas, mapa y "escribir opinión" */
  google: {
    placeId: string;
    /** Nota y número de opiniones cuando no hay API (dato a mano del 12/10/2026) */
    rating: number;
    count: number;
  };
  /** Ciudades vecinas: alimentan `areaServed` del JSON-LD. */
  nearby: string[];
  isMain?: boolean;
  isNew?: boolean;
  /** Foto de la sede para el JSON-LD (clave de `photos`) */
  photo: PhotoKey;
};

export const locations: Location[] = [
  {
    slug: "norwalk",
    city: "Norwalk",
    area: { en: "Los Angeles County", es: "Condado de Los Ángeles" },
    street: "12139 Firestone Blvd",
    postalCode: "90650",
    region: "CA",
    phone: { display: "(657) 267-9029", tel: "+16572679029" },
    geo: { lat: 33.9090693, lng: -118.0743743 },
    hours: MON_SAT_8_4,
    google: { placeId: "ChIJTeCjGzfTwoARFXByxXnDKUs", rating: 4.7, count: 311 },
    // TODO(cliente): confirmar de qué ciudades llegan más clientes a cada sede.
    nearby: ["Downey", "Cerritos", "Santa Fe Springs", "Bellflower", "Whittier", "La Mirada"],
    isMain: true,
    photo: "teamBays",
  },
  {
    slug: "fullerton",
    city: "Fullerton",
    area: { en: "Orange County", es: "Orange County" },
    street: "1800 W Commonwealth Ave",
    postalCode: "92833",
    region: "CA",
    phone: { display: "(562) 503-3183", tel: "+15625033183" },
    geo: { lat: 33.8698424, lng: -117.9595815 },
    hours: MON_FRI_830_4,
    // TODO(cliente): la ficha de Google de esta sede se llama "HW fullerton";
    // conviene renombrarla a "Hybrid World Inc" como las otras dos.
    google: { placeId: "ChIJWUXTNNMr3YAREPade00ljU4", rating: 4.6, count: 55 },
    nearby: ["Anaheim", "Buena Park", "Brea", "Placentia", "La Habra", "Yorba Linda"],
    // TODO(cliente): foto propia de la sede de Fullerton (fachada o interior).
    photo: "storefront",
  },
  {
    slug: "mountain-view",
    city: "Mountain View",
    area: { en: "Bay Area", es: "Área de la Bahía" },
    // El local B2 viene de la ficha de Google: la dirección tiene que coincidir
    street: "2362 Old Middlefield Way B2",
    postalCode: "94043",
    region: "CA",
    phone: { display: "(408) 449-1311", tel: "+14084491311" },
    geo: { lat: 37.4154548, lng: -122.0967779 },
    hours: MON_SAT_8_4,
    google: { placeId: "ChIJRwwtlIS7j4ARuyH7Jt4waBE", rating: 4.7, count: 26 },
    nearby: ["Palo Alto", "Los Altos", "Sunnyvale", "Menlo Park", "Santa Clara", "Cupertino"],
    isNew: true,
    // TODO(cliente): foto propia de la sede de Mountain View.
    photo: "teslaLifts",
  },
];

export const mainLocation = locations.find((l) => l.isMain) ?? locations[0];

export const fullAddress = (l: Location) => `${l.street}, ${l.city}, ${l.region} ${l.postalCode}`;

export const directionsHref = (l: Location) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`Hybrid World Inc, ${fullAddress(l)}`)}&destination_place_id=${l.google.placeId}`;

/** La ficha de la sede en Google Maps (reseñas, fotos, horario). */
export const googleListingHref = (l: Location) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Hybrid World Inc, ${fullAddress(l)}`)}&query_place_id=${l.google.placeId}`;

/** Formulario de Google para dejar una reseña a la sede. */
export const writeReviewHref = (l: Location) => `https://search.google.com/local/writereview?placeid=${l.google.placeId}`;


/* ------------------------------------------------------------------ */
/* Fotos                                                               */
/* ------------------------------------------------------------------ */

export type Photo = {
  src: string;
  width: number;
  height: number;
  alt: Localized;
  /** object-position cuando la foto se recorta */
  focus?: string;
};

/**
 * Fotos del sitio con su texto alternativo, que describe lo que se ve.
 * Las del taller vienen de la ficha de Google de Hybrid World; las de los
 * servicios son material de la demo.
 */
const PHOTOS = {
  // TODO(cliente): ¿en qué sede está esta fachada? Si se sabe, va en el alt.
  team: {
    src: "/img/shop/equipo-hybrid-world.webp",
    width: 1597,
    height: 985,
    alt: {
      en: "The Hybrid World team in company shirts in front of the Hybrid World Inc storefront",
      es: "El equipo de Hybrid World, con las camisetas de la empresa, frente a la fachada de Hybrid World Inc",
    },
  },
  teamBays: {
    src: "/img/shop/taller-01.jpg",
    width: 900,
    height: 609,
    alt: {
      en: "The Hybrid World team standing in front of the diagnostic and service bays of the Norwalk shop",
      es: "El equipo de Hybrid World frente a las bahías de diagnóstico y servicio del taller de Norwalk",
    },
  },
  teslaLifts: {
    src: "/img/shop/taller-02.jpg",
    width: 900,
    height: 506,
    alt: {
      en: "Three Tesla Model 3 sedans raised on two-post lifts inside a Hybrid World service bay",
      es: "Tres Tesla Model 3 elevados en rampas de dos postes dentro de un taller de Hybrid World",
    },
  },
  engineHoist: {
    src: "/img/shop/taller-03.jpg",
    width: 882,
    height: 1200,
    alt: {
      en: "Technician fitting parts to a hybrid engine hanging from a shop crane",
      es: "Técnico montando piezas en un motor híbrido colgado de una grúa de taller",
    },
    focus: "50% 40%",
  },
  bays: {
    src: "/img/shop/taller-04.jpg",
    width: 900,
    height: 675,
    alt: {
      en: "Open repair and diagnostic bays with a Toyota Prius and a Lexus RX parked outside",
      es: "Bahías de reparación y diagnóstico abiertas, con un Toyota Prius y un Lexus RX estacionados afuera",
    },
  },
  teslaBay: {
    src: "/img/shop/taller-05.jpg",
    width: 900,
    height: 506,
    alt: {
      en: "White and black Tesla Model 3 on lifts with their hoods open in the service area",
      es: "Tesla Model 3 blanco y negro en rampas, con el cofre abierto, en el área de servicio",
    },
  },
  storefront: {
    src: "/img/shop/taller-06.jpg",
    width: 900,
    height: 675,
    alt: {
      en: "Hybrid World storefront with repair, diagnostic and service signs and Toyota Prius cars parked in front",
      es: "Fachada de Hybrid World con los rótulos de reparación, diagnóstico y servicio, y varios Toyota Prius estacionados enfrente",
    },
  },
  engineSwap: {
    src: "/img/shop/taller-07.jpg",
    width: 900,
    height: 506,
    alt: {
      en: "Technician lowering a rebuilt engine into a Toyota Prius v in the Norwalk shop",
      es: "Técnico bajando un motor reconstruido dentro de un Toyota Prius v en el taller de Norwalk",
    },
  },
  priusBay: {
    src: "/img/shop/taller-08.jpg",
    width: 900,
    height: 1200,
    alt: {
      en: "Silver third-generation Toyota Prius parked in a service bay",
      es: "Toyota Prius de tercera generación, color plata, en una bahía de servicio",
    },
    focus: "50% 60%",
  },
  battery: {
    src: "/img/services/bateria-hibrida-1600.webp",
    width: 1600,
    height: 893,
    alt: {
      en: "Hybrid battery pack opened on a workbench, with its cell modules and orange high-voltage cabling exposed",
      es: "Paquete de batería híbrida abierto sobre un banco del taller, con los módulos de celdas y el cableado naranja de alto voltaje a la vista",
    },
    focus: "58% 60%",
  },
  ac: {
    src: "/img/services/aire-acondicionado-1600.webp",
    width: 1600,
    height: 893,
    alt: {
      en: "Hybrid dashboard taken apart for A/C repair, with the climate unit exposed and the climate control on",
      es: "Tablero de un auto híbrido desarmado para reparar el aire acondicionado, con la unidad de climatización a la vista y el control de clima encendido",
    },
    focus: "72% 62%",
  },
  transmission: {
    src: "/img/services/transmision-1600.webp",
    width: 1600,
    height: 893,
    alt: {
      en: "Hybrid transmission removed and resting on a shop workbench with its wiring exposed",
      es: "Transmisión de un auto híbrido desmontada sobre una mesa de trabajo del taller, con su cableado a la vista",
    },
    focus: "56% 50%",
  },
  waterPump: {
    src: "/img/services/bomba-de-agua-1600.webp",
    width: 1600,
    height: 893,
    alt: {
      en: "Hybrid engine bay with the electric water pump mounted between the cooling-system hoses",
      es: "Motor de un auto híbrido con el capó abierto y la bomba de agua eléctrica montada entre las mangueras del sistema de enfriamiento",
    },
    focus: "58% 55%",
  },
  oilChange: {
    src: "/img/services/cambio-de-aceite-1600.webp",
    width: 1600,
    height: 893,
    alt: {
      en: "Gloved mechanic pouring fresh oil into an engine through a funnel during an oil change",
      es: "Mecánico con guantes vertiendo aceite nuevo en el motor con un embudo durante un cambio de aceite",
    },
    focus: "62% 40%",
  },
  radiator: {
    src: "/img/services/radiador-1600.webp",
    width: 1600,
    height: 893,
    alt: {
      en: "Aluminum radiator and electric cooling fan of a hybrid car with the front end opened up",
      es: "Radiador de aluminio y ventilador eléctrico de un auto híbrido con el frente abierto en el taller",
    },
    focus: "52% 55%",
  },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof PHOTOS;
export const photos: Record<PhotoKey, Photo> = PHOTOS;

/** Fotos del taller, en el orden de la galería. */
export const shopPhotoKeys: PhotoKey[] = [
  "team",
  "teamBays",
  "engineHoist",
  "teslaBay",
  "bays",
  "engineSwap",
  "storefront",
  "priusBay",
  "teslaLifts",
];

/* ------------------------------------------------------------------ */
/* Servicios                                                           */
/* ------------------------------------------------------------------ */

export type ServiceIcon = "zap" | "snowflake" | "gear" | "droplet" | "funnel" | "thermometer";

export type ServiceId = "hybrid-battery" | "ac" | "transmission" | "water-pump" | "oil-change" | "radiator";

/** Los servicios: tarjetas del bento de la home y secciones de /services. */
export type Service = {
  /** También es el ancla de su sección en /services (#hybrid-battery…) */
  id: ServiceId;
  icon: ServiceIcon;
  /** Título de la tarjeta (también el nombre del servicio en el JSON-LD) */
  name: Localized;
  /** Descripción corta: aparece al pasar el cursor */
  short: Localized;
  /** Etiqueta de categoría */
  label: Localized;
  photo: PhotoKey;
  /** Hueco en la rejilla de escritorio: grande (2/3), mediana (1/3) o pequeña (1/4) */
  size: "lg" | "md" | "sm";
};

export const services: Service[] = [
  {
    id: "hybrid-battery",
    icon: "zap",
    name: { en: "Hybrid Battery Repair & Replacement", es: "Baterías híbridas" },
    short: {
      en: "We test module by module and rebuild the pack with balanced cells. Every Prius generation, Lexus, Camry and Ford.",
      es: "Probamos módulo por módulo y reconstruimos el paquete con celdas balanceadas. Prius de todas las generaciones, Lexus, Camry, Ford.",
    },
    label: { en: "High voltage", es: "Alto voltaje" },
    photo: "battery",
    size: "lg",
  },
  {
    id: "ac",
    icon: "snowflake",
    name: { en: "Hybrid A/C Repair", es: "Aire acondicionado" },
    short: {
      en: "Leaks, refrigerant recharge and the high-voltage electric A/C compressor.",
      es: "Fugas, carga de refrigerante y compresor eléctrico de alto voltaje.",
    },
    label: { en: "Climate", es: "Clima" },
    photo: "ac",
    size: "md",
  },
  {
    id: "transmission",
    icon: "gear",
    name: { en: "Transmission Repair", es: "Transmisión" },
    short: {
      en: "eCVT hybrid transaxles and conventional transmissions.",
      es: "Transeje eCVT y transmisión convencional.",
    },
    label: { en: "Drivetrain", es: "Transmisión" },
    photo: "transmission",
    size: "sm",
  },
  {
    id: "water-pump",
    icon: "droplet",
    name: { en: "Water Pump", es: "Bomba de agua" },
    short: {
      en: "Engine water pump and the electric inverter pump.",
      es: "Bomba del motor y bomba eléctrica del inversor.",
    },
    label: { en: "Cooling", es: "Enfriamiento" },
    photo: "waterPump",
    size: "sm",
  },
  {
    id: "oil-change",
    icon: "funnel",
    name: { en: "Oil Change", es: "Cambio de aceite" },
    short: {
      en: "Oil and filter change with a multi-point inspection.",
      es: "Aceite + filtro y revisión multipunto.",
    },
    label: { en: "Maintenance", es: "Mantenimiento" },
    photo: "oilChange",
    size: "sm",
  },
  {
    id: "radiator",
    icon: "thermometer",
    name: { en: "Radiator Repair", es: "Radiador" },
    short: {
      en: "Leaks, coolant and the inverter cooling loop.",
      es: "Fugas, anticongelante y circuito del inversor.",
    },
    label: { en: "Cooling", es: "Enfriamiento" },
    photo: "radiator",
    size: "sm",
  },
];

/** Marcas que se atienden (tira de logos de la home). Logos en /public/img/brands. */
export const brands = [
  { name: "Toyota", file: "toyota", scale: 1 },
  { name: "Lexus", file: "lexus", scale: 0.52 },
  { name: "Ford", file: "ford", scale: 0.86 },
  { name: "Tesla", file: "tesla", scale: 0.92 },
] as const;

/** Autos del carrusel de la home (Wikimedia Commons, créditos en public/img/CREDITS.json). */
export const cars = [
  { src: "/img/cars/prius-gen3-a.jpg", width: 1920, height: 1234, model: "Prius ZVW30", brand: "Toyota" },
  { src: "/img/cars/lexus-rx.jpg", width: 1920, height: 1091, model: "RX 450h", brand: "Lexus" },
  { src: "/img/cars/camry-hybrid.jpg", width: 1920, height: 1186, model: "Camry Hybrid", brand: "Toyota" },
  { src: "/img/cars/ford-escape.jpg", width: 1600, height: 1200, model: "Escape Hybrid", brand: "Ford" },
  { src: "/img/cars/tesla-model3.jpg", width: 1920, height: 1162, model: "Model 3", brand: "Tesla" },
  { src: "/img/cars/prius-gen3-b.jpg", width: 1920, height: 1164, model: "Prius XW30", brand: "Toyota" },
  { src: "/img/cars/prius-prime.jpg", width: 1920, height: 956, model: "Prius Prime", brand: "Toyota" },
  { src: "/img/cars/prius-gen4.jpg", width: 1920, height: 1250, model: "Prius ZVW50", brand: "Toyota" },
] as const;
