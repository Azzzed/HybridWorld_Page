import type { MetadataRoute } from "next";
import { LOCALES, SITE_URL } from "@/lib/business";
import { localePath } from "@/lib/i18n";

/** La home y las páginas del menú, en los dos idiomas y con sus alternativas hreflang. */
const PATHS = ["/", "/services", "/locations", "/reviews", "/faq"];

export default function sitemap(): MetadataRoute.Sitemap {
  const abs = (path: string) => new URL(path, SITE_URL).href;

  return PATHS.flatMap((path) =>
    LOCALES.map((locale) => ({
      url: abs(localePath(locale, path)),
      changeFrequency: path === "/" || path === "/reviews" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "/" ? 1 : 0.8,
      alternates: {
        languages: {
          en: abs(localePath("en", path)),
          es: abs(localePath("es", path)),
          "x-default": abs(localePath("en", path)),
        },
      },
    })),
  );
}
