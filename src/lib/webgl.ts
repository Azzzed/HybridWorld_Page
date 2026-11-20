/**
 * ¿WebGL2 con aceleración por hardware? Sin GPU (WebGL por software, como en
 * las máquinas virtuales, en los móviles con la GPU bloqueada o en el
 * Lighthouse de PageSpeed) los efectos de ogl ocuparían el hilo principal en
 * cada fotograma: ahí cada componente usa su alternativa de CSS.
 */
export function hasFastWebGL2() {
  try {
    const gl = document.createElement("canvas").getContext("webgl2", { failIfMajorPerformanceCaveat: true });
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return !!gl;
  } catch {
    return false;
  }
}
