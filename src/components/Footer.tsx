import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import {
  branchPages,
  business,
  fullAddress,
  googleListingHref,
  locationPagePath,
  locations,
  socialLinks,
  whatsappHref,
  whatsappHrefForPhone,
  type Locale,
} from "@/lib/business";
import { hoursSummary, localePath } from "@/lib/i18n";
import { getContent } from "@/content";
import LangSwitch from "./layout/LangSwitch";
import LegalLinks from "./LegalLinks";
import SocialIcon from "./ui/SocialIcon";
import { FooterContact, FooterQuickLinks, type FooterBranch, type FooterContactData } from "./footer/FooterBranchLinks";
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

  // Teléfono, WhatsApp y ficha de Google: los generales y, en la página de una
  // sede, los de esa sede (así quien llega a Mountain View no termina en Norwalk)
  const site: FooterContactData = {
    phone: business.phone,
    whatsapp: { href: whatsappHref(), label: `${ui.whatsapp} ${business.whatsapp.display}` },
    listing: business.googleMapsUrl,
  };
  const branches: FooterBranch[] = branchPages.map((l) => ({
    path: locationPagePath(l),
    phone: l.phone,
    whatsapp: { href: whatsappHrefForPhone(l.phone, `${ui.whatsappMessage} ${l.city}`), label: `${ui.whatsapp} ${l.phone.display}` },
    listing: googleListingHref(l),
  }));

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
          <FooterContact site={site} branches={branches} email={business.email} />
          <LangSwitch locale={locale} label={ui.switchLanguage} className="footer__lang" />
        </div>

        <div className="footer__col">
          <h2>{ui.footer.locations}</h2>
          <ul className="footer__branches">
            {locations.map((l) => {
              const socials = socialLinks(l);
              return (
                <li key={l.slug}>
                  <MapPin size={14} />
                  <div>
                    {/* La sede con página propia enlaza a ella; las demás, a su sección de /locations */}
                    <Link href={l.hasPage ? href(locationPagePath(l)) : `${href("/locations")}#${l.slug}`}>
                      <strong>{l.city}</strong>
                    </Link>
                    <span>{fullAddress(l)}</span>
                    <a href={`tel:${l.phone.tel}`}>{l.phone.display}</a>
                    {socials.length > 0 && (
                      <ul className="footer__social">
                        {socials.map((s) => (
                          <li key={s.network}>
                            <a
                              href={s.url}
                              target="_blank"
                              rel="me noopener"
                              aria-label={ui.socialLabel.replace("{city}", l.city).replace("{network}", s.name)}
                              title={`${s.name} ${s.handle}`}
                            >
                              <SocialIcon network={s.network} size={15} />
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              );
            })}
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
            <FooterQuickLinks site={site} branches={branches} labels={{ quote: ui.footer.quoteWhatsapp, listing: ui.footer.googleListing }} />
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
        <LegalLinks locale={locale} className="footer__legal-links" />
        <p className="footer__credits">{ui.footer.credits}</p>
      </div>
    </footer>
  );
}
