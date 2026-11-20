import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight, Clock, Languages, MapPin, Phone } from "lucide-react";
import { Cta } from "../ui/Cta";
import HeroWaves from "./HeroWaves";
import "../hero-scroll.css";
import "./branch.css";

/**
 * Hero de las páginas de sucursal.
 *
 * El texto usa el lenguaje del hero de la home (H1 pequeño, titular en
 * cursiva con las palabras cromo y neón, botón verde + SpecularButton y la
 * fila de ventajas, con sus clases de hero-scroll.css). Detrás, la superficie
 * de puntos verdes de PatternWaves (HeroWaves). Componente de servidor: solo
 * el fondo es de cliente.
 */

export type BranchHeroProps = {
  crumbs: { name: string; href?: string }[];
  crumbsLabel: string;
  h1: string;
  /** Líneas del titular grande: todas en cromo y la última en verde */
  title: string[];
  lede: string;
  call: { href: string; label: string };
  directions: { href: string; label: string };
  hours: { days: string; time: string };
  spanish: [string, string];
  street: string;
};

/** "2362 Old Middlefield Way B2" → número, "Old Middlefield" y "Way B2", para la ventaja en dos líneas. */
function splitStreet(street: string) {
  const words = street.split(" ");
  const number = /^\d/.test(words[0]) ? words.shift() : undefined;
  const cut = Math.max(1, words.length - 2);
  return { number, first: words.slice(0, cut).join(" "), second: words.slice(cut).join(" ") };
}

export default function BranchHero({ crumbs, crumbsLabel, h1, title, lede, call, directions, hours, spanish, street }: BranchHeroProps) {
  const address = splitStreet(street);
  const last = title.length - 1;

  return (
    <section className="bhero" id="top" data-track-area="hero">
      <HeroWaves />

      <div className="shell bhero__in">
        <nav className="crumbs bhero__crumbs" aria-label={crumbsLabel}>
          <ol>
            {crumbs.map((c) => (
              <li key={c.name}>
                {c.href ? (
                  <>
                    <Link href={c.href}>{c.name}</Link>
                    <ChevronRight size={13} aria-hidden="true" />
                  </>
                ) : (
                  <span aria-current="page">{c.name}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="bhero__copy">
          {/* Como en la home: el H1 es la línea descriptiva y el titular grande es un <p> */}
          <h1 className="hero-scroll__eyebrow bhero__eyebrow">
            <span>{h1}</span>
          </h1>

          {/* --title-chars: la línea más larga, para que el CSS ajuste el tamaño y ninguna se parta */}
          <p
            className="hero-scroll__title bhero__title"
            style={{ "--title-chars": Math.max(...title.map((t) => t.length)) } as CSSProperties}
          >
            {title.map((line, i) => (
              <span key={line} className={`hero-scroll__word hero-scroll__word--${i === last ? "neon" : "chrome"}`}>
                {line}
              </span>
            ))}
          </p>

          <p className="hero-scroll__lede bhero__lede">{lede}</p>

          <div className="hero-scroll__cta bhero__cta" id="branch-hero-cta">
            <a className="hero-scroll__btn" href={call.href}>
              <Phone size={19} strokeWidth={2.2} aria-hidden="true" />
              {call.label}
              <ArrowRight size={19} strokeWidth={2.2} aria-hidden="true" />
            </a>
            <Cta href={directions.href} target="_blank" size="lg" className="hero-scroll__cta-ghost">
              {directions.label} <ArrowRight size={19} strokeWidth={2} aria-hidden="true" />
            </Cta>
          </div>

          <ul className="hero-scroll__features bhero__features">
            <li>
              <Clock size={30} strokeWidth={1.6} aria-hidden="true" />
              <span>
                {hours.days}
                <br />
                {hours.time}
              </span>
            </li>
            <li>
              <Languages size={30} strokeWidth={1.6} aria-hidden="true" />
              <span>
                {spanish[0]}
                <br />
                {spanish[1]}
              </span>
            </li>
            <li>
              <MapPin size={30} strokeWidth={1.6} aria-hidden="true" />
              <span>
                {address.number && <span className="bhero__street-number">{address.number} </span>}
                {address.first}
                <br />
                {address.second}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
