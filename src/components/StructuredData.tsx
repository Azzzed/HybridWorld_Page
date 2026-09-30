import { locations } from "../data/locations";
import { serviceImage, services } from "../data/services";
import { site } from "../data/site";

/**
 * Datos estructurados (schema.org, JSON-LD) para Google y los demás
 * buscadores: el negocio, sus tres talleres y los servicios con su
 * descripción completa y su foto.
 *
 * Se arman con los mismos datos que pinta el sitio, así que no pueden
 * contradecirlo. Solo lleva lo que ya está en esos datos: nada de
 * valoraciones ni precios (la promoción del cambio de aceite cambia).
 */

const DAYS: Record<string, string> = {
  Lunes: "Monday",
  Martes: "Tuesday",
  Miércoles: "Wednesday",
  Jueves: "Thursday",
  Viernes: "Friday",
  Sábado: "Saturday",
  Domingo: "Sunday",
};

/** "08:00 am – 04:00 pm" → ["08:00", "16:00"]; "Cerrado" → null */
function parseHours(text: string) {
  const times = [...text.matchAll(/(\d{1,2}):(\d{2})\s*(am|pm)/gi)].map(([, h, m, half]) => {
    const hour = (Number(h) % 12) + (half.toLowerCase() === "pm" ? 12 : 0);
    return `${String(hour).padStart(2, "0")}:${m}`;
  });
  return times.length === 2 ? times : null;
}

/** Los días con el mismo horario, agrupados como pide schema.org. */
function openingHours() {
  const groups = new Map<string, { opens: string; closes: string; days: string[] }>();
  for (const { day, open } of site.hours) {
    const hours = parseHours(open);
    if (!hours) continue;
    const key = hours.join("-");
    const group = groups.get(key) ?? { opens: hours[0], closes: hours[1], days: [] };
    group.days.push(DAYS[day]);
    groups.set(key, group);
  }
  return [...groups.values()].map(({ opens, closes, days }) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: days,
    opens,
    closes,
  }));
}

function graph(origin: string) {
  const url = (path: string) => new URL(path, origin).href;
  const organization = url("/#organizacion");
  const catalog = url("/#servicios");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organization,
        name: site.name,
        url: url("/"),
        logo: url(site.logo),
        email: site.email,
        telephone: site.mainPhoneHref.replace("tel:", ""),
        sameAs: [site.googleMapsUrl],
      },
      ...locations.map((l) => ({
        "@type": "AutoRepair",
        "@id": url(`/#${l.id}`),
        name: `${site.name} — ${l.city}`,
        description: `${site.tagline}. ${l.blurb}`,
        url: url("/#sucursales"),
        image: url(serviceImage("bateria-hibrida", 1600)),
        telephone: l.phoneHref.replace("tel:", ""),
        email: site.email,
        parentOrganization: { "@id": organization },
        address: {
          "@type": "PostalAddress",
          streetAddress: l.address,
          addressLocality: l.city,
          addressRegion: "CA",
          postalCode: l.zip.match(/\d{5}/)?.[0],
          addressCountry: "US",
        },
        geo: { "@type": "GeoCoordinates", latitude: l.coords[0], longitude: l.coords[1] },
        hasMap: l.directions,
        openingHoursSpecification: openingHours(),
        knowsLanguage: ["es", "en"],
        hasOfferCatalog: { "@id": catalog },
      })),
      {
        "@type": "OfferCatalog",
        "@id": catalog,
        name: "Servicios para autos híbridos",
        itemListElement: services.map((s) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            "@id": url(`/#${s.id}`),
            name: s.title,
            serviceType: s.label,
            description: s.seo,
            image: {
              "@type": "ImageObject",
              url: url(serviceImage(s.image.name, 1600)),
              caption: s.image.alt,
            },
            provider: { "@id": organization },
            areaServed: locations.map((l) => ({ "@type": "City", name: `${l.city}, CA` })),
          },
        })),
      },
    ],
  };
}

export default function StructuredData() {
  // `<` escapado: el JSON va dentro de un <script> y no puede cerrarlo
  const json = JSON.stringify(graph(window.location.origin)).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
