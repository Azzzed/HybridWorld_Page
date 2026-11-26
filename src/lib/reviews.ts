import "server-only";
import { googleListingHref, locations, writeReviewHref, type Locale, type LocationSlug } from "./business";

/**
 * Reseñas de Google de las tres sedes.
 *
 * Una sede con `google.featurableId` (business.ts) las lee de su widget de
 * Featurable: nota, total y reseñas reales de la ficha, sin key.
 *
 * Con GOOGLE_PLACES_API_KEY (variable de entorno en Vercel), se leen de la
 * Places API (New) en el servidor, una ficha por sede (Place ID en
 * business.ts), y Next las guarda en caché: las páginas que las muestran se
 * regeneran como mucho una vez al día (ISR). La key nunca llega al navegador.
 *
 * Sin key, o si la API falla, cada sede usa la nota y el total que tiene en
 * business.ts y se muestran las reseñas reales copiadas de la ficha de
 * Norwalk (abajo). No inventes reseñas aquí.
 *
 * La Places API devuelve como mucho 5 reseñas por ficha (hasta 15 en total),
 * y sus condiciones piden mostrar el nombre del autor, enlazar a su perfil y
 * a Google.
 */

/** Cada cuánto se refrescan, en segundos (24 h). */
export const REVIEWS_REVALIDATE = 86400;

export type Review = {
  author: string;
  authorUrl?: string;
  photo?: string;
  /** "hace 2 semanas"; vacío en las reseñas copiadas a mano */
  when: string;
  publishTime?: string;
  rating: number;
  text: string;
  location: LocationSlug;
};

export type PlaceRating = {
  slug: LocationSlug;
  city: string;
  rating: number;
  count: number;
  /** La ficha en Google Maps */
  url: string;
  /** Dejar una reseña */
  writeUrl: string;
};

export type ReviewFeed = {
  /** true cuando vienen de la Places API */
  live: boolean;
  places: PlaceRating[];
  /** Media ponderada de las tres fichas */
  rating: number;
  /** Total de opiniones de las tres fichas */
  count: number;
  reviews: Review[];
};

/** Reseñas reales tomadas a mano de la ficha de Google de Norwalk. */
const BUNDLED: Omit<Review, "when">[] = [
  {
    author: "Christian Diaz",
    rating: 5,
    location: "norwalk",
    text: "I recommend this place for all your auto repairs if you own a hybrid car this is the best place hands down to get it serviced. I brought my Prius for a new motor, the car was in and out in 2 days very quick and the car runs like a champ.",
  },
  {
    author: "Jair Freire",
    rating: 5,
    location: "norwalk",
    text: "Tengo 4 años viniendo a este taller. Todo el ambiente laboral es muy eficiente y rápidos. Tania es muy amable y te ayuda a entender el proceso. Saúl da los mejores precios, muy honesto. Les recomiendo este taller. Todos los mecánicos son movidos y saben lo que están haciendo.",
  },
  {
    author: "Nelson Guerrero",
    rating: 5,
    location: "norwalk",
    text: "Tengo 4 años viniendo a este taller para todas mis reparaciones y mantenimientos. El ambiente laboral súper bien. Muy atentos y dedicados a su trabajo. Los mejores precios que va a encontrar. 100% recomendados.",
  },
];

type PlacesReview = {
  rating?: number;
  relativePublishTimeDescription?: string;
  publishTime?: string;
  text?: { text?: string };
  originalText?: { text?: string };
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
};

type PlacesResponse = {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: PlacesReview[];
};

const basePlace = (l: (typeof locations)[number]): PlaceRating => ({
  slug: l.slug,
  city: l.city,
  rating: l.google.rating,
  count: l.google.count,
  url: googleListingHref(l),
  writeUrl: writeReviewHref(l),
});

/** Nota media ponderada por número de opiniones, a un decimal. */
const summarize = (places: PlaceRating[]) => {
  const count = places.reduce((sum, p) => sum + p.count, 0);
  const rating = count ? places.reduce((sum, p) => sum + p.rating * p.count, 0) / count : 0;
  return { count, rating: Math.round(rating * 10) / 10 };
};

async function fetchPlace(key: string, placeId: string, locale: Locale) {
  const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}?languageCode=${locale}`, {
    headers: {
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews",
    },
    next: { revalidate: REVIEWS_REVALIDATE },
  });
  if (!res.ok) throw new Error(`Places ${placeId}: ${res.status}`);
  return (await res.json()) as PlacesResponse;
}

/* ------------------------------------------------------------------ */
/* Featurable (widget gratuito conectado a la ficha de Google)          */
/* ------------------------------------------------------------------ */

type FeaturableV2 = {
  success: boolean;
  widget?: {
    isExampleReviews?: boolean;
    gbpLocationSummary?: { reviewsCount?: number; rating?: number };
    reviews?: {
      author?: { name?: string; avatarUrl?: string | null; profileUrl?: string | null };
      text?: string;
      originalText?: string;
      rating?: { value?: number };
      publishedAt?: string;
    }[];
  };
};

/**
 * Nota, total y reseñas de una ficha desde su widget de Featurable (API v2,
 * pública, sin key). Se guarda en caché igual que la Places API.
 */
async function fetchFeaturable(id: string) {
  const res = await fetch(`https://api.featurable.com/v2/widgets/${id}`, { next: { revalidate: REVIEWS_REVALIDATE } });
  if (!res.ok) throw new Error(`Featurable ${id}: ${res.status}`);
  const data = (await res.json()) as FeaturableV2;
  const w = data.widget;
  // Un widget sin ficha conectada devuelve reseñas de ejemplo: esas nunca se muestran
  if (!data.success || !w || w.isExampleReviews) throw new Error(`Featurable ${id}: sin reseñas reales`);
  return w;
}

type PlaceResult = { place: PlaceRating; reviews: Review[]; live: boolean };

/** Una sede: Featurable si tiene widget; si no, Places API con key; si no, business.ts. */
async function loadPlace(l: (typeof locations)[number], locale: Locale, key: string | undefined): Promise<PlaceResult> {
  const base = basePlace(l);

  if (l.google.featurableId) {
    try {
      const w = await fetchFeaturable(l.google.featurableId);
      const reviews: Review[] = (w.reviews ?? []).flatMap((r) => {
        const text = (r.originalText || r.text || "").replace(/\s+/g, " ").trim();
        if (!text) return [];
        return [
          {
            author: r.author?.name ?? "Google user",
            authorUrl: r.author?.profileUrl ?? undefined,
            photo: r.author?.avatarUrl ?? undefined,
            when: "",
            publishTime: r.publishedAt,
            rating: r.rating?.value ?? 5,
            text,
            location: l.slug,
          },
        ];
      });
      return {
        place: {
          ...base,
          rating: w.gbpLocationSummary?.rating ?? base.rating,
          count: w.gbpLocationSummary?.reviewsCount ?? base.count,
        },
        reviews,
        live: true,
      };
    } catch (err) {
      console.warn(`[reviews] Featurable ${l.city}:`, err);
    }
  }

  if (key) {
    try {
      const place = await fetchPlace(key, l.google.placeId, locale);
      const reviews: Review[] = [];
      for (const r of place.reviews ?? []) {
        const text = (r.originalText?.text ?? r.text?.text ?? "").replace(/\s+/g, " ").trim();
        if (!text) continue;
        reviews.push({
          author: r.authorAttribution?.displayName ?? "Google user",
          authorUrl: r.authorAttribution?.uri,
          photo: r.authorAttribution?.photoUri,
          when: r.relativePublishTimeDescription ?? "",
          publishTime: r.publishTime,
          rating: r.rating ?? 5,
          text,
          location: l.slug,
        });
      }
      return {
        place: { ...base, rating: place.rating ?? base.rating, count: place.userRatingCount ?? base.count, url: place.googleMapsUri ?? base.url },
        reviews,
        live: true,
      };
    } catch (err) {
      console.warn(`[reviews] Places API ${l.city}:`, err);
    }
  }

  // Sin fuente en vivo: la nota de business.ts y, si las hay, sus reseñas copiadas a mano
  return { place: base, reviews: BUNDLED.filter((r) => r.location === l.slug).map((r) => ({ ...r, when: "" })), live: false };
}

export async function getReviews(locale: Locale): Promise<ReviewFeed> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const results = await Promise.all(locations.map((l) => loadPlace(l, locale, key)));

  const places = results.map((r) => r.place);
  const live = results.some((r) => r.live);
  // Las más recientes primero
  const reviews = results.flatMap((r) => r.reviews).sort((a, b) => (b.publishTime ?? "").localeCompare(a.publishTime ?? ""));

  return {
    live,
    places,
    ...summarize(places),
    reviews,
  };
}
