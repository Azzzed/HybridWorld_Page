import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/business";
import { localePath } from "@/lib/i18n";
import { breadcrumbSchema } from "@/lib/schema";
import { getContent } from "@/content";
import JsonLd from "../JsonLd";

/**
 * Arranque de las páginas internas: migas de pan (visibles y en JSON-LD),
 * antetítulo, el único H1 de la página y su entradilla.
 */
export default function PageIntro({
  locale,
  path,
  name,
  eyebrow,
  title,
  intro,
  children,
}: {
  locale: Locale;
  /** Ruta de la página, sin idioma */
  path: string;
  /** Nombre corto para las migas (el del menú) */
  name: string;
  eyebrow?: string;
  title: string;
  intro: string;
  children?: ReactNode;
}) {
  const { ui } = getContent(locale);
  const crumbs = [
    { name: ui.breadcrumbHome, path: "/" },
    { name, path },
  ];

  return (
    <header className="page-head">
      <JsonLd data={breadcrumbSchema(crumbs, locale)} />
      <nav className="crumbs" aria-label={ui.breadcrumbLabel}>
        <ol>
          <li>
            <Link href={localePath(locale, "/")}>{ui.breadcrumbHome}</Link>
            <ChevronRight size={13} aria-hidden="true" />
          </li>
          <li>
            <span aria-current="page">{name}</span>
          </li>
        </ol>
      </nav>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h1 className="page-head__title">{title}</h1>
      <p className="page-head__intro">{intro}</p>
      {children}
    </header>
  );
}
