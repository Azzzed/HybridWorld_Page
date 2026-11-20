import { LOCALES, branchPages, type Locale } from "@/lib/business";
import { renderOgImage } from "@/lib/og-image";
import { getBranchContent } from "@/content/locations";

/** Imagen Open Graph de cada página de sucursal (/og/en/locations/mountain-view…), generada en el build. */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => branchPages.map((l) => ({ locale, slug: l.slug })));
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const l = branchPages.find((x) => x.slug === slug)!;
  const page = getBranchContent(l.slug, locale as Locale)!;
  // La sede sola: su titular, su dirección, su teléfono y la batería del hero
  // (copia en PNG de battery-gen3.webp: Satori no lee WebP)
  return renderOgImage(locale as Locale, page.hero.h1, {
    place: `${l.street}, ${l.city}`,
    phone: l.phone.display,
    cutout: page.ogCutout,
  });
}
