import { ratingSummary, reviews as bundled, type Review } from "../data/reviews";

/**
 * Fuente de reseñas del sitio.
 *
 * Intenta leer `/reviews.json`, que genera `npm run reviews` desde la
 * Google Places API. Si el archivo no existe todavía (o la petición falla),
 * devuelve las reseñas empaquetadas en `src/data/reviews.ts`, así la sección
 * nunca se queda vacía.
 */

export type ReviewFeed = {
  reviews: Review[];
  rating: number;
  count: number;
  url: string;
  /** true cuando los datos vienen de la API y no del archivo local */
  live: boolean;
  fetchedAt?: string;
};

const fallback: ReviewFeed = {
  reviews: bundled,
  rating: ratingSummary.score,
  count: ratingSummary.count,
  url: ratingSummary.url,
  live: false,
};

type RemotePayload = {
  fetchedAt?: string;
  rating?: number | null;
  count?: number | null;
  url?: string;
  reviews?: Array<{
    author?: string;
    photo?: string;
    meta?: string;
    when?: string;
    rating?: number;
    text?: string;
  }>;
};

export async function loadReviews(signal?: AbortSignal): Promise<ReviewFeed> {
  try {
    const res = await fetch("/reviews.json", { signal, cache: "no-cache" });
    if (!res.ok) return fallback;

    const data = (await res.json()) as RemotePayload;
    const list = (data.reviews ?? [])
      .filter((r) => r.text && r.text.trim().length > 0)
      .map<Review>((r) => ({
        author: r.author ?? "Cliente de Google",
        photo: r.photo ?? "",
        meta: r.meta ?? "Reseña de Google",
        when: r.when ?? "",
        rating: r.rating ?? 5,
        text: r.text!.trim(),
      }));

    if (list.length === 0) return fallback;

    return {
      reviews: list,
      rating: data.rating ?? fallback.rating,
      count: data.count ?? fallback.count,
      url: data.url ?? fallback.url,
      live: true,
      fetchedAt: data.fetchedAt,
    };
  } catch {
    return fallback;
  }
}

export { fallback as bundledReviews };
