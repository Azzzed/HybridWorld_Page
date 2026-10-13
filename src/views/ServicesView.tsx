import Image from "next/image";
import { Check, MessageCircle } from "lucide-react";
import { photos, services, whatsappHref, type Locale } from "@/lib/business";
import { servicesSchema } from "@/lib/schema";
import { getContent } from "@/content";
import PageIntro from "@/components/page/PageIntro";
import CtaBand from "@/components/page/CtaBand";
import ServiceIcon from "@/components/services/ServiceIcon";
import JsonLd from "@/components/JsonLd";
import { CtaGhost } from "@/components/ui/Cta";

/** /services: cada servicio con su sección (#id), foto, señales y modelos. */
export default function ServicesView({ locale }: { locale: Locale }) {
  const c = getContent(locale);
  const page = c.servicesPage;

  return (
    <main id="main" className="page">
      <JsonLd data={servicesSchema(locale)} />
      <div className="shell">
        <PageIntro locale={locale} path="/services" name={c.ui.nav.services} eyebrow={c.home.services.eyebrow} title={page.h1} intro={page.intro}>
          <nav className="page-toc" aria-label={page.h1}>
            {services.map((s) => (
              <a key={s.id} href={`#${s.id}`}>
                <ServiceIcon icon={s.icon} size={15} /> {s.name[locale]}
              </a>
            ))}
          </nav>
        </PageIntro>

        {services.map((s, i) => {
          const copy = page.items[s.id];
          const photo = photos[s.photo];
          return (
            <section key={s.id} id={s.id} className="service-row" aria-labelledby={`${s.id}-title`}>
              <figure className="service-row__media">
                <Image
                  src={photo.src}
                  alt={photo.alt[locale]}
                  width={photo.width}
                  height={photo.height}
                  sizes="(max-width: 960px) 100vw, 45vw"
                  style={{ objectPosition: photo.focus }}
                />
              </figure>
              <div className="service-row__body">
                <span className="service-row__label">
                  <ServiceIcon icon={s.icon} size={15} /> {s.label[locale]}
                </span>
                <h2 id={`${s.id}-title`} className="service-row__title">
                  {s.name[locale]}
                </h2>
                {copy.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                <h3 className="service-row__subtitle">{copy.listTitle}</h3>
                <ul className="checks">
                  {copy.list.map((item) => (
                    <li key={item}>
                      <Check size={16} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <h3 className="service-row__subtitle">{page.modelsTitle}</h3>
                <ul className="chips">
                  {copy.models.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
                <div className="service-row__actions">
                  <CtaGhost href={whatsappHref(`${c.ui.whatsappMessage} ${s.name[locale]}.`)} target="_blank" size="sm">
                    <MessageCircle size={15} /> {c.ui.askWhatsapp}
                  </CtaGhost>
                </div>
              </div>
              {i < services.length - 1 && <hr className="rule service-row__rule" />}
            </section>
          );
        })}

        <CtaBand locale={locale} />
      </div>
    </main>
  );
}
