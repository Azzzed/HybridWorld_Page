/**
 * Servicios, en formato de tarjeta para MagicBento.
 *
 * El texto de la tarjeta es corto a propósito: el detalle se da por teléfono
 * o WhatsApp. `seo` es la versión completa, la que leen Google y los demás
 * buscadores en los datos estructurados (StructuredData.tsx).
 */

export type Service = {
  id: string;
  icon: "zap" | "snowflake" | "gear" | "droplet" | "funnel" | "thermometer";
  label: string;
  title: string;
  description: string;
  /** Descripción completa para los buscadores. */
  seo: string;
  image: {
    /** Nombre en /img/services: existe en -960.webp y -1600.webp */
    name: string;
    /** Qué se ve en la foto, para lectores de pantalla y Google Imágenes */
    alt: string;
    /** object-position: la parte de la foto que queda a la vista */
    focus: string;
  };
  /** Insignia destacada, por ejemplo una promoción */
  badge?: string;
  /** Hueco en la rejilla de escritorio: grande (2/3), mediana (1/3) o pequeña (1/4) */
  size: "lg" | "md" | "sm";
};

export const services: Service[] = [
  {
    id: "bateria-hibrida",
    icon: "zap",
    label: "Alto voltaje",
    title: "Baterías híbridas",
    description:
      "Probamos módulo por módulo y reconstruimos el paquete con celdas balanceadas. Prius de todas las generaciones, Lexus, Camry, Ford.",
    seo: "Diagnóstico y reconstrucción de baterías híbridas de alto voltaje: prueba módulo por módulo, balanceo de celdas y cambio de módulos dañados para Toyota Prius de todas las generaciones, Lexus, Toyota Camry Hybrid y Ford.",
    image: {
      name: "bateria-hibrida",
      alt: "Paquete de batería híbrida abierto sobre un banco del taller, con los módulos de celdas y el cableado naranja de alto voltaje a la vista",
      focus: "58% 60%",
    },
    size: "lg",
  },
  {
    id: "aire-acondicionado",
    icon: "snowflake",
    label: "Clima",
    title: "Aire acondicionado",
    description: "Fugas, carga de refrigerante y compresor eléctrico de alto voltaje.",
    seo: "Reparación del aire acondicionado de autos híbridos: detección de fugas, carga de refrigerante y servicio al compresor eléctrico de alto voltaje.",
    image: {
      name: "aire-acondicionado",
      alt: "Tablero de un auto híbrido desarmado para reparar el aire acondicionado, con la unidad de climatización a la vista y el control de clima encendido",
      focus: "72% 62%",
    },
    size: "md",
  },
  {
    id: "transmision",
    icon: "gear",
    label: "Transmisión",
    title: "Transmisión",
    description: "Transeje eCVT y transmisión convencional.",
    seo: "Diagnóstico y reparación del transeje eCVT de autos híbridos y de transmisiones automáticas convencionales.",
    image: {
      name: "transmision",
      alt: "Transmisión de un auto híbrido desmontada sobre una mesa de trabajo del taller, con su cableado a la vista",
      focus: "56% 50%",
    },
    size: "sm",
  },
  {
    id: "bomba-agua",
    icon: "droplet",
    label: "Enfriamiento",
    title: "Bomba de agua",
    description: "Bomba del motor y bomba eléctrica del inversor.",
    seo: "Cambio de la bomba de agua del motor y de la bomba eléctrica que enfría el inversor en autos híbridos.",
    image: {
      name: "bomba-de-agua",
      alt: "Motor de un auto híbrido con el capó abierto y la bomba de agua eléctrica montada entre las mangueras del sistema de enfriamiento",
      focus: "58% 55%",
    },
    size: "sm",
  },
  {
    id: "cambio-aceite",
    icon: "funnel",
    label: "Mantenimiento",
    title: "Cambio de aceite",
    description: "Aceite + filtro y revisión multipunto.",
    seo: "Cambio de aceite y filtro con revisión multipunto para autos híbridos.",
    image: {
      name: "cambio-de-aceite",
      alt: "Mecánico con guantes vertiendo aceite nuevo en el motor con un embudo durante un cambio de aceite",
      focus: "62% 40%",
    },
    badge: "$50 este mes",
    size: "sm",
  },
  {
    id: "radiador",
    icon: "thermometer",
    label: "Enfriamiento",
    title: "Radiador",
    description: "Fugas, anticongelante y circuito del inversor.",
    seo: "Reparación de fugas del radiador, cambio de anticongelante y servicio al circuito de enfriamiento del inversor en autos híbridos.",
    image: {
      name: "radiador",
      alt: "Radiador de aluminio y ventilador eléctrico de un auto híbrido con el frente abierto en el taller",
      focus: "52% 55%",
    },
    size: "sm",
  },
];

/** Las fotos de /img/services en los dos anchos exportados. */
export const serviceImage = (name: string, width: 960 | 1600) => `/img/services/${name}-${width}.webp`;
