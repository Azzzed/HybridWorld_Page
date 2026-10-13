import { Star } from "lucide-react";
import type { Review } from "@/lib/reviews";

export function Stars({ n = 5, label, size = 12 }: { n?: number; label: string; size?: number }) {
  const full = Math.round(n);
  return (
    <span className="stars" role="img" aria-label={label}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} fill={i < full ? "currentColor" : "none"} strokeWidth={i < full ? 0 : 1.5} aria-hidden="true" />
      ))}
    </span>
  );
}

/**
 * Una reseña de Google: estrellas, texto, autor (enlazado a su perfil cuando
 * la API lo da, como piden las condiciones de Google) y fecha o sede.
 */
export default function ReviewCard({
  review: r,
  starsLabel,
  meta,
}: {
  review: Review;
  /** "out of 5 stars" */
  starsLabel: string;
  /** Lo que va bajo el autor: la fecha o "Reseña de Google · Norwalk" */
  meta: string;
}) {
  return (
    <article className="rev-card">
      <Stars n={r.rating} label={`${r.rating} ${starsLabel}`} />
      <p className="rev-card__text">“{r.text}”</p>
      <footer className="rev-card__by">
        {r.photo ? (
          // Avatar remoto de Google (lh3.googleusercontent.com): sin optimizar
          // eslint-disable-next-line @next/next/no-img-element
          <img className="rev-card__avatar" src={r.photo} alt="" width={30} height={30} loading="lazy" referrerPolicy="no-referrer" />
        ) : (
          <span className="rev-card__avatar rev-card__avatar--letter" aria-hidden>
            {r.author.charAt(0)}
          </span>
        )}
        <span className="rev-card__who">
          {r.authorUrl ? (
            <a href={r.authorUrl} target="_blank" rel="noreferrer noopener">
              <strong>{r.author}</strong>
            </a>
          ) : (
            <strong>{r.author}</strong>
          )}
          <em>{meta}</em>
        </span>
      </footer>
    </article>
  );
}
