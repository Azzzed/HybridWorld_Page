import type { Locale } from "@/lib/business";
import type { BranchPageContent } from "../types";

/**
 * Página de la sucursal de Mountain View (/locations/mountain-view).
 *
 * Teléfono, horario, dirección y ciudades NO se escriben aquí: salen de
 * src/lib/business.ts. En los textos van como marcadores que
 * content/locations/index.ts reemplaza:
 *   {phone}  el teléfono de la sede · {hours}  "Mon–Fri 8–4"
 *   {areas}  la ciudad y las cercanas ("Mountain View, Palo Alto… and Cupertino")
 *
 * TODO(técnico): revisar los textos técnicos antes de publicar (28 módulos de
 * 7.2 V, P0A80, la falla EGR → junta de cabeza del 2ZR-FXE).
 */

/* ------------------------------------------------------------------ */
/* Imágenes (las mismas en los dos idiomas)                            */
/* ------------------------------------------------------------------ */

const BATTERY_IMAGE = { src: "/img/mountain-view/battery-pack.webp", width: 1028, height: 698 } as const;
/** La misma batería en PNG de 640 px, para la imagen Open Graph (Satori no lee WebP) */
const OG_CUTOUT = "img/mountain-view/battery-pack-og.png";
const ENGINE_IMAGE = { src: "/img/mountain-view/engine-2zr.webp", width: 669, height: 802 } as const;

/** Fotos del taller que mandó el cliente (public/img/mountain-view/gallery) */
const G = (name: string, width: number, height: number) => ({ src: `/img/mountain-view/gallery/${name}.webp`, width, height });
const SHOP = {
  bays: G("service-bays", 768, 1024),
  side: G("rebuilt-1nz-side", 1200, 900),
  gasket: G("head-gasket-parts", 576, 1024),
  top: G("rebuilt-1nz-top", 900, 1200),
  engines: G("rebuilt-engines", 576, 1024),
};

/* ------------------------------------------------------------------ */
/* English                                                             */
/* ------------------------------------------------------------------ */

const en: BranchPageContent = {
  title: "Hybrid Battery Repair in Mountain View, CA | Hybrid World",
  description:
    "Hybrid battery repair, Prius engine rebuilds and full hybrid service in Mountain View. {hours}. Se habla español. Call {phone}.",
  schemaDescription:
    "Hybrid battery repair module by module, Prius engine rebuilds and full hybrid service in Mountain View, CA, for drivers across the Bay Area. Se habla español.",
  ogCutout: OG_CUTOUT,

  hero: {
    h1: "Hybrid battery repair in Mountain View, CA",
    title: ["Hybrid & EV", "Specialized"],
    lede: "Often the battery isn't dead. One or two modules are. We test all 28 and replace only what's failing, right here on Old Middlefield Way.",
    callCta: "Call {phone}",
    directionsCta: "Get directions",
    spanish: ["Se habla", "español"],
  },

  battery: {
    eyebrow: "01 — High voltage",
    title: ["Hybrid battery repair,", "module by module."],
    tablistLabel: "Hybrid battery repair",
    tabs: {
      repair: { long: "Battery repair", short: "Repair" },
      what: { long: "What we do", short: "What we do" },
    },
    intro:
      "A 3rd gen Prius pack is 28 NiMH modules wired in series. When one module drops out of balance, the car shows the red triangle and code P0A80, even if the other 27 are healthy. We repair the pack instead of replacing all of it.",
    steps: [
      { title: "Scan and read block voltages", text: "Codes plus the live voltage of every block pair." },
      { title: "Load-test each module", text: "We pull the pack and measure all 28 under load." },
      { title: "Replace and balance", text: "Weak modules out, matched modules in, full balancing." },
      { title: "Reinstall and road test", text: "Codes cleared, test drive and a 3 to 12 month warranty, depending on the repair." },
    ],
    warranty:
      "Warranty: 3 months on module repairs · 6 months on fully rebuilt packs · 1 year on packs rebuilt with 4th gen cells.",
    badges: ["Trusted service", "Keep your hybrid on the road"],
    services: [
      { icon: "battery-charging", title: "Battery reconditioning", text: "Weak modules replaced and the whole pack rebalanced." },
      { icon: "cpu", title: "Full replacement", text: "When the pack is too far gone, we tell you straight." },
      { icon: "fan", title: "Cooling fan service", text: "A clogged fan overheats modules. We clean it and the duct." },
      { icon: "cable", title: "Bus bar and terminal cleaning", text: "Corrosion adds resistance and throws off readings." },
      { icon: "activity", title: "Hybrid system diagnostics", text: "Inverter, relays and sensors checked, not only the pack." },
      { icon: "message-circle", title: "Free quote", text: "Call or WhatsApp us with your year and model." },
    ],
    image: { ...BATTERY_IMAGE, alt: "Toyota Prius hybrid battery pack with the top cover removed, showing its modules and orange high-voltage cables" },
  },

  engine: {
    eyebrow: "02 — Engine",
    title: ["Prius engine rebuilds,", "done in-house."],
    tablistLabel: "Prius engine rebuilds",
    tabs: {
      repair: { long: "Engine rebuild", short: "Rebuild" },
      what: { long: "What we do", short: "What we do" },
    },
    intro:
      "The 3rd gen Prius runs a 1.8L 2ZR-FXE. A common failure path: a clogged EGR cooler leads to a blown head gasket, then oil burning and misfires. We tear the engine down, find the cause and rebuild it so it does not happen again.",
    steps: [
      { title: "Diagnose", text: "Codes, compression and leak-down test." },
      { title: "Tear down and inspect", text: "Head, block and timing parts measured." },
      { title: "Rebuild", text: "New gaskets, seals and worn parts. EGR system cleaned." },
      { title: "Install and test", text: "Break-in, road test and a 6-month warranty on rebuilt engines." },
    ],
    warranty:
      "Warranty: 6 months on rebuilt engines · 3 months on head gasket jobs and parts such as water pumps and radiators · 30 days on misfire repairs.",
    services: [
      { icon: "wrench", title: "Full engine rebuild", text: "Your engine, rebuilt in our shop." },
      { icon: "repeat", title: "Remanufactured engine swap", text: "A ready engine when you need the car back fast." },
      { icon: "layers", title: "Head gasket repair", text: "Head resurfaced, new gasket, cooling system bled." },
      { icon: "wind", title: "EGR cooler and valve cleaning", text: "The fix that prevents the next gasket failure." },
      { icon: "droplet", title: "Electric water pump", text: "Engine and inverter pumps replaced and tested." },
      { icon: "gauge", title: "Oil consumption fixes", text: "Piston rings and PCV diagnosed, not guessed." },
    ],
    image: { ...ENGINE_IMAGE, alt: "Remanufactured Toyota 2ZR-FXE 1.8L engine" },
  },

  common: { step: "Step" },

  gallery: {
    eyebrow: "In the shop",
    title: ["Real work,", "from our shop."],
    lede: "Rebuilt engines, head gasket jobs and the bays where we work on Prius, Lexus, Camry and Tesla. Drag the photos or click one to see it bigger.",
    label: "Photos from the shop",
    // TODO(cliente): confirmar en qué sede se tomó cada foto; hoy salen sin decirlo.
    items: [
      { ...SHOP.bays, title: "Service bays", alt: "Service bays seen from above: two Teslas on lifts, a blue Prius c with the hood open and a red SUV with an engine crane" },
      { ...SHOP.side, title: "Rebuilt 1NZ-FXE engine", alt: "Rebuilt Toyota 1NZ-FXE hybrid engine with a clean intake manifold and throttle body, outside the shop" },
      { ...SHOP.gasket, title: "Head gasket job", alt: "Cylinder head, timing cover, camshaft carrier and new head gaskets laid out on a mat during a head gasket repair" },
      { ...SHOP.top, title: "Ready to install", alt: "Rebuilt 1NZ-FXE engine seen from above, with new ignition coils and fuel injectors" },
      { ...SHOP.engines, title: "Two rebuilt engines", alt: "Two rebuilt Toyota hybrid engines on the shop floor in front of shelves with engine parts" },
      { photo: "engineHoist", title: "Engine on the hoist" },
      { photo: "teslaLifts", title: "Tesla Model 3 on the lifts" },
      { photo: "teslaBay", title: "Tesla service" },
      { photo: "bays", title: "Open bays" },
      { photo: "priusBay", title: "3rd gen Prius" },
      { photo: "team", title: "The team" },
    ],
  },

  reviews: {
    eyebrow: "Reviews",
    title: ["The Mountain View shop", "on Google"],
  },

  faq: {
    eyebrow: "Questions",
    title: "Questions about the Mountain View shop",
    items: [
      {
        q: "Do you repair hybrid batteries in Mountain View?",
        a: "Yes. At our shop on Old Middlefield Way we test the pack module by module and replace only the weak modules when that's the right fix.",
      },
      {
        q: "What does the red triangle or code P0A80 mean?",
        a: "Usually that one or more battery modules are out of balance. We confirm it with a scan before we quote.",
      },
      { q: "Do you work on cars other than the Prius?", a: "Yes: Lexus, Camry, Ford and Tesla too." },
      {
        // TODO(cliente): cuánto tarda una reparación de batería, para ponerlo aquí.
        q: "How long does a battery repair take?",
        a: "We tell you after the scan, once we know how many modules need work. Call {phone} for today's availability.",
      },
      {
        q: "Do your repairs come with a warranty?",
        a: "Yes. Battery module repairs, head gasket jobs and parts such as water pumps and radiators: 3 months. Fully rebuilt batteries and rebuilt engines: 6 months. Batteries rebuilt with 4th gen cells: 1 year. Misfire repairs: 30 days.",
      },
      { q: "Do you speak Spanish?", a: "Yes. Se habla español en el taller de Mountain View." },
      { q: "Which areas do you serve?", a: "{areas}." },
      // TODO(cliente): "Where do I park?" con el estacionamiento y referencias cercanas reales.
    ],
  },

  visit: {
    eyebrow: "03 — Visit the shop",
    title: ["Hybrid World", "Mountain View"],
    address: "Address",
    phone: "Phone",
    hours: "Hours",
    languages: "Languages",
    call: "Call the shop",
    follow: "Follow the Mountain View shop",
    mapLabel: "Map of the Hybrid World shop in Mountain View",
    // TODO(cliente): párrafo propio de la sede (referencias cercanas, estacionamiento, equipo).
  },

  cta: {
    title: "Get your free quote today",
    text: "Call the Mountain View shop or send us a WhatsApp message with your year, model and the warning you're seeing.",
  },

  bar: { label: "Contact the Mountain View shop", call: "Call" },
};

/* ------------------------------------------------------------------ */
/* Español                                                             */
/* ------------------------------------------------------------------ */

const es: BranchPageContent = {
  title: "Reparación de baterías híbridas en Mountain View | Hybrid World",
  description:
    "Reparación de baterías híbridas, reconstrucción de motores Prius y servicio completo en Mountain View. {hours}. Llama al {phone}.",
  schemaDescription:
    "Reparación de baterías híbridas módulo por módulo, reconstrucción de motores Prius y servicio completo para híbridos en Mountain View, CA, para conductores de toda el Área de la Bahía. Se habla español.",
  ogCutout: OG_CUTOUT,

  hero: {
    h1: "Reparación de baterías híbridas en Mountain View, CA",
    title: ["Especializados", "en híbridos", "y eléctricos"],
    lede: "Muchas veces la batería no está muerta: fallan uno o dos módulos. Probamos los 28 y cambiamos solo los que fallan, aquí mismo en Old Middlefield Way.",
    callCta: "Llama al {phone}",
    directionsCta: "Cómo llegar",
    spanish: ["Se habla", "español"],
  },

  battery: {
    eyebrow: "01 — Alto voltaje",
    title: ["Reparación de baterías híbridas,", "módulo por módulo."],
    tablistLabel: "Reparación de baterías híbridas",
    tabs: {
      repair: { long: "Reparación de batería", short: "Reparación" },
      what: { long: "Qué hacemos", short: "Qué hacemos" },
    },
    intro:
      "La batería de un Prius de 3.ª generación tiene 28 módulos NiMH conectados en serie. Cuando un módulo se desbalancea, el auto enciende el triángulo rojo y marca el código P0A80, aunque los otros 27 estén sanos. Reparamos la batería en vez de cambiarla entera.",
    steps: [
      { title: "Escaneo y voltaje por bloque", text: "Los códigos y el voltaje en vivo de cada par de bloques." },
      { title: "Prueba de carga de cada módulo", text: "Sacamos la batería y medimos los 28 con carga." },
      { title: "Cambio y balanceo", text: "Salen los módulos débiles, entran módulos parejos y se balancea todo." },
      {
        title: "Instalación y prueba de manejo",
        text: "Borramos los códigos, la probamos en la calle y lleva de 3 a 12 meses de garantía, según la reparación.",
      },
    ],
    warranty:
      "Garantía: 3 meses en reparación de módulos · 6 meses en baterías reconstruidas completas · 1 año en baterías reconstruidas con celdas de 4.ª generación.",
    badges: ["Servicio de confianza", "Tu híbrido siempre en marcha"],
    services: [
      { icon: "battery-charging", title: "Reacondicionamiento de batería", text: "Cambiamos los módulos débiles y balanceamos toda la batería." },
      { icon: "cpu", title: "Reemplazo completo", text: "Si la batería ya no tiene arreglo, te lo decimos claro." },
      { icon: "fan", title: "Servicio al ventilador", text: "Un ventilador tapado calienta los módulos. Lo limpiamos junto con el ducto." },
      { icon: "cable", title: "Limpieza de barras y terminales", text: "La corrosión sube la resistencia y altera las lecturas." },
      { icon: "activity", title: "Diagnóstico del sistema híbrido", text: "Revisamos inversor, relevadores y sensores, no solo la batería." },
      { icon: "message-circle", title: "Cotización gratis", text: "Llámanos o mándanos un WhatsApp con el año y el modelo." },
    ],
    image: { ...BATTERY_IMAGE, alt: "Batería híbrida de un Toyota Prius sin la tapa superior, con sus módulos y los cables naranjas de alto voltaje a la vista" },
  },

  engine: {
    eyebrow: "02 — Motor",
    title: ["Reconstrucción de motores Prius,", "en nuestro taller."],
    tablistLabel: "Reconstrucción de motores Prius",
    tabs: {
      repair: { long: "Reconstrucción de motor", short: "Reparación" },
      what: { long: "Qué hacemos", short: "Qué hacemos" },
    },
    intro:
      "El Prius de 3.ª generación lleva el motor 2ZR-FXE de 1.8 L. Una falla común empieza con el enfriador de EGR tapado: después se quema la junta de cabeza y el motor empieza a quemar aceite y a fallar (misfire). Desarmamos el motor, encontramos la causa y lo reconstruimos para que no vuelva a pasar.",
    steps: [
      { title: "Diagnóstico", text: "Códigos, compresión y prueba de fugas." },
      { title: "Desarmado e inspección", text: "Medimos la cabeza, el bloque y las piezas de distribución." },
      { title: "Reconstrucción", text: "Juntas, sellos y piezas gastadas nuevas. Limpiamos el sistema EGR." },
      { title: "Instalación y prueba", text: "Asentamiento, prueba de manejo y 6 meses de garantía en motores reconstruidos." },
    ],
    warranty:
      "Garantía: 6 meses en motores reconstruidos · 3 meses en junta de cabeza y piezas como bombas de agua y radiadores · 30 días en reparaciones de misfire.",
    services: [
      { icon: "wrench", title: "Reconstrucción completa del motor", text: "Tu mismo motor, reconstruido en nuestro taller." },
      { icon: "repeat", title: "Cambio por motor remanufacturado", text: "Un motor listo para cuando necesitas el auto rápido." },
      { icon: "layers", title: "Reparación de junta de cabeza", text: "Cabeza rectificada, junta nueva y sistema de enfriamiento purgado." },
      { icon: "wind", title: "Limpieza de enfriador y válvula EGR", text: "El arreglo que evita que se vuelva a quemar la junta." },
      { icon: "droplet", title: "Bomba de agua eléctrica", text: "Cambiamos y probamos la bomba del motor y la del inversor." },
      { icon: "gauge", title: "Consumo de aceite", text: "Revisamos anillos y PCV: diagnóstico, no suposiciones." },
    ],
    image: { ...ENGINE_IMAGE, alt: "Motor Toyota 2ZR-FXE de 1.8 L remanufacturado" },
  },

  common: { step: "Paso" },

  gallery: {
    eyebrow: "En el taller",
    title: ["Trabajo real,", "de nuestro taller."],
    lede: "Motores reconstruidos, juntas de cabeza y las bahías donde trabajamos en Prius, Lexus, Camry y Tesla. Arrastra las fotos o toca una para verla en grande.",
    label: "Fotos del taller",
    // TODO(cliente): confirmar en qué sede se tomó cada foto; hoy salen sin decirlo.
    items: [
      { ...SHOP.bays, title: "Bahías de servicio", alt: "Bahías de servicio vistas desde arriba: dos Tesla en rampas, un Prius c azul con el cofre abierto y una camioneta roja con la grúa de motor" },
      { ...SHOP.side, title: "Motor 1NZ-FXE reconstruido", alt: "Motor híbrido Toyota 1NZ-FXE reconstruido, con el múltiple de admisión y el cuerpo de aceleración limpios, afuera del taller" },
      { ...SHOP.gasket, title: "Reparación de junta de cabeza", alt: "Cabeza del motor, tapa de distribución, soporte de árboles de levas y juntas de cabeza nuevas sobre un tapete durante una reparación de junta" },
      { ...SHOP.top, title: "Listo para instalar", alt: "Motor 1NZ-FXE reconstruido visto desde arriba, con bobinas e inyectores nuevos" },
      { ...SHOP.engines, title: "Dos motores reconstruidos", alt: "Dos motores híbridos Toyota reconstruidos en el piso del taller, frente a estantes con piezas de motor" },
      { photo: "engineHoist", title: "Motor en la grúa" },
      { photo: "teslaLifts", title: "Tesla Model 3 en las rampas" },
      { photo: "teslaBay", title: "Servicio a Tesla" },
      { photo: "bays", title: "Bahías abiertas" },
      { photo: "priusBay", title: "Prius de 3.ª generación" },
      { photo: "team", title: "El equipo" },
    ],
  },

  reviews: {
    eyebrow: "Reseñas",
    title: ["La sucursal de Mountain View", "en Google"],
  },

  faq: {
    eyebrow: "Preguntas",
    title: "Preguntas sobre la sucursal de Mountain View",
    items: [
      {
        q: "¿Reparan baterías híbridas en Mountain View?",
        a: "Sí. En nuestro taller de Old Middlefield Way probamos la batería módulo por módulo y cambiamos solo los módulos débiles cuando esa es la reparación correcta.",
      },
      {
        q: "¿Qué significa el triángulo rojo o el código P0A80?",
        a: "Normalmente, que uno o más módulos de la batería están desbalanceados. Lo confirmamos con un escaneo antes de darte la cotización.",
      },
      { q: "¿Trabajan con autos que no sean Prius?", a: "Sí: también Lexus, Camry, Ford y Tesla." },
      {
        // TODO(cliente): cuánto tarda una reparación de batería, para ponerlo aquí.
        q: "¿Cuánto tarda la reparación de una batería?",
        a: "Te lo decimos después del escaneo, cuando sabemos cuántos módulos hay que cambiar. Llama al {phone} para saber la disponibilidad de hoy.",
      },
      {
        q: "¿Las reparaciones tienen garantía?",
        a: "Sí. Reparación de módulos de batería, junta de cabeza y piezas como bombas de agua y radiadores: 3 meses. Baterías reconstruidas completas y motores reconstruidos: 6 meses. Baterías reconstruidas con celdas de 4.ª generación: 1 año. Reparaciones de misfire: 30 días.",
      },
      { q: "¿Hablan español?", a: "Sí. En el taller de Mountain View te atendemos en español." },
      { q: "¿Qué zonas atienden?", a: "{areas}." },
      // TODO(cliente): "¿Dónde me estaciono?" con el estacionamiento y referencias cercanas reales.
    ],
  },

  visit: {
    eyebrow: "03 — Visítanos",
    title: ["Hybrid World", "Mountain View"],
    address: "Dirección",
    phone: "Teléfono",
    hours: "Horario",
    languages: "Idiomas",
    call: "Llamar al taller",
    follow: "Sigue a la sucursal de Mountain View",
    mapLabel: "Mapa de la sucursal de Hybrid World en Mountain View",
    // TODO(cliente): párrafo propio de la sede (referencias cercanas, estacionamiento, equipo).
  },

  cta: {
    title: "Pide tu cotización gratis hoy",
    text: "Llama a la sucursal de Mountain View o mándanos un WhatsApp con el año, el modelo y el aviso que te aparece.",
  },

  bar: { label: "Contacto con la sucursal de Mountain View", call: "Llamar" },
};

export const mountainView: Record<Locale, BranchPageContent> = { en, es };
