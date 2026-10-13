import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { business, fullAddress, locations, whatsappHref, type Locale } from "@/lib/business";
import { hoursSummary, localePath } from "@/lib/i18n";
import { getContent } from "@/content";
import LangSwitch from "./layout/LangSwitch";
import "./footer.css";

export default function Footer({ locale }: { locale: Locale }) {
  const { ui } = getContent(locale);
  const href = (path: string) => localePath(locale, path);
  const nav = [
    { href: href("/services"), label: ui.nav.services },
    { href: href("/locations"), label: ui.nav.locations },
    { href: href("/reviews"), label: ui.nav.reviews },
    { href: href("/faq"), label: ui.nav.faq },
  ];

  return (
    <footer className="footer">
      <div className="shell footer__grid">
        <div className="footer__brand">
          <Link href={href("/")} className="footer__logo">
            <Image src={business.logoMark} alt="" width={64} height={47} />
            <span>
              <strong>{business.name}</strong>
              <em>{ui.footer.spanish}</em>
            </span>
          </Link>
          <p className="footer__pitch">
            {ui.footer.pitch} <strong>{ui.footer.spanish}</strong>
          </p>
          <div className="footer__contact">
            <a href={`tel:${business.phone.tel}`}>
              <Phone size={15} /> {business.phone.display}
            </a>
            <a href={whatsappHref()} target="_blank" rel="noreferrer noopener">
              <MessageCircle size={15} /> {ui.whatsapp} {business.whatsapp.display}
            </a>
            <a href={`mailto:${business.email}`}>
              <Mail size={15} /> {business.email}
            </a>
          </div>
          <LangSwitch locale={locale} label={ui.switchLanguage} className="footer__lang" />
        </div>

        <div className="footer__col">
          <h2>{ui.footer.locations}</h2>
          <ul className="footer__branches">
            {locations.map((l) => (
              <li key={l.slug}>
                <MapPin size={14} />
                <div>
                  <Link href={`${href("/locations")}#${l.slug}`}>
                    <strong>{l.city}</strong>
                  </Link>
                  <span>{fullAddress(l)}</span>
                  <a href={`tel:${l.phone.tel}`}>{l.phone.display}</a>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h2>{ui.footer.hours}</h2>
          {/* Cada sede con su horario: no es el mismo en las tres */}
          <ul className="footer__hours">
            {locations.map((l) => (
              <li key={l.slug}>
                <span>{l.city}</span>
                <span>{hoursSummary(l.hours, locale)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h2>{ui.footer.navigation}</h2>
          <ul className="footer__nav">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href}>{n.label}</Link>
              </li>
            ))}
            <li>
              <a href={whatsappHref()} target="_blank" rel="noreferrer noopener">
                {ui.footer.quoteWhatsapp}
              </a>
            </li>
            <li>
              <a href={business.googleMapsUrl} target="_blank" rel="noreferrer noopener">
                {ui.footer.googleListing}
              </a>
            </li>
            <li>
              <a href={business.facebookUrl} target="_blank" rel="noreferrer noopener">
                {ui.footer.facebook}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="shell footer__legal">
        <p>
          © {new Date().getFullYear()} {business.name}. {ui.footer.rights}
        </p>
        <p className="footer__credits">{ui.footer.credits}</p>
      </div>
    </footer>
  );
}
