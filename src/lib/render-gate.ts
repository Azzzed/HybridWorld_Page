/**
 * Pausa corta de los efectos WebGL cuando alguien pulsa un enlace o un botón.
 *
 * Las olas del hero, el carrusel y los bordes de los botones dibujan sin
 * parar. Si la tarjeta gráfica va justa, el navegador deja esperando al hilo
 * principal y el clic (y la navegación de Next) se procesa tarde: parece que
 * el enlace no responde y la gente pulsa varias veces. Al tocar un enlace o
 * un botón, los efectos se saltan sus fotogramas durante un momento y el
 * clic pasa primero; si la página cambia, la nueva ya no los tiene.
 *
 * Cada bucle de animación llama a `renderPaused()` antes de dibujar.
 */

const PAUSE_MS = 1500;
let pausedUntil = 0;
let installed = false;

function onPress(e: Event) {
  const target = e.target as Element | null;
  if (target?.closest?.("a[href], button, [role='button']")) pausedUntil = performance.now() + PAUSE_MS;
}

function install() {
  if (installed || typeof document === "undefined") return;
  installed = true;
  // Fase de captura y pasivo: llega antes que nadie y no retrasa el gesto
  document.addEventListener("pointerdown", onPress, { capture: true, passive: true });
  document.addEventListener("keydown", (e) => {
    if ((e as KeyboardEvent).key === "Enter") onPress(e);
  }, { capture: true, passive: true });
}

/** true mientras dura la pausa tras pulsar un enlace o un botón. */
export function renderPaused() {
  install();
  return performance.now() < pausedUntil;
}
