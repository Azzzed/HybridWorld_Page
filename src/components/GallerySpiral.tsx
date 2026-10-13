"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { InfiniteSpiralItem } from "./reactbits/InfiniteSpiral";

/* La espiral es decorativa y pesa: se carga en su propio chunk, sin SSR,
   cuando está por entrar en pantalla. Las mismas fotos están en /gallery. */
const InfiniteSpiral = dynamic(() => import("./reactbits/InfiniteSpiral"), { ssr: false });

export default function GallerySpiral({ items, label }: { items: InfiniteSpiralItem[]; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        io.disconnect();
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="gallery" ref={ref} role="img" aria-label={label}>
      {near ? (
        <InfiniteSpiral
          items={items}
          animationMode="auto"
          speed={0.4}
          direction="up"
          radius={150}
          cardWidth={210}
          cardHeight={132}
          verticalSpacing={58}
          cardsPerTurn={9}
          perspective={1000}
          cardRadius={0}
          cardTilt={2}
          centerScale={1.18}
          edgeFade={0.55}
          edgeBlur={3}
          grayscale={0.6}
          pauseOnHover={false}
          className="gallery__spiral"
        />
      ) : (
        <div className="gallery__spiral" />
      )}
    </div>
  );
}
