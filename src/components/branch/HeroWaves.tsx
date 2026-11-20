"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { hasFastWebGL2 } from "@/lib/webgl";

/* WebGL (ogl) en su propio chunk: no pesa en la carga inicial */
const PatternWaves = dynamic(() => import("../reactbits/PatternWaves"), { ssr: false });

/** El verde del logo (--neon en tokens.css): el shader no lee variables CSS. */
const NEON = "#12e06b";

/**
 * Fondo del hero de las páginas de sucursal: la superficie de puntos de
 * PatternWaves (React Bits) en el verde del sitio. Se monta cuando la página
 * ya cargó y el navegador está libre, para no competir con el primer pintado,
 * y entra con su propia animación. El CSS (branch.css) lo desvanece hacia el
 * texto: a la izquierda en escritorio y hacia abajo en móvil.
 */
export default function HeroWaves() {
  const [mode, setMode] = useState<"pending" | "live" | "static">("pending");

  useEffect(() => {
    // Safari no tiene requestIdleCallback: ahí espera un momento tras la carga
    const idleWindow = window as Window & {
      requestIdleCallback?: Window["requestIdleCallback"];
      cancelIdleCallback?: Window["cancelIdleCallback"];
    };
    const decide = () => setMode(hasFastWebGL2() ? "live" : "static");
    let idle = 0;
    let timer = 0;
    const go = () => {
      if (idleWindow.requestIdleCallback) idle = idleWindow.requestIdleCallback(decide, { timeout: 1500 });
      else timer = window.setTimeout(decide, 200);
    };
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
    return () => {
      window.removeEventListener("load", go);
      if (idle) idleWindow.cancelIdleCallback?.(idle);
      window.clearTimeout(timer);
    };
  }, []);

  // En móvil, puntos más finos (solo se lee en el cliente: en el servidor `mode` es "pending")
  const spacing = mode === "live" && window.matchMedia("(max-width: 720px)").matches ? 7 : 9;

  return (
    <div className={`bhero__waves${mode === "static" ? " bhero__waves--static" : ""}`} aria-hidden="true">
      {mode === "live" && (
        <PatternWaves preset="silk" color={NEON} backgroundColor="transparent" fade="none" spacing={spacing} cursorSize={60} maxFps={30} pixelBudget={2.2e6} />
      )}
    </div>
  );
}
