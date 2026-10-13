/**
 * Ancho y alto de layout de un elemento, con decimales y sin las
 * transformaciones de sus antepasados (scale, transform), que
 * getBoundingClientRect() sí aplica. Con box-sizing: border-box (base.css),
 * es el tamaño hasta el borde.
 *
 * Lo usan los bordes WebGL (botones y tarjetas de servicios) para que el
 * trazo caiga sobre el borde aunque la sección esté escalada.
 */
export function layoutSize(el: HTMLElement) {
  const style = getComputedStyle(el);
  return { w: parseFloat(style.width) || el.offsetWidth, h: parseFloat(style.height) || el.offsetHeight };
}
