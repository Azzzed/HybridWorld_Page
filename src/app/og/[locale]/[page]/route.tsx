import { LOCALES, type Locale } from "@/lib/business";
import { OG_PAGES, ogTitle, renderOgImage, type OgPage } from "@/lib/og-image";

/** Imagen Open Graph de cada página del menú (/og/en/services…), generada en el build. */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => OG_PAGES.map((page) => ({ locale, page })));
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string; page: string }> }) {
  const { locale, page } = await params;
  return renderOgImage(locale as Locale, ogTitle(locale as Locale, page as OgPage));
}
