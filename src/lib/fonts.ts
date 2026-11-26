import { Athiti } from "next/font/google";
import localFont from "next/font/local";

/**
 * Fuentes servidas desde el propio sitio (sin pedir nada a Google al cargar la
 * página). Las variables CSS las usa styles/tokens.css.
 *
 * Archivo: titulares, con su eje de ancho (`wdth`) para las versiones ancha y
 * estrecha del sitio. Son las variables de Google Fonts recortadas a lo que usa
 * el sitio (scripts/build-fonts.py): la normal con pesos 400–900 y anchos
 * 66–125, y la cursiva, que solo usa el titular del hero, fija en peso 900 y
 * anchos 118–125. Se ven igual y pesan 117 KB en vez de 187 KB.
 * Athiti: texto corrido.
 */
export const archivo = localFont({
  src: [
    { path: "../fonts/archivo.woff2", weight: "400 900", style: "normal" },
    { path: "../fonts/archivo-italic-900.woff2", weight: "900", style: "italic" },
  ],
  display: "swap",
  variable: "--font-archivo",
  // Misma fuente de reserva ajustada que generaba next/font/google
  adjustFontFallback: "Arial",
  declarations: [{ prop: "font-stretch", value: "66% 125%" }],
});

/** Sin el peso 300: ninguna regla CSS lo usa y se precargaba igual (11 KB). */
export const athiti = Athiti({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-athiti",
});
