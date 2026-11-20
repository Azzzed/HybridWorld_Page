"use client";

import { useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import Image from "next/image";
import {
  Activity,
  ArrowRight,
  BatteryCharging,
  BatteryFull,
  Cable,
  CarFront,
  Cpu,
  Droplet,
  Fan,
  Gauge,
  Layers,
  MessageCircle,
  Phone,
  Repeat,
  ScanLine,
  ShieldCheck,
  Wind,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { PartExplorerCopy, PartIcon } from "@/content/types";
import { trackEvent } from "@/lib/track-event";
import "../magic-bento.css";
import "../hero-scroll.css";
import "./part-explorer.css";

/**
 * Explorador de una pieza (batería, motor y, más adelante, A/C o frenos): la
 * foto de la pieza en grande, sin marco, como un objeto que queda debajo de
 * las tarjetas, y dos pestañas: qué hacemos y el proceso.
 *
 * Pestañas con el patrón de WAI-ARIA (flechas, Inicio y Fin). Los dos paneles
 * están en el HTML (el inactivo con `hidden`), así que su texto se indexa.
 * El encabezado de la sección llega ya hecho del servidor (`header`).
 */

const ICONS: Record<PartIcon, LucideIcon> = {
  "battery-charging": BatteryCharging,
  "battery-full": BatteryFull,
  fan: Fan,
  cable: Cable,
  "scan-line": ScanLine,
  activity: Activity,
  cpu: Cpu,
  "message-circle": MessageCircle,
  wrench: Wrench,
  repeat: Repeat,
  layers: Layers,
  wind: Wind,
  droplet: Droplet,
  gauge: Gauge,
};

/** Primero qué hacemos; después, el proceso del servicio */
const TABS = ["what", "repair"] as const;
type Tab = (typeof TABS)[number];

const pad = (n: number) => String(n).padStart(2, "0");

/** Las tiras de luz del fondo (viewBox 1600×900): dos en la esquina de arriba,
 *  dos que cruzan por abajo y dos al otro lado; van en pares, como un LED doble */
const STREAKS = [
  "M-40 170 C 40 110 110 50 210 -30",
  "M-40 214 C 50 150 140 70 262 -30",
  "M-40 905 C 520 890 1050 880 1660 760",
  "M-40 940 C 520 922 1060 912 1660 800",
  "M1660 300 C 1500 250 1380 150 1320 -30",
  "M1660 345 C 1480 290 1350 180 1278 -30",
];

export default function PartExplorer({
  id,
  branch,
  header,
  copy,
  stepLabel,
  cta,
  side = "right",
}: {
  /** Nombre de la sección ("battery", "engine"): ids y analítica */
  id: string;
  /** La sede, para la analítica */
  branch: string;
  header: ReactNode;
  copy: PartExplorerCopy;
  /** "Step" / "Paso" */
  stepLabel: string;
  /** El botón del cierre (llamar a la sede), si la sección trae `badges` */
  cta?: { href: string; label: string };
  /** Lado de la foto en escritorio */
  side?: "left" | "right";
}) {
  const [tab, setTab] = useState<Tab>("what");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const tabId = (t: Tab) => `${id}-tab-${t}`;
  const panelId = (t: Tab) => `${id}-panel-${t}`;

  const selectTab = (next: Tab, focus = false) => {
    if (next !== tab) trackEvent("tab_change", { section: id, tab: next, branch });
    setTab(next);
    if (focus) tabRefs.current[TABS.indexOf(next)]?.focus();
  };

  // Flechas, Inicio y Fin mueven el foco y activan la pestaña
  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = TABS.indexOf(tab);
    const to = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: TABS.length - 1 }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    selectTab(TABS[(to + TABS.length) % TABS.length], true);
  };

  return (
    <div className={`pe pe--${side}`}>
      {/* Trazos de luz verde de fondo, de borde a borde de la pantalla */}
      <svg className="pe__streaks" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          {/* Cada tira se enciende en el centro y se apaga en las puntas */}
          <linearGradient id={`${uid}-led`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#12e06b" stopOpacity="0" />
            <stop offset="0.25" stopColor="#12e06b" stopOpacity="0.85" />
            <stop offset="0.55" stopColor="#c8ffe0" />
            <stop offset="0.8" stopColor="#12e06b" stopOpacity="0.85" />
            <stop offset="1" stopColor="#12e06b" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        {/* De atrás hacia delante: el resplandor ancho, el halo y el filamento */}
        {(["glow", "halo", "core"] as const).map((layer) => (
          <g key={layer} className={`pe__led pe__led--${layer}`} stroke={layer === "core" ? `url(#${uid}-led)` : undefined}>
            {STREAKS.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
        ))}
      </svg>

      <div className="pe__head">{header}</div>

      {/* ---------- La pieza: grande, sin marco, debajo de las tarjetas ---------- */}
      <div className="pe__visual" style={{ "--ar": (copy.image.width / copy.image.height).toFixed(4) } as CSSProperties}>
        <span className="pe__glow" aria-hidden="true" />
        <span className="pe__shadow" aria-hidden="true" />
        <Image
          className="pe__img"
          src={copy.image.src}
          alt={copy.image.alt}
          width={copy.image.width}
          height={copy.image.height}
          sizes="(max-width: 960px) min(100vw, 560px), 760px"
          quality={90}
        />
      </div>

      {/* ---------- Pestañas ---------- */}
      <div className="pe__body">
        <div className="pe__tabs" role="tablist" aria-label={copy.tablistLabel} onKeyDown={onTabKey}>
          {TABS.map((t, i) => (
            <button
              key={t}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              id={tabId(t)}
              type="button"
              role="tab"
              aria-selected={tab === t}
              aria-controls={panelId(t)}
              tabIndex={tab === t ? 0 : -1}
              className="pe__tab"
              onClick={() => selectTab(t)}
            >
              {/* Solo una de las dos se ve (y se lee): la larga en escritorio, la corta en móvil */}
              <span className="pe__tab-long">{copy.tabs[t].long}</span>
              <span className="pe__tab-short">{copy.tabs[t].short}</span>
            </button>
          ))}
        </div>

        {/* Qué hacemos */}
        <div className="pe__panel" role="tabpanel" id={panelId("what")} aria-labelledby={tabId("what")} hidden={tab !== "what"} tabIndex={0}>
          <ul className="pe__grid">
            {copy.services.map((s) => {
              const Icon = ICONS[s.icon];
              return (
                <li key={s.title} className="bento-card pe__card pe__card--icon">
                  <span className="pe__ring" aria-hidden="true">
                    <Icon className="pe__card-icon" size={24} strokeWidth={1.8} />
                  </span>
                  <div>
                    <h3 className="pe__card-title">{s.title}</h3>
                    <p className="pe__card-text">{s.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* El proceso */}
        <div className="pe__panel" role="tabpanel" id={panelId("repair")} aria-labelledby={tabId("repair")} hidden={tab !== "repair"} tabIndex={0}>
          <p className="pe__intro">{copy.intro}</p>
          <ol className="pe__grid">
            {copy.steps.map((s, i) => (
              <li key={s.title} className="bento-card pe__card">
                <span className="pe__step">
                  {stepLabel} {pad(i + 1)}
                </span>
                <h3 className="pe__card-title">{s.title}</h3>
                <p className="pe__card-text">{s.text}</p>
              </li>
            ))}
          </ol>
          {copy.warranty && (
            <p className="pe__warranty">
              <ShieldCheck size={16} strokeWidth={2} aria-hidden="true" />
              <span>{copy.warranty}</span>
            </p>
          )}
        </div>

        {copy.badges && cta && (
          <div className="pe__cta">
            <a className="hero-scroll__btn pe__cta-btn" href={cta.href}>
              <Phone size={18} strokeWidth={2.2} aria-hidden="true" />
              {cta.label}
              <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
            </a>
            <ul className="hero-scroll__features pe__badges">
              <li>
                <ShieldCheck size={26} strokeWidth={1.6} aria-hidden="true" />
                <span>{copy.badges[0]}</span>
              </li>
              <li>
                <CarFront size={26} strokeWidth={1.6} aria-hidden="true" />
                <span>{copy.badges[1]}</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
