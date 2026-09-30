/**
 * Reseñas REALES tomadas de la ficha de Google de Hybrid World, Inc.
 * (maps.google.com/maps?cid=5416074954660802581)
 *
 * No agregues reseñas inventadas aquí. Para traer las 294 automáticamente,
 * usa la Google Places API (campo `reviews`) y mapea el resultado a este tipo.
 */

export type Review = {
  author: string;
  /** avatar del autor cuando viene de la Places API */
  photo?: string;
  meta: string;
  when: string;
  rating: number;
  text: string;
  /** true cuando el texto se tomó truncado como aparece publicado */
  truncated?: boolean;
};

export const ratingSummary = {
  score: 4.7,
  count: 294,
  source: "Google",
  url: "https://maps.google.com/maps?cid=5416074954660802581",
};

export const reviews: Review[] = [
  {
    author: "Christian Diaz",
    meta: "Local Guide · 161 reseñas",
    when: "Hace 7 meses",
    rating: 5,
    text:
      "I recommend this place for all your auto repairs if you own a hybrid car this is the best place hands down to get it serviced. I brought my Prius for a new motor, the car was in and out in 2 days very quick and the car runs like a champ.",
  },
  {
    author: "Jair Freire",
    meta: "1 reseña · 1 foto",
    when: "Hace 7 meses",
    rating: 5,
    text:
      "Tengo 4 años viniendo a este taller. Todo el ambiente laboral es muy eficiente y rápidos. Tania es muy amable y te ayuda a entender el proceso. Saúl da los mejores precios, muy honesto. Les recomiendo este taller. Todos los mecánicos son movidos y saben lo que están haciendo.",
  },
  {
    author: "Nelson Guerrero",
    meta: "2 reseñas · 1 foto",
    when: "Hace 7 meses",
    rating: 5,
    text:
      "Tengo 4 años viniendo a este taller para todas mis reparaciones y mantenimientos. El ambiente laboral súper bien. Muy atentos y dedicados a su trabajo. Los mejores precios que va a encontrar. 100% recomendados.",
  },
  {
    author: "Carlos Sanchez",
    meta: "Reseña de Google",
    when: "17/09/2026",
    rating: 5,
    text: "Una semana antes me cambiaron…",
    truncated: true,
  },
  {
    author: "Jae Vara",
    meta: "Reseña de Google",
    when: "16/09/2026",
    rating: 5,
    text: "I took my daughter's car to Hybrid World after the hybrid…",
    truncated: true,
  },
];

/** Frases que Google destaca como lo más repetido en las reseñas. */
export const reviewHighlights = [
  "Honestos y puntuales, me asesoraron por teléfono y me atendieron temprano",
  "Completo servicio, buena atención, precios razonables, calidad humana",
  "Me hicieron mi transmisión de mi auto y quedé muy satisfecho 💯 recomendados",
];

/** Temas que Google agrupa por frecuencia en las reseñas. */
export const reviewTopics = [
  { topic: "prius", count: 28 },
  { topic: "batería", count: 20 },
  { topic: "garantía", count: 20 },
  { topic: "atención", count: 15 },
];
