import { useEffect, useRef, useState } from "react";
import { FRAME_COUNT, SCENE_SOURCE, drawPlaceholder, type SceneSource } from "../lib/carScene";
import { PHOTO_SRCS, drawPhotos } from "../lib/priusScene";
import "./scroll-scene.css";

/**
 * Escena de scroll con secuencia de fotogramas.
 *
 * El contenedor mide varias pantallas de alto y el lienzo queda pegado
 * (`sticky`) dentro: al bajar, el avance del scroll elige qué fotograma se
 * pinta. Es la técnica clásica de "scrub" de secuencias.
 *
 * El avance se CUANTIZA a `FRAME_COUNT` pasos aunque la fuente sea procedural,
 * para que la prueba se vea exactamente igual de fluida (o de entrecortada)
 * que la secuencia real de 100 imágenes.
 */

type Props = {
  /** Alto total en múltiplos de pantalla. 3 = tres pantallas de scroll. */
  screens?: number;
  source?: SceneSource;
  /** Muestra el número de fotograma. Útil mientras se calibra. */
  debug?: boolean;
  children?: (progress: number, frame: number) => React.ReactNode;
};

export default function ScrollScene({
  screens = 3,
  source = SCENE_SOURCE,
  debug = false,
  children,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const photosRef = useRef(new Map<string, HTMLImageElement>());
  const [frame, setFrame] = useState(0);
  const [ready, setReady] = useState(source.kind === "placeholder");

  /* ---------- Precarga ---------- */
  useEffect(() => {
    if (source.kind === "photos") {
      /* Son pocas imágenes y grandes: se esperan todas antes de pintar,
         así no se ve un fundido a medias durante el primer scroll. */
      let alive = true;
      let loaded = 0;
      const map = new Map<string, HTMLImageElement>();
      for (const src of PHOTO_SRCS) {
        const img = new Image();
        img.decoding = "async";
        img.src = src;
        img.onload = img.onerror = () => {
          loaded += 1;
          if (alive && loaded >= PHOTO_SRCS.length) setReady(true);
        };
        map.set(src, img);
      }
      photosRef.current = map;
      return () => {
        alive = false;
        map.forEach((i) => {
          i.onload = i.onerror = null;
        });
      };
    }

    if (source.kind !== "frames") {
      /* El placeholder no carga nada: `ready` ya nace en true. */
      imagesRef.current = [];
      return;
    }
    let alive = true;
    let loaded = 0;
    const imgs = source.urls.map((url) => {
      const img = new Image();
      img.decoding = "async";
      img.src = url;
      img.onload = img.onerror = () => {
        loaded += 1;
        /* Con el primer cuarto cargado ya se puede empezar a pintar */
        if (alive && loaded >= Math.min(source.urls.length, 25)) setReady(true);
      };
      return img;
    });
    imagesRef.current = imgs;
    return () => {
      alive = false;
      imgs.forEach((i) => {
        i.onload = i.onerror = null;
      });
    };
  }, [source]);

  /* ---------- Scroll -> fotograma ---------- */
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cssW = 0;
    let cssH = 0;
    let current = -1;
    let raf = 0;
    let queued = false;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      cssW = r.width;
      cssH = r.height;
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      current = -1;
      paint(progress());
    };

    /** 0 en el primer fotograma, 1 en el último */
    const progress = () => {
      const r = wrap.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      if (span <= 0) return 0;
      return Math.min(Math.max(-r.top / span, 0), 1);
    };

    const paint = (p: number) => {
      /* Cuantizar: 100 fotogramas, ni uno más */
      const idx = Math.round(p * (FRAME_COUNT - 1));
      if (idx === current) return;
      current = idx;
      const t = idx / (FRAME_COUNT - 1);

      if (source.kind === "photos") {
        drawPhotos(ctx, cssW, cssH, t, photosRef.current);
      } else if (source.kind === "frames") {
        const img = imagesRef.current[idx];
        ctx.clearRect(0, 0, cssW, cssH);
        if (img?.complete && img.naturalWidth) {
          /* `contain`: el coche entero siempre visible */
          const s = Math.min(cssW / img.naturalWidth, cssH / img.naturalHeight);
          const w = img.naturalWidth * s;
          const h = img.naturalHeight * s;
          ctx.drawImage(img, (cssW - w) / 2, (cssH - h) / 2, w, h);
        }
      } else {
        drawPlaceholder(ctx, cssW, cssH, t);
      }

      setFrame(idx);
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      raf = requestAnimationFrame(() => {
        queued = false;
        paint(progress());
      });
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [source, ready]);

  const progress = FRAME_COUNT > 1 ? frame / (FRAME_COUNT - 1) : 0;

  return (
    <div
      className="scene"
      ref={wrapRef}
      style={{ ["--scene-screens" as string]: String(screens) }}
    >
      <div className="scene__sticky">
        <canvas ref={canvasRef} className="scene__canvas" aria-hidden />
        {children?.(progress, frame + 1)}

        {debug && (
          <div className="scene__hud" aria-hidden>
            <span>
              fotograma <strong>{String(frame + 1).padStart(3, "0")}</strong> / {FRAME_COUNT}
            </span>
            <span className="scene__hud-bar">
              <i style={{ transform: `scaleX(${progress})` }} />
            </span>
            <span>
              {source.kind === "placeholder"
                ? "objeto de prueba"
                : source.kind === "photos"
                  ? "prius 2026 plata"
                  : "secuencia real"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
