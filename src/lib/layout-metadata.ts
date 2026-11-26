import type { Metadata, Viewport } from "next";
import { SITE_URL, business } from "./business";

/**
 * Metadata común de los dos layouts raíz. `metadataBase` hace absolutas las
 * URLs relativas (canonical, hreflang, og:image) con el dominio definitivo.
 */
export const layoutMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: business.name,
  // El logo reducido (antes era logo.png de 400 px y 51 KB, pedido con prioridad
  // alta en cada carga). Google pide un favicon múltiplo de 48 px.
  // Son logo.png reducido a 48, 96 y 180 px (el de 180, sobre fondo negro).
  icons: {
    icon: [
      { url: "/img/favicon-48.png", type: "image/png", sizes: "48x48" },
      { url: "/img/favicon-96.png", type: "image/png", sizes: "96x96" },
    ],
    apple: [{ url: "/img/apple-touch-icon.png", sizes: "180x180" }],
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const layoutViewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};
