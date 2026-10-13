import type { Metadata, Viewport } from "next";
import { SITE_URL, business } from "./business";

/**
 * Metadata común de los dos layouts raíz. `metadataBase` hace absolutas las
 * URLs relativas (canonical, hreflang, og:image) con el dominio definitivo.
 */
export const layoutMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: business.name,
  icons: {
    icon: [{ url: business.logo, type: "image/png" }],
    apple: [{ url: business.logo }],
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const layoutViewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};
