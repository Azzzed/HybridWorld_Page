import type { ReactNode } from "react";
import { business, locations, whatsappHref, type Locale } from "@/lib/business";
import { localePath } from "@/lib/i18n";
import { archivo, athiti } from "@/lib/fonts";
import { getContent } from "@/content";
import SiteHeader from "./SiteHeader";
import Footer from "../Footer";
import QuickCall from "../QuickCall";
import RevealObserver from "../ui/RevealObserver";
import "@/index.css";

/**
 * El documento de cada idioma: <html lang>, fuentes, header, footer y botón
 * flotante. Lo usan los dos layouts raíz, app/(en) y app/(es)/es.
 */
export default function RootDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  const { ui } = getContent(locale);
  // Cada sección del menú tiene su página: es lo que Google usa para los
  // enlaces que muestra debajo del resultado (sitelinks)
  const href = (path: string) => localePath(locale, path);
  const nav = [
    { href: href("/services"), label: ui.nav.services },
    { href: href("/locations"), label: ui.nav.locations },
    { href: href("/reviews"), label: ui.nav.reviews },
    { href: href("/faq"), label: ui.nav.faq },
  ];

  return (
    <html lang={locale} className={`${archivo.variable} ${athiti.variable}`}>
      <body>
        <a className="skip" href="#main">
          {ui.skip}
        </a>
        <SiteHeader
          locale={locale}
          homeHref={href("/")}
          brand={{ logoMark: business.logoMark, homeLabel: ui.homeLabel }}
          nav={nav}
          phone={business.phone}
          whatsapp={whatsappHref()}
          // Sin formulario en la página, la cotización se pide por WhatsApp
          cta={{ href: whatsappHref(), label: ui.freeQuote }}
          labels={{
            menuOpen: ui.menuOpen,
            menuClose: ui.menuClose,
            call: ui.call,
            whatsapp: ui.whatsapp,
            switchLanguage: ui.switchLanguage,
            nav: ui.mainNav,
          }}
        />
        {children}
        <Footer locale={locale} />
        <QuickCall
          shops={locations.map((l) => ({ slug: l.slug, city: l.city, phone: l.phone }))}
          whatsapp={whatsappHref()}
          labels={{
            open: ui.quickContact,
            close: ui.quickContactClose,
            title: ui.quickContactTitle,
            whatsapp: `${ui.whatsapp} ${business.whatsapp.display}`,
          }}
        />
        <RevealObserver />
      </body>
    </html>
  );
}
