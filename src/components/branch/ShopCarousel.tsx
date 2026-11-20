"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { hasFastWebGL2 } from "@/lib/webgl";
import "./shop-carousel.css";

/* Cada efecto en su propio chunk: el navegador baja solo el de su pantalla
   y solo al acercarse a la sección */
const FlexCarousel = dynamic(() => import("../reactbits/FlexCarousel"), { ssr: false });
const DomeGallery = dynamic(() => import("../reactbits/DomeGallery"), { ssr: false });

export type ShopPhoto = { src: string; alt: string; title: string; width: number; height: number };

/** Versión optimizada por next/image: 384 px para las baldosas de la cúpula y 640 para la fila */
const thumb = (src: string, w = 384) => `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=70`;

/**
 * La cúpula (táctil) solo en teléfonos y en tablets: ancho de teléfono, o
 * pantalla táctil sin ratón de hasta tamaño tablet. Un escritorio con ratón
 * siempre lleva el FlexCarousel, aunque la ventana sea estrecha o Windows
 * esté al 125 % (eso da 1024 px de CSS en un portátil normal).
 */
const DOME = "(max-width: 767px), (hover: none) and (pointer: coarse) and (max-width: 1366px)";

type Mode = "strip" | "dome" | "flex";

/**
 * Fotos del taller. En el HTML va una fila de fotos normal (<img>, con scroll
 * horizontal): la ven Google y quien llega antes de que cargue el efecto. Al
 * acercarse a la sección se monta UN solo efecto según la pantalla:
 *   - teléfono o tablet táctil: DomeGallery de React Bits (CSS 3D, sin WebGL);
 *   - escritorio con WebGL acelerado: FlexCarousel de React Bits;
 *   - escritorio sin GPU: se queda la fila de fotos.
 * Si la pantalla cambia de tipo (girar una tablet, redimensionar), React
 * desmonta el efecto anterior antes de montar el nuevo: nunca corren los dos.
 */
export default function ShopCarousel({ photos, label }: { photos: ShopPhoto[]; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [mode, setMode] = useState<Mode>("strip");

  // Cuándo: al acercarse a la sección
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        io.disconnect();
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Cuál: según la pantalla, y de nuevo si cambia de tipo
  useEffect(() => {
    if (!near) return;
    const query = window.matchMedia(DOME);
    const fastGL = hasFastWebGL2();
    const pick = () => setMode(query.matches ? "dome" : fastGL ? "flex" : "strip");
    pick();
    query.addEventListener("change", pick);
    return () => query.removeEventListener("change", pick);
  }, [near]);

  return (
    <div className={`shop-carousel shop-carousel--${mode}`} ref={ref} data-effect={mode}>
      {mode === "flex" && (
        <FlexCarousel
          items={photos}
          label={label}
          preset="liquid"
          intro="rise"
          cardHeight={0.62}
          gap={14}
          squeeze={0.2}
          captureWheel={false}
          focusOnClick
          captions
        />
      )}
      {mode === "dome" && (
        <div role="region" aria-roledescription="carousel" aria-label={label} className="shop-carousel__dome">
          <DomeGallery
            images={photos.map((p) => ({ src: p.src, thumb: thumb(p.src), alt: p.alt }))}
            fit={0.8}
            minRadius={420}
            segments={20}
            maxVerticalRotationDeg={4}
            dragSensitivity={18}
            overlayBlurColor="#000000"
            imageBorderRadius="0px"
            openedImageBorderRadius="0px"
            openedImageWidth="min(88vw, 380px)"
            openedImageHeight="min(117vw, 506px)"
            grayscale={false}
            touchAction="pan-y"
          />
        </div>
      )}
      {mode === "strip" && (
        <ul className="shop-carousel__strip" aria-label={label}>
          {photos.map((p) => (
            <li key={p.src}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={thumb(p.src, 640)} alt={p.alt} width={p.width} height={p.height} loading="lazy" decoding="async" />
              <span>{p.title}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
