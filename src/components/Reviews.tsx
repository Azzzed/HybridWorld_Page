import { useEffect, useState } from "react";
import { ArrowUpRight, Star } from "lucide-react";
import Marquee from "./Marquee";
import Reveal from "./ui/Reveal";
import SplitText from "./ui/SplitText";
import { loadReviews, bundledReviews, type ReviewFeed } from "../lib/reviews";
import "./reviews.css";

function Stars({ n = 5 }: { n?: number }) {
  return (
    <span className="stars" aria-label={`${n} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={12} fill={i < n ? "currentColor" : "none"} strokeWidth={i < n ? 0 : 1.5} />
      ))}
    </span>
  );
}

export default function Reviews() {
  /* Arranca con las reseñas empaquetadas y las sustituye por las de la
     Places API en cuanto /reviews.json responde. */
  const [feed, setFeed] = useState<ReviewFeed>(bundledReviews);

  useEffect(() => {
    const ctrl = new AbortController();
    loadReviews(ctrl.signal).then(setFeed);
    return () => ctrl.abort();
  }, []);

  return (
    <section className="section reviews" id="resenas">
      <div className="shell reviews__head">
        <Reveal>
          <span className="eyebrow">Clientes</span>
        </Reveal>
        <SplitText as="h2" className="section-title" text="Lo que dicen en Google" step={12} />
        <Reveal delay={0.08}>
          <a
            className="reviews__link"
            href={feed.url}
            target="_blank"
            rel="noreferrer noopener"
          >
            {feed.rating} ★ · {feed.count} reseñas <ArrowUpRight size={14} />
          </a>
        </Reveal>
      </div>

      <Marquee duration={70} gap={16}>
        {feed.reviews.map((r, i) => (
          <article className="rev-card" key={`${r.author}-${i}`}>
            <Stars n={r.rating} />
            <p className="rev-card__text">“{r.text}”</p>
            <footer className="rev-card__by">
              {r.photo ? (
                <img className="rev-card__avatar" src={r.photo} alt="" loading="lazy" />
              ) : (
                <span className="rev-card__avatar rev-card__avatar--letter" aria-hidden>
                  {r.author.charAt(0)}
                </span>
              )}
              <span className="rev-card__who">
                <strong>{r.author}</strong>
                <em>{r.when}</em>
              </span>
            </footer>
          </article>
        ))}
      </Marquee>
    </section>
  );
}
