"use client";

import { usePathname } from "next/navigation";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { splitLocale } from "@/lib/i18n";

/** Datos de contacto que el footer muestra: los generales o los de una sede. */
export type FooterContactData = {
  phone: { display: string; tel: string };
  whatsapp: { href: string; label: string };
  /** La ficha de Google (Maps) */
  listing: string;
};

export type FooterBranch = FooterContactData & { path: string };

/**
 * En la página de una sede (/locations/<slug>, en los dos idiomas), sus datos;
 * en el resto, los generales. Sale igual en el HTML del servidor, así que
 * Google ve el teléfono de la sede en su página.
 */
function useContact(site: FooterContactData, branches: FooterBranch[]): FooterContactData {
  const { path } = splitLocale(usePathname() || "/");
  return branches.find((b) => b.path === path) ?? site;
}

/** Teléfono, WhatsApp y correo de la columna de la marca. */
export function FooterContact({ site, branches, email }: { site: FooterContactData; branches: FooterBranch[]; email: string }) {
  const { phone, whatsapp } = useContact(site, branches);
  return (
    <div className="footer__contact">
      <a href={`tel:${phone.tel}`}>
        <Phone size={15} /> {phone.display}
      </a>
      <a href={whatsapp.href} target="_blank" rel="noreferrer noopener">
        <MessageCircle size={15} /> {whatsapp.label}
      </a>
      <a href={`mailto:${email}`}>
        <Mail size={15} /> {email}
      </a>
    </div>
  );
}

/** "Cotiza por WhatsApp" y "Ficha de Google" de la columna de navegación. */
export function FooterQuickLinks({
  site,
  branches,
  labels,
}: {
  site: FooterContactData;
  branches: FooterBranch[];
  labels: { quote: string; listing: string };
}) {
  const { whatsapp, listing } = useContact(site, branches);
  return (
    <>
      <li>
        <a href={whatsapp.href} target="_blank" rel="noreferrer noopener">
          {labels.quote}
        </a>
      </li>
      <li>
        <a href={listing} target="_blank" rel="noreferrer noopener">
          {labels.listing}
        </a>
      </li>
    </>
  );
}
