import { ExternalLink, PenLine } from "lucide-react";
import { locations, type Locale } from "@/lib/business";
import { getReviews } from "@/lib/reviews";
import { getContent } from "@/content";
import PageIntro from "@/components/page/PageIntro";
import CtaBand from "@/components/page/CtaBand";
import ReviewCard, { Stars } from "@/components/reviews/ReviewCard";
import "@/components/reviews.css";

/**
 * /reviews: la nota de Google de cada sede, enlaces para leer todas las
 * reseñas o dejar una, y las reseñas más recientes (Places API con ISR).
 * Sin marcado de reseñas en JSON-LD: Google no lo admite en negocios locales.
 */
export default async function ReviewsView({ locale }: { locale: Locale }) {
  const c = getContent(locale);
  const page = c.reviewsPage;
  const feed = await getReviews(locale);
  const city = (slug: string) => locations.find((l) => l.slug === slug)?.city ?? "";

  return (
    <main id="main" className="page">
      <div className="shell">
        <PageIntro locale={locale} path="/reviews" name={c.ui.nav.reviews} eyebrow={c.home.reviews.eyebrow} title={page.h1} intro={page.intro}>
          <p className="reviews-summary">
            <Stars n={feed.rating} label={`${feed.rating} ${c.ui.starsLabel}`} size={20} />
            <span>{page.summary.replace("{rating}", String(feed.rating)).replace("{count}", String(feed.count))}</span>
          </p>
        </PageIntro>

        <section className="page-section" aria-labelledby="places-title">
          <h2 id="places-title" className="page-section__title">
            {page.placesTitle}
          </h2>
          <ul className="place-grid">
            {feed.places.map((p) => (
              <li key={p.slug} className="place-card">
                <h3>{p.city}</h3>
                <p className="place-card__score">
                  <strong>{p.rating}</strong>
                  <Stars n={p.rating} label={`${p.rating} ${c.ui.starsLabel}`} size={14} />
                </p>
                <p className="place-card__count">
                  {p.count} {c.ui.reviewsLabel}
                </p>
                <p className="place-card__links">
                  <a href={p.url} target="_blank" rel="noreferrer noopener">
                    <ExternalLink size={14} aria-hidden="true" /> {c.ui.readReviews}
                  </a>
                  <a href={p.writeUrl} target="_blank" rel="noreferrer noopener">
                    <PenLine size={14} aria-hidden="true" /> {c.ui.writeReview}
                  </a>
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="page-section" aria-labelledby="latest-title">
          <h2 id="latest-title" className="page-section__title">
            {page.latestTitle}
          </h2>
          {!feed.live && <p className="page-section__lede">{page.bundledNote}</p>}
          <div className="rev-grid">
            {feed.reviews.map((r, i) => (
              <ReviewCard
                key={`${r.author}-${i}`}
                review={r}
                starsLabel={c.ui.starsLabel}
                meta={`${r.when || c.ui.googleReview} · ${city(r.location)}`}
              />
            ))}
          </div>
        </section>

        <CtaBand locale={locale} />
      </div>
    </main>
  );
}
