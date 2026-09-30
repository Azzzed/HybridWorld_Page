import { useCallback, useRef } from "react";
import { ArrowRight, ChevronDown, Leaf, MapPin, Phone, Settings, ShieldCheck } from "lucide-react";
import CarStage from "./hero3d/CarStage";
import { useHeroScroll } from "../three/useHeroScroll";
import { ease } from "../three/choreography";
import { Cta } from "./ui/Cta";
import { site } from "../data/site";
import "./hero-scroll.css";

/**
 * Hero de dos paneles gobernado por el scroll.
 *
 * Capas, de atrás hacia delante:
 *   1. lienzo 3D  la sala de hormigón con sus luces verdes, y el auto
 *   2. capa sup.  el panel oscuro diagonal y los haces de neón verde
 *   3. paneles    el texto de apertura y el de cierre
 *
 * El auto lo mueve la coreografía congelada de `src/three`; aquí solo se
 * decide qué lo rodea. Todo lo demás se anima escribiendo estilos directamente
 * sobre los nodos, no con estado de React: un re-render por evento de rueda se
 * notaría.
 */

/** Tramos de scroll en los que vive cada capa. */
const INTRO = { hold: 0.1, gone: 0.3 };
const OVERLAY = { hold: 0.1, gone: 0.36 };
const OUTRO = { from: 0.6, to: 0.84 };

const span = (value: number, from: number, to: number) => ease((value - from) / (to - from));

/* Los haces de la capa superior, en % del cuadro. El principal sube desde la
   base, a la derecha del texto, hasta el borde superior, y marca el filo del
   panel oscuro. */
const BEAM = { x1: 46, y1: 104, x2: 63.5, y2: -4 };
const STREAK = { x1: -2, y1: 86, x2: 34, y2: 103 };

/** x del haz a una altura dada: el panel oscuro termina justo en él. */
const beamX = (y: number) => BEAM.x1 + (BEAM.x2 - BEAM.x1) * ((BEAM.y1 - y) / (BEAM.y1 - BEAM.y2));
const SHADE = `0,0 ${beamX(0).toFixed(2)},0 ${beamX(100).toFixed(2)},100 0,100`;

export default function HeroScroll() {
  const section = useRef<HTMLElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const outro = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);

  const paint = useCallback((value: number) => {
    if (intro.current) {
      const out = span(value, INTRO.hold, INTRO.gone);
      intro.current.style.opacity = String(1 - out);
      intro.current.style.transform = `translate3d(0, ${-42 * out}px, 0)`;
      intro.current.style.visibility = out >= 1 ? "hidden" : "visible";
    }

    // El panel oscuro se va un poco más tarde que el texto, y antes de que el
    // auto cruce a la izquierda, donde lo taparía.
    if (overlay.current) {
      const out = span(value, OVERLAY.hold, OVERLAY.gone);
      overlay.current.style.opacity = String(1 - out);
      overlay.current.style.visibility = out >= 1 ? "hidden" : "visible";
    }

    if (outro.current) {
      const enter = span(value, OUTRO.from, OUTRO.to);
      outro.current.style.opacity = String(enter);
      outro.current.style.transform = `translate3d(0, ${36 * (1 - enter)}px, 0)`;
      outro.current.style.visibility = enter <= 0 ? "hidden" : "visible";
    }
  }, []);

  const progress = useHeroScroll(section, paint);

  return (
    <section id="top" className="hero3d" ref={section}>
      <div className="hero3d__stage">
        {/* ---------- 1. Lienzo 3D: la sala y el auto ---------- */}
        <div className="hero3d__canvas">
          <CarStage progress={progress} />
        </div>

        {/* ---------- 2. Capa superior ---------- */}
        <div className="hero3d__overlay" ref={overlay} aria-hidden>
          <svg className="hero3d__shade" viewBox="0 0 100 100" preserveAspectRatio="none">
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

          <div className="hero3d__glow hero3d__glow--base" />
          <div className="hero3d__glow hero3d__glow--corner" />
          <div className="hero3d__glow hero3d__glow--title" />

          {/* Halo ancho y difuso, y encima el núcleo fino y brillante */}
          <svg className="hero3d__beams hero3d__beams--halo" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line {...BEAM} />
            <line {...STREAK} />
          </svg>
          <svg className="hero3d__beams hero3d__beams--core" viewBox="0 0 100 100" preserveAspectRatio="none">
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
        </div>

        {/* ---------- 3. Paneles ---------- */}
        <div className="hero3d__panels">
          <div className="hero3d__panel hero3d__panel--intro" ref={intro}>
            <div className="hero3d__head">
              <p className="hero3d__eyebrow">
                <span>{site.tagline}</span>
              </p>

              <h1 className="hero3d__title">
                <span className="hero3d__word hero3d__word--chrome">Hybrid</span>
                <span className="hero3d__word hero3d__word--neon">World</span>
              </h1>

              <p className="hero3d__lede">
                Baterías híbridas, diagnóstico y reparación general. Tres talleres en
                California. Llama ya.
              </p>
            </div>

            <div className="hero3d__foot">
              <div className="hero3d__cta">
                <a className="hero3d__btn" href={site.mainPhoneHref}>
                  <Phone size={19} strokeWidth={2.2} />
                  Contacto
                  <ArrowRight size={19} strokeWidth={2.2} />
                </a>
                <Cta href="#servicios" size="lg" className="hero3d__cta-ghost">
                  Acerca de nosotros <ArrowRight size={19} strokeWidth={2} />
                </Cta>
              </div>

              <ul className="hero3d__features">
                <li>
                  <Leaf size={30} strokeWidth={1.6} />
                  <span>
                    Mayor
                    <br />
                    eficiencia
                  </span>
                </li>
                <li>
                  <ShieldCheck size={30} strokeWidth={1.6} />
                  <span>
                    Diagnóstico
                    <br />
                    profesional
                  </span>
                </li>
                <li>
                  <Settings size={30} strokeWidth={1.6} />
                  <span>
                    Reparación
                    <br />
                    garantizada
                  </span>
                </li>
              </ul>
            </div>

            <ChevronDown className="hero3d__chevron" size={30} strokeWidth={1.4} aria-hidden />
          </div>

          <div className="hero3d__panel hero3d__panel--outro" ref={outro}>
            <p className="hero3d__eyebrow hero3d__eyebrow--end">
              <span>Norwalk · Fullerton · Mountain View</span>
            </p>

            <h2 className="hero3d__subtitle">
              Lo revisamos entero,
              <br />
              no solo la batería.
            </h2>

            <p className="hero3d__lede">
              Reconstrucción de baterías, diagnóstico y mecánica general para tu
              híbrido. Se habla español en los tres talleres.
            </p>

            <div className="hero3d__cta">
              <a className="hero3d__btn" href={site.mainPhoneHref}>
                <Phone size={19} strokeWidth={2.2} />
                {site.mainPhone}
              </a>
              <Cta href="#sucursales" size="lg" className="hero3d__cta-ghost">
                <MapPin size={18} /> Sucursales
              </Cta>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
