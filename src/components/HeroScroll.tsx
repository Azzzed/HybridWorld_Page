import { Fragment, useCallback, useRef } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BatteryCharging,
  ChevronDown,
  Leaf,
  MapPin,
  Phone,
  Settings,
  ShieldCheck,
} from "lucide-react";
import FrameSequence from "./hero-video/FrameSequence";
import type { FrameSequenceHandle } from "./hero-video/FrameSequence";
import { useScrollProgress } from "./hero-video/useScrollProgress";
import { Cta } from "./ui/Cta";
import { site } from "../data/site";
import { locations } from "../data/locations";
import "./hero-scroll.css";

/**
 * Hero de dos paneles gobernado por el scroll.
 *
 * Capas, de atrás hacia delante:
 *   1. video      la cámara que gira alrededor del auto, fotograma a fotograma
 *   2. capa sup.  el panel oscuro diagonal y el haz de neón de la apertura
 *   3. paneles    el texto de apertura y el de cierre
 *
 * El scroll mueve el video y el texto a la vez. Todo se anima escribiendo
 * estilos directamente sobre los nodos, no con estado de React: un re-render
 * por evento de rueda se notaría.
 */

/**
 * Tramos de scroll en los que vive cada capa. El haz de la apertura se va
 * antes de que el auto llegue a su altura, y el cierre entra por partes
 * cuando el auto ya casi ha despejado la derecha.
 */
const VIDEO = { from: 0.04, to: 0.86 };
const INTRO = { hold: 0.1, gone: 0.3 };
const OVERLAY = { hold: 0.08, gone: 0.27 };
const OUTRO = { from: 0.76, length: 0.13, stagger: 0.022 };

/** Smootherstep: entra y sale sin tirón. */
const ease = (t: number) => {
  const x = Math.min(1, Math.max(0, t));
  return x * x * x * (x * (x * 6 - 15) + 10);
};
const span = (value: number, from: number, to: number) => ease((value - from) / (to - from));

/* El haz de la capa superior, en % del cuadro. Sube desde la base, entre el
   texto y el morro del auto del primer fotograma, hasta el borde superior, y
   marca el filo del panel oscuro. Más a la derecha cruzaría el paragolpes. */
const BEAM = { x1: 40, y1: 104, x2: 52, y2: -4 };
const STREAK = { x1: -2, y1: 86, x2: 34, y2: 103 };

/** x del haz a una altura dada: el panel oscuro termina justo en él. */
const beamX = (y: number) => BEAM.x1 + (BEAM.x2 - BEAM.x1) * ((BEAM.y1 - y) / (BEAM.y1 - BEAM.y2));
const SHADE = `0,0 ${beamX(0).toFixed(2)},0 ${beamX(100).toFixed(2)},100 0,100`;

/* En móvil el texto va arriba y el auto debajo, así que el haz cruza la
   pantalla casi de lado a lado entre los dos: sube hacia la derecha, pasa
   por debajo del párrafo y por encima del techo del auto del primer
   fotograma. El panel oscuro queda arriba, detrás del texto. */
const BEAM_NARROW = { x1: -4, y1: 54, x2: 104, y2: 40 };
const beamY = (x: number) =>
  BEAM_NARROW.y1 + (BEAM_NARROW.y2 - BEAM_NARROW.y1) * ((x - BEAM_NARROW.x1) / (BEAM_NARROW.x2 - BEAM_NARROW.x1));
const SHADE_NARROW = `0,0 100,0 100,${beamY(100).toFixed(2)} 0,${beamY(0).toFixed(2)}`;

const FEATURES: { icon: LucideIcon; label: [string, string] }[] = [
  { icon: Leaf, label: ["Mayor", "eficiencia"] },
  { icon: ShieldCheck, label: ["Diagnóstico", "profesional"] },
  { icon: Settings, label: ["Reparación", "garantizada"] },
];

function Features({ className = "", lead, enter }: { className?: string; lead?: LucideIcon; enter?: number }) {
  return (
    <ul className={`hero-scroll__features ${className}`} data-enter={enter}>
      {FEATURES.map(({ icon, label: [first, second] }, i) => {
        const Icon = i === 0 && lead ? lead : icon;
        return (
          <li key={first}>
            <Icon size={30} strokeWidth={1.6} />
            <span>
              {first}
              <br />
              {second}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export default function HeroScroll() {
  const section = useRef<HTMLElement>(null);
  const frames = useRef<FrameSequenceHandle>(null);
  const intro = useRef<HTMLDivElement>(null);
  const outro = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const parts = useRef<HTMLElement[]>([]);

  const paint = useCallback((value: number) => {
    frames.current?.seek((value - VIDEO.from) / (VIDEO.to - VIDEO.from));

    if (intro.current) {
      const out = span(value, INTRO.hold, INTRO.gone);
      intro.current.style.opacity = String(1 - out);
      intro.current.style.transform = `translate3d(0, ${-42 * out}px, 0)`;
      intro.current.style.visibility = out >= 1 ? "hidden" : "visible";
    }

    // El panel oscuro se va un poco más tarde que el texto
    if (overlay.current) {
      const out = span(value, OVERLAY.hold, OVERLAY.gone);
      overlay.current.style.opacity = String(1 - out);
      overlay.current.style.visibility = out >= 1 ? "hidden" : "visible";
    }

    // Cada pieza del cierre entra con su propio retraso (data-enter); las
    // marcadas con data-still solo aparecen, sin subir
    if (outro.current) {
      if (!parts.current.length) {
        parts.current = [...outro.current.querySelectorAll<HTMLElement>("[data-enter]")];
      }
      outro.current.style.visibility = value > OUTRO.from ? "visible" : "hidden";
      for (const part of parts.current) {
        const from = OUTRO.from + Number(part.dataset.enter) * OUTRO.stagger;
        const enter = span(value, from, from + OUTRO.length);
        part.style.opacity = String(enter);
        if (part.dataset.still === undefined) {
          part.style.transform = `translate3d(0, ${30 * (1 - enter)}px, 0)`;
        }
      }
    }
  }, []);

  useScrollProgress(section, paint);

  return (
    <section id="top" className="hero-scroll" ref={section}>
      <div className="hero-scroll__stage">
        {/* ---------- 1. Video ---------- */}
        <div className="hero-scroll__media">
          <FrameSequence ref={frames} />
        </div>

        {/* ---------- 2. Capa superior ---------- */}
        <div className="hero-scroll__overlay" ref={overlay} aria-hidden>
          <svg className="hero-scroll__shade" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="hero-shade" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#000" stopOpacity="0.97" />
                <stop offset="0.6" stopColor="#000" stopOpacity="0.9" />
                <stop offset="0.86" stopColor="#000" stopOpacity="0.55" />
                <stop offset="1" stopColor="#000" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <polygon points={SHADE} fill="url(#hero-shade)" />
          </svg>

          <div className="hero-scroll__glow hero-scroll__glow--base" />
          <div className="hero-scroll__glow hero-scroll__glow--corner" />
          <div className="hero-scroll__glow hero-scroll__glow--title" />

          {/* Halo ancho y difuso, y encima el núcleo fino y brillante */}
          <svg className="hero-scroll__beams hero-scroll__beams--halo" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line {...BEAM} />
            <line {...STREAK} />
          </svg>
          <svg className="hero-scroll__beams hero-scroll__beams--core" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="beam-main" gradientUnits="userSpaceOnUse" x1={BEAM.x1} y1={BEAM.y1} x2={BEAM.x2} y2={BEAM.y2}>
                <stop offset="0" stopColor="#12e06b" stopOpacity="0" />
                <stop offset="0.3" stopColor="#12e06b" stopOpacity="0.9" />
                <stop offset="0.62" stopColor="#c8ffe0" />
                <stop offset="0.86" stopColor="#12e06b" stopOpacity="0.9" />
                <stop offset="1" stopColor="#12e06b" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="beam-streak" gradientUnits="userSpaceOnUse" x1={STREAK.x1} y1={STREAK.y1} x2={STREAK.x2} y2={STREAK.y2}>
                <stop offset="0" stopColor="#12e06b" stopOpacity="0.2" />
                <stop offset="0.45" stopColor="#b8ffd6" />
                <stop offset="1" stopColor="#12e06b" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            <line {...BEAM} stroke="url(#beam-main)" />
            <line {...STREAK} stroke="url(#beam-streak)" />
          </svg>

          {/* Móvil: el mismo panel y el mismo haz, entre el texto y el auto */}
          <svg className="hero-scroll__shade-narrow" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="hero-shade-narrow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#000" stopOpacity="0.94" />
                <stop offset="0.3" stopColor="#000" stopOpacity="0.86" />
                <stop offset="0.52" stopColor="#000" stopOpacity="0.5" />
              </linearGradient>
            </defs>
            <polygon points={SHADE_NARROW} fill="url(#hero-shade-narrow)" />
          </svg>

          <div className="hero-scroll__glow hero-scroll__glow--edge" />

          <svg className="hero-scroll__beams hero-scroll__beams--halo hero-scroll__beams--narrow" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line {...BEAM_NARROW} />
          </svg>
          <svg className="hero-scroll__beams hero-scroll__beams--core hero-scroll__beams--narrow" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="beam-narrow" gradientUnits="userSpaceOnUse" x1={BEAM_NARROW.x1} y1={BEAM_NARROW.y1} x2={BEAM_NARROW.x2} y2={BEAM_NARROW.y2}>
                <stop offset="0" stopColor="#12e06b" stopOpacity="0.35" />
                <stop offset="0.18" stopColor="#12e06b" stopOpacity="0.95" />
                <stop offset="0.5" stopColor="#c8ffe0" />
                <stop offset="0.82" stopColor="#12e06b" stopOpacity="0.95" />
                <stop offset="1" stopColor="#12e06b" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <line {...BEAM_NARROW} stroke="url(#beam-narrow)" />
          </svg>
        </div>

        {/* ---------- 3. Paneles ---------- */}
        <div className="hero-scroll__panels">
          <div className="hero-scroll__panel hero-scroll__panel--intro" ref={intro}>
            <div className="hero-scroll__head">
              <p className="hero-scroll__eyebrow">
                <span>{site.tagline}</span>
              </p>

              <h1 className="hero-scroll__title">
                <span className="hero-scroll__word hero-scroll__word--chrome">Hybrid</span>
                <span className="hero-scroll__word hero-scroll__word--neon">World</span>
              </h1>

              <p className="hero-scroll__lede">
                Baterías híbridas, diagnóstico y reparación general. Tres talleres en
                California. Llama ya.
              </p>
            </div>

            <div className="hero-scroll__foot">
              <div className="hero-scroll__cta">
                <a className="hero-scroll__btn" href={site.mainPhoneHref}>
                  <Phone size={19} strokeWidth={2.2} />
                  Contacto
                  <ArrowRight size={19} strokeWidth={2.2} />
                </a>
                <Cta href="#servicios" size="lg" className="hero-scroll__cta-ghost">
                  Acerca de nosotros <ArrowRight size={19} strokeWidth={2} />
                </Cta>
              </div>

              <Features />
            </div>

            <ChevronDown className="hero-scroll__chevron" size={30} strokeWidth={1.4} aria-hidden />
          </div>

          <div className="hero-scroll__panel hero-scroll__panel--outro" ref={outro}>
            <div className="hero-scroll__scrim" data-enter={0} data-still />

            <div className="hero-scroll__close">
              <div className="hero-scroll__close-head">
                <p className="hero-scroll__eyebrow hero-scroll__eyebrow--end" data-enter={0}>
                  <span>
                    {locations.map(({ city }, i) => (
                      <Fragment key={city}>
                        {i > 0 && (
                          <>
                            {" "}
                            <span aria-hidden="true">•</span>{" "}
                          </>
                        )}
                        {city}
                      </Fragment>
                    ))}
                  </span>
                </p>

                <h2 className="hero-scroll__subtitle">
                  <span className="hero-scroll__word hero-scroll__word--chrome" data-enter={1}>
                    Lo revisamos entero,
                  </span>{" "}
                  <span className="hero-scroll__word hero-scroll__word--neon" data-enter={2}>
                    no solo la batería.
                  </span>
                </h2>
              </div>

              <div className="hero-scroll__close-body" data-enter={3}>
                <p className="hero-scroll__lede">
                  Reconstrucción de baterías, diagnóstico y mecánica general para tu
                  híbrido. Se habla español en los tres talleres.
                </p>

                <div className="hero-scroll__cta">
                  <a className="hero-scroll__btn" href={site.mainPhoneHref}>
                    <Phone size={19} strokeWidth={2.2} />
                    {site.mainPhone}
                    <ArrowRight size={19} strokeWidth={2.2} />
                  </a>
                  <Cta href="#sucursales" size="lg" className="hero-scroll__cta-ghost">
                    <MapPin size={18} /> Sucursales <ArrowRight size={19} strokeWidth={2} />
                  </Cta>
                </div>
              </div>
            </div>

            <Features className="hero-scroll__features--end" lead={BatteryCharging} enter={4} />

            <div className="hero-scroll__cue" data-enter={5} aria-hidden="true">
              <svg viewBox="0 0 12 64">
                <path d="M6 0v62M1 57l5 5 5-5" />
              </svg>
              <span>Desliza</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
