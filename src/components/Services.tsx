import { Droplet, Funnel, Settings, Snowflake, Thermometer, Zap, type LucideIcon } from "lucide-react";
import MagicBento, { type BentoCard } from "./MagicBento";
import Reveal from "./ui/Reveal";
import SplitText from "./ui/SplitText";
import { serviceImage, services, type Service } from "../data/services";
import { locations } from "../data/locations";
import "./services.css";

const ICONS: Record<Service["icon"], LucideIcon> = {
  zap: Zap,
  snowflake: Snowflake,
  gear: Settings,
  droplet: Droplet,
  funnel: Funnel,
  thermometer: Thermometer,
};

/**
 * Ancho que ocupa cada tamaño de tarjeta, para que el navegador baje la foto
 * justa (960 o 1600 px). La rejilla no pasa de 1600 px (services.css).
 */
const SIZES: Record<Service["size"], string> = {
  lg: "(max-width: 980px) 100vw, min(66vw, 1070px)",
  md: "(max-width: 980px) 100vw, min(33vw, 530px)",
  sm: "(max-width: 620px) 100vw, (max-width: 980px) 50vw, min(25vw, 400px)",
};

/** El detalle de cada servicio se da por WhatsApp, en la casa matriz. */
const whatsapp = (title: string) =>
  `${locations[0].whatsapp}?text=${encodeURIComponent(`Hola, quiero información del servicio: ${title}.`)}`;

const cards: BentoCard[] = services.map((s) => {
  const Icon = ICONS[s.icon];
  const accent = s.size === "lg";
  return {
    id: s.id,
    size: s.size,
    label: s.label,
    title: s.title,
    description: s.description,
    badge: s.badge,
    accent,
    icon: accent ? <Icon size={16} strokeWidth={2.4} /> : <Icon size={22} strokeWidth={1.8} />,
    image: {
      src: serviceImage(s.image.name, 960),
      srcSet: `${serviceImage(s.image.name, 960)} 960w, ${serviceImage(s.image.name, 1600)} 1600w`,
      sizes: SIZES[s.size],
      alt: s.image.alt,
      width: 1600,
      height: 893,
      focus: s.image.focus,
    },
    link: {
      href: whatsapp(s.title),
      label: "Ver servicio",
      ariaLabel: `Ver servicio: ${s.title}, por WhatsApp`,
    },
  };
});

export default function Services() {
  return (
    <section className="section services" id="servicios">
      <div className="shell">
        <header className="services__head">
          <Reveal>
            <span className="eyebrow services__eyebrow">Servicios</span>
          </Reveal>
          <SplitText as="h2" className="section-title services__title" text="Servicio especializado en híbridos" step={11}>
            Servicio especializado <br />
            en <span className="services__accent">híbridos</span>
          </SplitText>
          <Reveal delay={0.1}>
            <p className="section-lede services__lede">
              Servicios especializados para vehículos híbridos y sistemas de alto voltaje.
            </p>
          </Reveal>
        </header>

        <MagicBento cards={cards} />
      </div>
    </section>
  );
}
