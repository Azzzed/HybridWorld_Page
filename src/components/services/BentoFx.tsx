"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/* gsap y el lienzo WebGL viven en este chunk aparte: no pesan en la carga inicial. */
const BentoEffects = dynamic(() => import("./bento-effects"), { ssr: false });

/**
 * Carga los efectos del bento cuando la rejilla está a punto de entrar en
 * pantalla. Hasta entonces (o sin JavaScript) las tarjetas funcionan igual:
 * el CSS muestra la información y el enlace.
 */
export default function BentoFx({ gridId, glowColor }: { gridId: string; glowColor: string }) {
  const [near, setNear] = useState(false);

  useEffect(() => {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        io.disconnect();
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(grid);
    return () => io.disconnect();
  }, [gridId]);

  return near ? <BentoEffects gridId={gridId} glowColor={glowColor} /> : null;
}
