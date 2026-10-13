import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { photos, type Service } from "@/lib/business";
import ServiceIcon from "./ServiceIcon";
import BentoFx from "./BentoFx";
import "../magic-bento.css";

/**
 * La rejilla de servicios de la home (el MagicBento de ReactBits). El HTML
 * de las tarjetas —título, descripción, foto y enlace— sale del servidor;
 * los efectos de cursor (foco, partículas, imán, onda y el borde especular)
 * se cargan aparte con BentoFx cuando la rejilla se acerca a la pantalla.
 */

const GLOW = "18, 224, 107";
const GRID_ID = "services-bento";

/** Ancho que ocupa cada tamaño de tarjeta, para que next/image elija la foto justa. */
const SIZES: Record<Service["size"], string> = {
  lg: "(max-width: 980px) 100vw, min(66vw, 1070px)",
  md: "(max-width: 980px) 100vw, min(33vw, 530px)",
  sm: "(max-width: 620px) 100vw, (max-width: 980px) 50vw, min(25vw, 400px)",
};

export type BentoItem = {
  service: Service;
  title: string;
  label: string;
  description: string;
  alt: string;
  /** La sección del servicio en /services */
  href: string;
  linkLabel: string;
  linkAriaLabel: string;
};

export default function ServiceBento({ items }: { items: BentoItem[] }) {
  return (
    <>
      <div className="bento-grid bento-grid--glow" id={GRID_ID}>
        {items.map(({ service, title, label, description, alt, href, linkLabel, linkAriaLabel }) => {
          const size = service.size;
          const accent = size === "lg";
          const photo = photos[service.photo];
          return (
            <article
              key={service.id}
              className={`bento-card bento-card--${size}`}
              style={{ "--glow-color": GLOW } as CSSProperties}
            >
              <header className="bento-card__head">
                <span className={`bento-card__icon${accent ? " bento-card__icon--accent" : ""}`} aria-hidden="true">
                  <ServiceIcon icon={service.icon} size={accent ? 16 : 22} strokeWidth={accent ? 2.4 : 1.8} />
                </span>
                <span className="bento-card__label">{label}</span>
              </header>

              <div className="bento-card__body">
                <h3 className="bento-card__title">{title}</h3>
                {/* Con ratón, la descripción y el enlace aparecen al pasar por encima */}
                <div className="bento-card__more">
                  <div className="bento-card__more-inner">
                    <p className="bento-card__desc">{description}</p>
                    <Link className="bento-card__link" href={href} aria-label={linkAriaLabel}>
                      {linkLabel}
                      <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* La foto va al final: se lee primero el título y después su descripción.
                  Encima de ella, el negro que la tapa en el hover. */}
              <div className="bento-card__clip">
                <div className="bento-card__media">
                  <Image
                    src={photo.src}
                    alt={alt}
                    width={photo.width}
                    height={photo.height}
                    sizes={SIZES[size]}
                    style={{ objectPosition: photo.focus }}
                  />
                </div>
                <div className="bento-card__fill" />
              </div>
              <span className="bento-card__sparks" aria-hidden="true" />
              <span className="bento-card__fx" aria-hidden="true" />
            </article>
          );
        })}
      </div>
      <BentoFx gridId={GRID_ID} glowColor={GLOW} />
    </>
  );
}
