import { Archivo, Athiti } from "next/font/google";

/**
 * Fuentes servidas desde el propio sitio con next/font (sin pedir nada a
 * Google al cargar la página). Las variables CSS las usa styles/tokens.css.
 *
 * Archivo: titulares, con su eje de ancho (`wdth`) para las versiones ancha y
 * estrecha del sitio. La cursiva solo la usa el titular del hero.
 * Athiti: texto corrido.
 */
export const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-archivo",
});

export const athiti = Athiti({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-athiti",
});
