import type { UiEvent } from "./analytics";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * Empuja un evento de interfaz al dataLayer de GTM (pestañas, puntos de las
 * piezas…). Los clics de contacto no pasan por aquí: los recoge
 * TrackContactClicks. Sin GTM cargado, el evento queda en el array y no pasa
 * nada.
 */
export function trackEvent(event: UiEvent, params: Record<string, string>) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params, page_path: location.pathname });
}
