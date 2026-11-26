"use client";

import { useSyncExternalStore } from "react";
import { ReactGoogleReviews, type ReactGoogleReview as GoogleReview } from "react-google-reviews";
import "react-google-reviews/dist/index.css";
import type { Locale } from "@/lib/business";
import type { Review } from "@/lib/reviews";
import "./google-reviews-carousel.css";

export type GoogleReviewsCarouselProps = {
  locale: Locale;
  /** Las reseñas de la sede, leídas en el servidor (lib/reviews.ts: Featurable o Places API) */
  reviews: Review[];
  labels: { readMore: string; readLess: string; loading: string; error: string };
};

/** Nuestras reseñas (lib/reviews.ts) en el formato de react-google-reviews. */
const toGoogleReview = (r: Review): GoogleReview => ({
  reviewId: null,
  reviewer: { displayName: r.author, profilePhotoUrl: r.photo ?? "", isAnonymous: false },
  starRating: r.rating,
  comment: r.text,
  createTime: r.publishTime ?? null,
  updateTime: r.publishTime ?? null,
});

/** "hace 3 semanas" / "3 weeks ago", en el idioma de la página. */
function relativeDate(locale: Locale) {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const steps: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 365 * 864e5],
    ["month", 30 * 864e5],
    ["week", 7 * 864e5],
    ["day", 864e5],
  ];
  return (date: Date) => {
    const diff = date.getTime() - Date.now();
    for (const [unit, ms] of steps) if (Math.abs(diff) >= ms) return rtf.format(Math.round(diff / ms), unit);
    return rtf.format(0, "day");
  };
}

/**
 * Cuántas reseñas caben a la vez: 1 en teléfono, 2 en tablet, 3 en escritorio.
 * El `responsive` de react-slick que trae la librería no se aplica al montar
 * (en móvil salían 3 columnas estrechas), así que se calcula aquí.
 */
const QUERIES = ["(min-width: 1024px)", "(min-width: 640px)"];
const subscribe = (cb: () => void) => {
  const mqs = QUERIES.map((q) => window.matchMedia(q));
  mqs.forEach((m) => m.addEventListener("change", cb));
  return () => mqs.forEach((m) => m.removeEventListener("change", cb));
};
const slotsNow = () => (window.matchMedia(QUERIES[0]).matches ? 3 : window.matchMedia(QUERIES[1]).matches ? 2 : 1);
const useSlots = () => useSyncExternalStore(subscribe, slotsNow, () => 1);

/**
 * Carrusel de reseñas de Google con react-google-reviews (Featurable, MIT).
 * Sin `structuredData`: el componente marcaría las reseñas como Product con
 * aggregateRating, y Google trata como "self-serving" las reseñas de un
 * negocio local en su propia web.
 */
export default function GoogleReviewsCarousel({ locale, reviews, labels }: GoogleReviewsCarouselProps) {
  const slots = useSlots();
  const reduceMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const common = {
    layout: "carousel" as const,
    theme: "dark" as const,
    structuredData: false as const,
    logoVariant: "icon" as const,
    nameDisplay: "firstAndLastInitials" as const,
    dateDisplay: "relative" as const,
    getRelativeDate: relativeDate(locale),
    maxCharacters: 180,
    maxItems: slots,
    carouselAutoplay: !reduceMotion,
    carouselSpeed: 6000,
    hideEmptyReviews: true,
    readMoreLabel: labels.readMore,
    readLessLabel: labels.readLess,
    loadingMessage: labels.loading,
    errorMessage: labels.error,
    carouselClassName: "grc",
    reviewCardClassName: "grc__card",
    reviewTextClassName: "grc__text",
    reviewReadMoreClassName: "grc__more",
    reviewerNameClassName: "grc__name",
    reviewerDateClassName: "grc__date",
    carouselBtnClassName: "grc__btn",
  };

  return <ReactGoogleReviews {...common} reviews={reviews.map(toGoogleReview)} />;
}
