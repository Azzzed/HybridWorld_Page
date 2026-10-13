import { MessageCircle, Navigation, Phone, Star } from "lucide-react";
import {
  directionsHref,
  fullAddress,
  locations,
  whatsappHrefForPhone,
  type Locale,
  type LocationSlug,
} from "@/lib/business";
import { hoursByDay } from "@/lib/i18n";
import { locationsSchema } from "@/lib/schema";
import { getReviews } from "@/lib/reviews";
import { getContent } from "@/content";
import PageIntro from "@/components/page/PageIntro";
import CtaBand from "@/components/page/CtaBand";
import LocationsMap from "@/components/locations/LocationsMap";
import JsonLd from "@/components/JsonLd";
import { Cta, CtaGhost } from "@/components/ui/Cta";

/** /locations: las tres sedes, cada una con su sección (#norwalk…), horario y contacto. */
export default async function LocationsView({ locale }: { locale: Locale }) {
  const c = getContent(locale);
  const page = c.locationsPage;
  const feed = await getReviews(locale);
  const descriptions = Object.fromEntries(
    locations.map((l) => [l.slug, page.items[l.slug].paragraphs[0]]),
  ) as Record<LocationSlug, string>;

  return (
    <main id="main" className="page">
      <JsonLd data={locationsSchema(locale, descriptions)} />
      <div className="shell">
        <PageIntro locale={locale} path="/locations" name={c.ui.nav.locations} eyebrow={c.home.locations.eyebrow} title={page.h1} intro={page.intro} />

        <LocationsMap
          points={locations.map((l) => ({ slug: l.slug, city: l.city, coords: [l.geo.lat, l.geo.lng] }))}
          credit={c.home.locations.mapCredit}
          label={page.h1}
        />

        {locations.map((l) => {
          const copy = page.items[l.slug];
          const google = feed.places.find((p) => p.slug === l.slug);
          return (
            <section key={l.slug} id={l.slug} className="loc-block" aria-labelledby={`${l.slug}-title`}>
              <div className="loc-block__main">
                <span className="eyebrow">
                  {l.isMain ? `${c.ui.mainBadge} · ` : l.isNew ? `${c.ui.newBadge} · ` : ""}
                  {l.area[locale]}
                </span>
                <h2 id={`${l.slug}-title`} className="loc-block__title">
                  {copy.heading}
                </h2>
                {copy.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                <p className="loc-block__nearby">
                  <strong>{page.nearbyTitle}:</strong> {l.nearby.join(", ")}
                </p>
                <div className="loc-block__actions">
                  <Cta href={`tel:${l.phone.tel}`} size="sm">
                    <Phone size={15} /> {l.phone.display}
                  </Cta>
                  <CtaGhost href={whatsappHrefForPhone(l.phone, `${c.ui.whatsappMessage} ${l.city}`)} target="_blank" size="sm">
                    <MessageCircle size={15} /> {c.ui.whatsapp}
                  </CtaGhost>
                  <CtaGhost href={directionsHref(l)} target="_blank" size="sm">
                    <Navigation size={15} /> {c.ui.directions}
                  </CtaGhost>
                </div>
              </div>

              <div className="loc-block__side">
                <h3>{page.contactTitle}</h3>
                <address className="loc-block__address">
                  {fullAddress(l)}
                  <br />
                  <a href={`tel:${l.phone.tel}`}>{l.phone.display}</a>
                </address>

                <h3>{page.hoursTitle}</h3>
                <table className="hours-table">
                  <tbody>
                    {hoursByDay(l.hours, locale).map((h) => (
                      <tr key={h.day} className={h.hours ? "" : "is-closed"}>
                        <th scope="row">{h.day}</th>
                        <td>{h.hours ?? c.ui.closed}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {google && (
                  <>
                    <h3>{page.googleTitle}</h3>
                    <p className="loc-block__google">
                      <Star size={15} fill="currentColor" strokeWidth={0} aria-hidden="true" />
                      <strong>{google.rating}</strong> · {google.count} {c.ui.reviewsLabel}
                    </p>
                    <p className="loc-block__links">
                      <a href={google.url} target="_blank" rel="noreferrer noopener">
                        {c.ui.readReviews}
                      </a>
                      <a href={google.writeUrl} target="_blank" rel="noreferrer noopener">
                        {c.ui.writeReview}
                      </a>
                    </p>
                  </>
                )}
              </div>
            </section>
          );
        })}

        <CtaBand locale={locale} />
      </div>
    </main>
  );
}
