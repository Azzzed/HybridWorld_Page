import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Marquee from "./Marquee";
import Reveal from "./ui/Reveal";
import SplitText from "./ui/SplitText";
import ReviewCard, { Stars } from "./reviews/ReviewCard";
import { locations } from "@/lib/business";
import type { ReviewFeed } from "@/lib/reviews";
import "./reviews.css";

/**
 * Sección de reseñas de la home: la nota de Google de las tres sedes y las
 * reseñas en una tira. Llegan del servidor (lib/reviews.ts): de la Places API
 * con ISR o, sin key, los datos de business.ts. Sin JavaScript en el cliente.
 */
export default function Reviews({
  feed,
  eyebrow,
  title,
  source,
  starsLabel,
  googleReview,
  allHref,
  allLabel,
}: {
  feed: ReviewFeed;
  eyebrow: string;
  title: string;
  /** "Google reviews" */
  source: string;
  starsLabel: string;
  /** "Google review", cuando la reseña no trae fecha */
  googleReview: string;
  allHref: string;
  allLabel: string;
}) {
  const city = (slug: string) => locations.find((l) => l.slug === slug)?.city ?? "";

  return (
    <section className="section reviews" id="reviews">
      <div className="shell reviews__head">
        <Reveal>
          <span className="eyebrow">{eyebrow}</span>
        </Reveal>
        <SplitText className="section-title" step={12}>
          {title}
        </SplitText>
        <Reveal delay={0.08}>
          <p className="reviews__score">
            <Stars n={feed.rating} label={`${feed.rating} ${starsLabel}`} size={15} />
            <strong>{feed.rating}</strong> · {feed.count} {source}
          </p>
          <Link className="text-link" href={allHref}>
            {allLabel} <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </Reveal>
      </div>

      <Marquee duration={70} gap={16}>
        {feed.reviews.map((r, i) => (
          <ReviewCard
            key={`${r.author}-${i}`}
            review={r}
            starsLabel={starsLabel}
            meta={`${r.when || googleReview} · ${city(r.location)}`}
          />
        ))}
      </Marquee>
    </section>
  );
}
