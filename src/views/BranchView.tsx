import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, MessageCircle, Navigation, Phone } from "lucide-react";
import {
  directionsHref,
  locationPagePath,
  locations,
  photos,
  socialLinks,
  whatsappHrefForPhone,
  type Locale,
  type LocationSlug,
} from "@/lib/business";
import { closedDays, hoursSlots, localePath } from "@/lib/i18n";
import { branchPageSchema } from "@/lib/schema";
import { getReviews } from "@/lib/reviews";
import { getContent } from "@/content";
import { getBranchContent } from "@/content/locations";
import BranchHero from "@/components/branch/BranchHero";
import BranchCallBar from "@/components/branch/BranchCallBar";
import PartExplorer from "@/components/parts/PartExplorer";
import BrandStrip from "@/components/BrandStrip";
import ShopCarousel from "@/components/branch/ShopCarousel";
import ReviewCard, { Stars } from "@/components/reviews/ReviewCard";
import FaqList from "@/components/FaqList";
import LocationsMap from "@/components/locations/LocationsMap";
import JsonLd from "@/components/JsonLd";
import SocialIcon from "@/components/ui/SocialIcon";
import { CtaGhost } from "@/components/ui/Cta";
import Reveal from "@/components/ui/Reveal";
import SplitText from "@/components/ui/SplitText";
import "@/components/services.css";
import "@/components/reviews.css";
import "@/components/branch/branch.css";

/** Antetítulo y titular de sección, como los de la home: el acento en verde en la segunda línea. */
function SectionHead({ id, eyebrow, title, lede }: { id: string; eyebrow: string; title: [string, string]; lede?: string }) {
  return (
    <header className="bsec__head">
      <Reveal>
        <span className="eyebrow services__eyebrow">{eyebrow}</span>
      </Reveal>
      <SplitText id={id} className="section-title services__title" step={11}>
        {title[0]} <br />
        <span className="services__accent">{title[1]}</span>
      </SplitText>
      {lede && (
        <Reveal delay={0.1}>
          <p className="section-lede services__lede">{lede}</p>
        </Reveal>
      )}
    </header>
  );
}

/**
 * Página de una sucursal (/locations/<slug>): hero con el escáner, batería y
 * motor (PartExplorer), servicios, reseñas, preguntas, visita y cierre.
 * Teléfono, horario, dirección, redes y reseñas salen de business.ts y de la
 * ficha de Google; los textos, de src/content/locations.
 */
export default async function BranchView({ locale, slug }: { locale: Locale; slug: LocationSlug }) {
  const l = locations.find((x) => x.slug === slug);
  const b = getBranchContent(slug, locale);
  if (!l || !b) notFound();

  const c = getContent(locale);
  const href = (path: string) => localePath(locale, path);
  const tel = `tel:${l.phone.tel}`;
  const whatsapp = whatsappHrefForPhone(l.phone, `${c.ui.whatsappMessage} ${l.city}`);
  const directions = directionsHref(l);
  const socials = socialLinks(l);
  const closed = closedDays(l.hours, locale);

  const crumbs = [
    { name: c.ui.breadcrumbHome, path: "/" },
    { name: c.ui.nav.locations, path: "/locations" },
    { name: l.city, path: locationPagePath(l) },
  ];

  // Reseñas: la nota de la ficha de la sede y, con la Places API, sus reseñas reales
  const feed = await getReviews(locale);
  const place = feed.places.find((p) => p.slug === slug);
  const reviews = feed.reviews.filter((r) => r.location === slug);

  // Fotos del taller: las de la sede tal cual y, con `photo`, las de business.ts
  const shopPhotos = b.gallery.items.map((item) =>
    "photo" in item
      ? {
          title: item.title,
          src: photos[item.photo].src,
          alt: photos[item.photo].alt[locale],
          width: photos[item.photo].width,
          height: photos[item.photo].height,
        }
      : item,
  );

  return (
    <main id="main" className="branch-page">
      <JsonLd
        data={branchPageSchema(l, locale, {
          title: b.title,
          description: b.description,
          shopDescription: b.schemaDescription,
          crumbs,
        })}
      />

      <BranchHero
        crumbs={crumbs.map((cr, i) => ({ name: cr.name, href: i < crumbs.length - 1 ? href(cr.path) : undefined }))}
        crumbsLabel={c.ui.breadcrumbLabel}
        h1={b.hero.h1}
        title={b.hero.title}
        lede={b.hero.lede}
        call={{ href: tel, label: b.hero.callCta }}
        directions={{ href: directions, label: b.hero.directionsCta }}
        hours={hoursSlots(l.hours, locale, true)[0]}
        spanish={b.hero.spanish}
        street={l.street}
      />

      <BrandStrip label={c.home.brandsLabel} />

      {/* ---------- 01 Batería ---------- */}
      <section className="section bsec" id="battery" aria-labelledby="battery-title">
        <div className="shell">
          <PartExplorer
            id="battery"
            branch={slug}
            copy={b.battery}
            stepLabel={b.common.step}
            cta={{ href: tel, label: b.hero.callCta }}
            header={<SectionHead id="battery-title" eyebrow={b.battery.eyebrow} title={b.battery.title} />}
          />
        </div>
      </section>

      {/* ---------- 02 Motor (la foto a la izquierda) ---------- */}
      <section className="section bsec" id="engine" aria-labelledby="engine-title">
        <div className="shell">
          <PartExplorer
            id="engine"
            branch={slug}
            side="left"
            copy={b.engine}
            stepLabel={b.common.step}
            header={<SectionHead id="engine-title" eyebrow={b.engine.eyebrow} title={b.engine.title} />}
          />
        </div>
      </section>

      {/* ---------- Fotos del taller ---------- */}
      <section className="section bsec" id="shop" aria-labelledby="shop-title">
        <div className="shell">
          <SectionHead id="shop-title" eyebrow={b.gallery.eyebrow} title={b.gallery.title} lede={b.gallery.lede} />
          <ShopCarousel photos={shopPhotos} label={b.gallery.label} />
          <p className="see-all">
            <Link className="text-link" href={href("/services")}>
              {c.ui.seeAll.services} <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </p>
        </div>
      </section>

      {/* ---------- Reseñas (solo de esta sede, sin inventar nada) ---------- */}
      {place && (
        <section className="section bsec breviews" id="reviews" aria-labelledby="reviews-title">
          <div className="shell">
            <SectionHead id="reviews-title" eyebrow={b.reviews.eyebrow} title={b.reviews.title} />
            <div className="breviews__summary">
              <p className="reviews__score breviews__score">
                <Stars n={place.rating} label={`${place.rating} ${c.ui.starsLabel}`} size={16} />
                <strong>{place.rating}</strong> · {place.count} {c.home.reviews.source}
              </p>
              <div className="breviews__actions">
                <CtaGhost href={place.url} target="_blank" size="sm">
                  {c.ui.readReviews} <ArrowUpRight size={15} aria-hidden="true" />
                </CtaGhost>
                <CtaGhost href={place.writeUrl} target="_blank" size="sm">
                  {c.ui.writeReview} <ArrowUpRight size={15} aria-hidden="true" />
                </CtaGhost>
              </div>
            </div>
            {reviews.length > 0 && (
              <div className="rev-grid">
                {reviews.map((r, i) => (
                  <ReviewCard key={`${r.author}-${i}`} review={r} starsLabel={c.ui.starsLabel} meta={r.when || c.ui.googleReview} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ---------- Preguntas ---------- */}
      <section className="section bsec" id="faq" aria-labelledby="faq-title">
        <div className="shell bfaq__layout">
          <header className="bsec__head">
            <Reveal>
              <span className="eyebrow services__eyebrow">{b.faq.eyebrow}</span>
            </Reveal>
            <SplitText id="faq-title" className="section-title services__title" step={11}>
              {b.faq.title}
            </SplitText>
          </header>
          <FaqList items={b.faq.items} />
        </div>
      </section>

      {/* ---------- 03 Visita ---------- */}
      <section className="section bsec" id="visit" aria-labelledby="visit-title">
        <div className="shell bvisit__layout">
          <SectionHead id="visit-title" eyebrow={b.visit.eyebrow} title={b.visit.title} />

          <div className="bento-card bvisit__card">
            <dl className="bvisit__dl">
              <div>
                <dt>{b.visit.address}</dt>
                <dd>
                  <address>
                    {l.street}
                    <br />
                    {l.city}, {l.region} {l.postalCode}
                  </address>
                </dd>
              </div>
              <div>
                <dt>{b.visit.phone}</dt>
                <dd>
                  <a href={tel}>{l.phone.display}</a>
                </dd>
              </div>
              <div>
                <dt>{b.visit.hours}</dt>
                <dd>
                  {hoursSlots(l.hours, locale).map((s) => (
                    <span key={s.days}>
                      {s.days} · {s.time}
                    </span>
                  ))}
                  {closed && (
                    <span className="bvisit__closed">
                      {closed} · {c.ui.closed}
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt>{b.visit.languages}</dt>
                <dd>{c.ui.languages}</dd>
              </div>
            </dl>
          </div>

          {b.visit.note && <p className="bvisit__note">{b.visit.note}</p>}

          <div className="bvisit__actions">
            <a className="hero-scroll__btn bvisit__wide-only" href={tel}>
              <Phone size={18} strokeWidth={2.2} aria-hidden="true" />
              {b.visit.call}
            </a>
            <CtaGhost href={whatsapp} target="_blank" className="bvisit__wide-only">
              <MessageCircle size={17} aria-hidden="true" /> {c.ui.whatsapp}
            </CtaGhost>
            <CtaGhost href={directions} target="_blank">
              <Navigation size={17} aria-hidden="true" /> {c.ui.directions}
            </CtaGhost>
          </div>

          {socials.length > 0 && (
            <div className="bvisit__social">
              <p className="bvisit__follow">{b.visit.follow}</p>
              <ul className="bvisit__socials">
                {socials.map((s) => (
                  <li key={s.network}>
                    {/* Sin aria-label: el texto visible (red y usuario) ya es el nombre del enlace */}
                    <a className="bvisit__soc" href={s.url} target="_blank" rel="me noopener">
                      <SocialIcon network={s.network} size={18} />
                      <span className="bvisit__soc-name">{s.name}</span>
                      <span className="bvisit__soc-handle">{s.handle}</span>
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bvisit__map">
            <LocationsMap
              points={[{ slug: l.slug, city: l.city, coords: [l.geo.lat, l.geo.lng] }]}
              credit={c.home.locations.mapCredit}
              label={b.visit.mapLabel}
            />
          </div>
        </div>
      </section>

      {/* ---------- Cierre ---------- */}
      <div className="shell bcta">
        <aside className="cta-band" aria-labelledby="cta-title">
          <div>
            <h2 className="cta-band__title" id="cta-title">
              {b.cta.title}
            </h2>
            <p className="cta-band__text">{b.cta.text}</p>
          </div>
          <div className="cta-band__actions">
            <a className="hero-scroll__btn" href={tel}>
              <Phone size={18} strokeWidth={2.2} aria-hidden="true" />
              {b.hero.callCta}
            </a>
            <CtaGhost href={whatsapp} target="_blank">
              <MessageCircle size={17} aria-hidden="true" /> {c.ui.whatsapp}
            </CtaGhost>
          </div>
        </aside>
      </div>

      <BranchCallBar
        watch="branch-hero-cta"
        label={b.bar.label}
        call={{ href: tel, label: b.bar.call }}
        whatsapp={{ href: whatsapp, label: c.ui.whatsapp }}
        directions={{ href: directions, label: c.ui.directions }}
      />
    </main>
  );
}
