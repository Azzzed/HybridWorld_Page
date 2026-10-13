import { preload } from "react-dom";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  business,
  directionsHref,
  fullAddress,
  locations,
  photos,
  services,
  shopPhotoKeys,
  whatsappHrefForPhone,
  type Locale,
} from "@/lib/business";
import { hoursSummary, localePath } from "@/lib/i18n";
import { homeSchema } from "@/lib/schema";
import { getReviews } from "@/lib/reviews";
import { faqItems, getContent } from "@/content";
import { VERTICAL_QUERY, WIDE_QUERY } from "@/components/hero-video/sequence";
import HeroScroll from "@/components/HeroScroll";
import BrandStrip from "@/components/BrandStrip";
import ServiceBento from "@/components/services/ServiceBento";
import ShopReveal from "@/components/ShopReveal";
import CarStrip from "@/components/CarStrip";
import BranchExplorer from "@/components/locations/BranchExplorer";
import Reviews from "@/components/Reviews";
import FaqList from "@/components/FaqList";
import GallerySpiral from "@/components/GallerySpiral";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/ui/Reveal";
import SplitText from "@/components/ui/SplitText";
import "@/components/services.css";
import "@/components/contact.css";

/**
 * Póster del hero: el primer fotograma de cada video como imagen estática,
 * con dirección de arte (vertical en móvil, horizontal en el resto) y
 * prioridad alta. Va sin optimizar a propósito: es la misma URL que pide
 * luego el canvas, así que el primer fotograma de la secuencia sale de la
 * caché en vez de bajarse dos veces.
 */
function HeroPoster({ alt }: { alt: string }) {
  const common = { alt, sizes: "100vw", unoptimized: true } as const;
  const wide = getImageProps({ ...common, src: "/hero/prius-1280/001.webp", width: 1280, height: 720 }).props;
  const tall = getImageProps({ ...common, src: "/hero/prius-vertical/001.webp", width: 720, height: 1280 }).props;
  return (
    <picture className="hero-scroll__poster">
      <source media={VERTICAL_QUERY} srcSet={tall.src} type="image/webp" width={720} height={1280} />
      <img {...wide} alt={alt} fetchPriority="high" loading="eager" decoding="async" />
    </picture>
  );
}

/** Enlace de una sección de la home a su página completa. */
function SeeAll({ href, label }: { href: string; label: string }) {
  return (
    <p className="see-all">
      <Link className="text-link" href={href}>
        {label} <ArrowRight size={15} aria-hidden="true" />
      </Link>
    </p>
  );
}

export default async function HomeView({ locale }: { locale: Locale }) {
  // Precarga del póster que toque según la pantalla: un <link rel=preload>
  // con media query en el <head> por cada video.
  preload("/hero/prius-1280/001.webp", { as: "image", type: "image/webp", fetchPriority: "high", media: WIDE_QUERY });
  preload("/hero/prius-vertical/001.webp", { as: "image", type: "image/webp", fetchPriority: "high", media: VERTICAL_QUERY });

  const c = getContent(locale);
  const href = (path: string) => localePath(locale, path);
  const reviews = await getReviews(locale);

  // "Ver servicio" lleva a la sección de ese servicio en /services
  const bentoItems = services.map((s) => ({
    service: s,
    title: s.name[locale],
    label: s.label[locale],
    description: s.short[locale],
    alt: photos[s.photo].alt[locale],
    href: `${href("/services")}#${s.id}`,
    linkLabel: c.ui.viewService,
    linkAriaLabel: `${c.ui.viewService}: ${s.name[locale]}`,
  }));

  const gallery = [
    ...shopPhotoKeys.map((k) => ({ src: photos[k].src, alt: photos[k].alt[locale] })),
    { src: "/img/cars/prius-gen3-a.jpg", alt: "Toyota Prius ZVW30" },
    { src: "/img/cars/prius-gen3-c.jpg", alt: "Toyota Prius XW30" },
    { src: "/img/cars/tesla-model3.jpg", alt: "Tesla Model 3" },
    { src: "/img/cars/lexus-rx.jpg", alt: "Lexus RX 450h" },
  ];

  return (
    <main id="main">
      <JsonLd data={homeSchema(locale, c.home.description)} />

      <HeroScroll
        content={c.home.hero}
        poster={<HeroPoster alt={c.home.hero.posterAlt} />}
        phone={business.phone}
        cities={locations.map((l) => l.city)}
        aboutHref="#services"
        locationsHref="#locations"
      />

      <BrandStrip label={c.home.brandsLabel} />

      {/* ---------- Servicios ---------- */}
      <section className="section services" id="services">
        {/* Foto del taller casi apagada detrás del titular: decorativa y diferida */}
        <Image className="services__bg" src={photos.transmission.src} alt="" width={1600} height={893} sizes="64vw" aria-hidden="true" />
        <div className="shell">
          <header className="services__head">
            <Reveal>
              <span className="eyebrow services__eyebrow">{c.home.services.eyebrow}</span>
            </Reveal>
            <SplitText className="section-title services__title" step={11}>
              {c.home.services.title[0]} <br />
              <span className="services__accent">{c.home.services.title[1]}</span>
            </SplitText>
            <Reveal delay={0.1}>
              <p className="section-lede services__lede">{c.home.services.lede}</p>
            </Reveal>
          </header>

          <ServiceBento items={bentoItems} />
          <SeeAll href={href("/services")} label={c.ui.seeAll.services} />
        </div>
      </section>

      <ShopReveal
        photo={{ ...photos.team, alt: photos.team.alt[locale] }}
        title={c.home.team.title}
        hint={c.home.team.hint}
        text={c.home.team.text}
        cta={c.home.team.cta}
        ctaHref="#locations"
        label={c.home.team.title}
      />

      <CarStrip eyebrow={c.home.cars.eyebrow} title={c.home.cars.title} />

      {/* ---------- Sucursales ---------- */}
      <section className="section locations" id="locations">
        <div className="shell">
          <header className="locations__head">
            <Reveal>
              <span className="eyebrow">{c.home.locations.eyebrow}</span>
            </Reveal>
            <SplitText className="section-title" step={12}>
              {c.home.locations.title}
            </SplitText>
          </header>

          <BranchExplorer
            branches={locations.map((l) => ({
              slug: l.slug,
              city: l.city,
              coords: [l.geo.lat, l.geo.lng],
              isNew: l.isNew,
              area: l.isMain ? `${c.ui.mainBadge} · ${l.area[locale]}` : l.area[locale],
              address: fullAddress(l),
              hours: hoursSummary(l.hours, locale),
              phone: l.phone,
              whatsappHref: whatsappHrefForPhone(l.phone, `${c.ui.whatsappMessage} ${l.city}`),
              directionsHref: directionsHref(l),
            }))}
            labels={{
              tablist: c.home.locations.eyebrow,
              newBadge: c.ui.newBadge,
              advisor: c.ui.serviceAdvisor,
              languages: c.ui.languages,
              whatsapp: c.ui.whatsapp,
              directions: c.ui.directions,
              showAll: c.home.locations.showAll,
              mapCredit: c.home.locations.mapCredit,
            }}
          />
          <SeeAll href={href("/locations")} label={c.ui.seeAll.locations} />
        </div>
      </section>

      <Reviews
        feed={reviews}
        eyebrow={c.home.reviews.eyebrow}
        title={c.home.reviews.title}
        source={c.home.reviews.source}
        starsLabel={c.ui.starsLabel}
        googleReview={c.ui.googleReview}
        allHref={href("/reviews")}
        allLabel={c.ui.seeAll.reviews}
      />

      {/* ---------- Preguntas + galería ---------- */}
      <section className="section contact" id="faq">
        <div className="shell contact__layout">
          <div className="faq">
            <Reveal>
              <span className="eyebrow">{c.home.faq.eyebrow}</span>
            </Reveal>
            <SplitText className="section-title faq__title" step={12}>
              {c.home.faq.title}
            </SplitText>
            <FaqList items={faqItems(locale).slice(0, 4)} />
            <SeeAll href={href("/faq")} label={c.ui.seeAll.faq} />
          </div>

          <div id="gallery">
            <GallerySpiral items={gallery} label={c.home.gallery.label} />
          </div>
        </div>
      </section>
    </main>
  );
}
