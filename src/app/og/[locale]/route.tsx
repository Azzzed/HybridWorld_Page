import { LOCALES, type Locale } from "@/lib/business";
import { ogTitle, renderOgImage } from "@/lib/og-image";

/** Imagen Open Graph de la home de cada idioma (/og/en, /og/es), generada en el build. */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return renderOgImage(locale, ogTitle(locale));
}
