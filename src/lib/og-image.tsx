import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { business, locations, type Locale } from "./business";
import { OG_SIZE } from "./seo";
import { getContent } from "@/content";

/** Páginas con imagen Open Graph propia, además de la home. */
export const OG_PAGES = ["services", "locations", "reviews", "faq"] as const;
export type OgPage = (typeof OG_PAGES)[number];

/** El titular de cada página (su H1), que va en la imagen. */
export function ogTitle(locale: Locale, page?: OgPage) {
  const c = getContent(locale);
  if (!page) return c.home.hero.h1;
  return { services: c.servicesPage.h1, locations: c.locationsPage.h1, reviews: c.reviewsPage.h1, faq: c.faqPage.h1 }[page];
}

const asset = async (path: string, type: string) =>
  `data:${type};base64,${(await readFile(join(process.cwd(), "public", path))).toString("base64")}`;

/** Imagen de 1200×630 para redes y buscadores: foto del equipo, logo y titular. */
export async function renderOgImage(locale: Locale, title: string) {
  // El generador (Satori) no lee WebP: va la foto del equipo en JPG
  const [photo, logo] = await Promise.all([asset("img/shop/taller-01.jpg", "image/jpeg"), asset("img/logo-mark.png", "image/png")]);

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#000", color: "#f2f4f5" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo} alt="" width={520} height={630} style={{ objectFit: "cover", opacity: 0.85 }} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
            padding: "56px 56px 48px",
            borderLeft: "4px solid #12e06b",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt="" width={88} height={65} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 34, fontWeight: 700 }}>{business.name}</span>
              <span style={{ fontSize: 20, color: "#12e06b", letterSpacing: 4, textTransform: "uppercase" }}>
                {locale === "en" ? "Hybrid specialists" : "Especialistas en híbridos"}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", fontSize: title.length > 40 ? 48 : 58, fontWeight: 800, lineHeight: 1.08 }}>{title}</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 24, color: "#8b9096" }}>
            <span style={{ color: "#f2f4f5" }}>{locations.map((l) => l.city).join(" · ")}</span>
            <span>hybridworldinc.com · {business.phone.display}</span>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
