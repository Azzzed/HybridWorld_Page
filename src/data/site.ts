/**
 * Datos generales del negocio.
 * Todo lo que aparece aquí viene del sitio actual de Hybrid World Inc
 * y de su ficha verificada de Google Business.
 */

export const site = {
  name: "Hybrid World Inc",
  tagline: "Especialistas en autos híbridos",
  logo: "/img/logo.png",
  /** Solo el emblema (globo + auto), recortado del logo: se lee mejor a tamaño chico */
  logoMark: "/img/logo-mark.png",
  email: "hybridworldinc25@gmail.com",
  mainPhone: "(562) 991-0729",
  mainPhoneHref: "tel:+15629910729",
  googleMapsUrl: "https://maps.google.com/maps?cid=5416074954660802581",
  hours: [
    { day: "Lunes", open: "08:00 am – 04:00 pm" },
    { day: "Martes", open: "08:00 am – 04:00 pm" },
    { day: "Miércoles", open: "08:00 am – 04:00 pm" },
    { day: "Jueves", open: "08:00 am – 04:00 pm" },
    { day: "Viernes", open: "08:00 am – 04:00 pm" },
    { day: "Sábado", open: "08:00 am – 04:00 pm" },
    { day: "Domingo", open: "Cerrado" },
  ],
} as const;

export const nav = [
  { label: "Servicios", href: "#servicios" },
  { label: "Sucursales", href: "#sucursales" },
  { label: "Reseñas", href: "#resenas" },
  { label: "Preguntas", href: "#faq" },
] as const;
