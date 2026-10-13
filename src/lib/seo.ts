import type { Metadata } from "next";
import { business, type Locale } from "./business";
import { localePath, ogLocale, otherLocale } from "./i18n";

/** Ruta de la imagen Open Graph (1200×630) generada para cada página. */
export const ogImagePath = (locale: Locale, path: string) => `/og/${locale}${path === "/" ? "" : path}`;

export const OG_SIZE = { width: 1200, height: 630 } as const;

/**
 * Metadata completa de una página: título y descripción propios, canonical,
 * hreflang (en / es / x-default), Open Graph y Twitter card. Las URLs son
 * relativas y `metadataBase` (en los layouts raíz) las hace absolutas.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  noindex = false,
}: {
  locale: Locale;
  /** Ruta sin idioma ("/") */
  path: string;
  title: string;
  description: string;
  noindex?: boolean;
}): Metadata {
  const url = localePath(locale, path);
  const image = { url: ogImagePath(locale, path), ...OG_SIZE, alt: title, type: "image/png" };

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: {
        en: localePath("en", path),
        es: localePath("es", path),
        "x-default": localePath("en", path),
      },
    },
    openGraph: {
      type: "website",
      url,
      siteName: business.name,
      title,
      description,
      locale: ogLocale[locale],
      alternateLocale: ogLocale[otherLocale(locale)],
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
