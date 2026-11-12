/**
 * Google Tag Manager. El contenedor es del negocio: las etiquetas (GA4,
 * conversiones de Google Ads) se configuran en tagmanager.google.com, no aquí.
 * El sitio solo carga el contenedor y empuja al dataLayer los eventos de
 * contacto (ver TrackContactClicks y docs/seguimiento.md).
 */
export const GTM_ID = "GTM-TXSJT9FL";

/**
 * Solo en producción. En Vercel, los deploys de preview no lo cargan para no
 * ensuciar las conversiones de Google Ads; fuera de Vercel, `next build`
 * + `next start` sí lo carga (para probar con el modo Preview de GTM).
 */
export const analyticsEnabled = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === "production"
  : process.env.NODE_ENV === "production";

/** Eventos que el sitio empuja al dataLayer. */
export type ContactEvent = "phone_click" | "whatsapp_click" | "directions_click" | "email_click";
