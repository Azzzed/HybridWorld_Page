/**
 * Las 3 sucursales de Hybrid World Inc.
 *
 * ⚠️ ASESORES: `advisor.name` y `advisor.photo` están vacíos a propósito.
 *    Pon aquí el nombre real (y opcionalmente una foto en /public/img/team/)
 *    del asesor de servicio de cada sucursal. Si `name` queda vacío la tarjeta
 *    muestra el rótulo genérico "Asesor de servicio" y sigue funcionando igual.
 */

export type Location = {
  id: string;
  city: string;
  label: string;
  address: string;
  zip: string;
  phone: string;
  phoneHref: string;
  whatsapp: string;
  coords: [number, number];
  directions: string;
  isMain?: boolean;
  isNew?: boolean;
  blurb: string;
  advisor: {
    name: string;
    photo: string;
    role: string;
    languages: string;
  };
};

export const locations: Location[] = [
  {
    id: "norwalk",
    city: "Norwalk",
    label: "Casa matriz",
    address: "12139 Firestone Blvd",
    zip: "Norwalk, CA 90650",
    phone: "(657) 267-9029",
    phoneHref: "tel:+16572679029",
    whatsapp: "https://wa.me/16572679029",
    coords: [33.9089, -118.074],
    directions: "https://www.google.com/maps/dir/?api=1&destination=12139+Firestone+Blvd,+Norwalk,+CA+90650",
    isMain: true,
    blurb:
      "Taller principal y centro de reconstrucción de baterías.",
    advisor: { name: "", photo: "", role: "Asesor de servicio", languages: "Español · English" },
  },
  {
    id: "fullerton",
    city: "Fullerton",
    label: "Orange County",
    address: "1800 W Commonwealth Ave",
    zip: "Fullerton, CA 92833",
    phone: "(562) 503-3183",
    phoneHref: "tel:+15625033183",
    whatsapp: "https://wa.me/15625033183",
    coords: [33.870027, -117.959568],
    directions: "https://www.google.com/maps/dir/?api=1&destination=1800+W+Commonwealth+Ave,+Fullerton,+CA+92833",
    blurb:
      "Servicio completo para Orange County.",
    advisor: { name: "", photo: "", role: "Asesor de servicio", languages: "Español · English" },
  },
  {
    id: "mountain-view",
    city: "Mountain View",
    label: "Bay Area",
    address: "2362 Old Middlefield Way",
    zip: "Mountain View, CA 94043",
    phone: "(408) 449-1311",
    phoneHref: "tel:+14084491311",
    whatsapp: "https://wa.me/14084491311",
    coords: [37.4155071, -122.0967879],
    directions: "https://www.google.com/maps/dir/?api=1&destination=2362+Old+Middlefield+Way,+Mountain+View,+CA+94043",
    isNew: true,
    blurb:
      "La más reciente, para el norte de California.",
    advisor: { name: "", photo: "", role: "Asesor de servicio", languages: "Español · English" },
  },
];
