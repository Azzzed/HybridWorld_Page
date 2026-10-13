"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Clock, Headset, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { Cta, CtaGhost } from "../ui/Cta";
import type { MapPoint } from "./BranchMap";
import "../locations.css";

/* Leaflet pesa ~150 kB y no funciona en el servidor: va en su propio chunk
   y se pide solo cuando la sección se acerca a la pantalla. */
const BranchMap = dynamic(() => import("./BranchMap"), {
  ssr: false,
  loading: () => <div className="map__canvas map__loading" aria-busy="true" />,
});

export type BranchCard = MapPoint & {
  isNew?: boolean;
  area: string;
  address: string;
  hours: string;
  phone: { display: string; tel: string };
  whatsappHref: string;
  directionsHref: string;
};

export type BranchLabels = {
  tablist: string;
  newBadge: string;
  advisor: string;
  languages: string;
  whatsapp: string;
  directions: string;
  showAll: string;
  mapCredit: string;
};

/**
 * Mapa + pestañas de sucursales de la home. Las tres fichas están en el HTML
 * (las inactivas con `hidden`), así que su texto se indexa aunque no se vea.
 */
export default function BranchExplorer({ branches, labels }: { branches: BranchCard[]; labels: BranchLabels }) {
  const [activeId, setActiveId] = useState(branches[0].slug);
  const [fitAll, setFitAll] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const active = branches.find((b) => b.slug === activeId) ?? branches[0];

  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShowMap(true);
        io.disconnect();
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="locations__layout">
      {/* ---------- Mapa ---------- */}
      <div className="map" ref={mapRef}>
        {showMap ? (
          <BranchMap points={branches} active={active.slug} fitAll={fitAll} onSelect={setActiveId} />
        ) : (
          <div className="map__canvas map__loading" />
        )}

        <div className="map__overlay">
          <button className="map__all" type="button" onClick={() => setFitAll((v) => v + 1)}>
            <MapPin size={13} /> {labels.showAll}
          </button>
          <span className="map__attr">{labels.mapCredit}</span>
        </div>
      </div>

      {/* ---------- Selector + ficha ---------- */}
      <div className="branch">
        <div className="branch__tabs" role="tablist" aria-label={labels.tablist}>
          {branches.map((b) => (
            <button
              key={b.slug}
              id={`tab-${b.slug}`}
              type="button"
              role="tab"
              aria-selected={b.slug === activeId}
              aria-controls={`branch-${b.slug}`}
              className={`branch__tab ${b.slug === activeId ? "is-on" : ""}`}
              onClick={() => setActiveId(b.slug)}
            >
              <span className="branch__underline" />
              <span className="branch__tab-in">
                {b.city}
                {b.isNew && <em title={labels.newBadge}>{labels.newBadge}</em>}
              </span>
            </button>
          ))}
        </div>

        {branches.map((b) => (
          <div
            key={b.slug}
            id={`branch-${b.slug}`}
            role="tabpanel"
            aria-labelledby={`tab-${b.slug}`}
            hidden={b.slug !== activeId}
            className="branch__card neon neon--hover neon--slow"
          >
            <h3>{b.city}</h3>
            <p className="branch__blurb">{b.area}</p>

            <address className="branch__row">
              <MapPin size={15} />
              <span>{b.address}</span>
            </address>

            <div className="branch__row">
              <Clock size={15} />
              <span>{b.hours}</span>
            </div>

            <div className="advisor">
              <span className="advisor__icon" aria-hidden>
                <Headset size={18} />
              </span>
              <span className="advisor__meta">
                <strong>{labels.advisor}</strong>
                <em>{labels.languages}</em>
              </span>
            </div>

            <div className="branch__actions">
              <Cta href={`tel:${b.phone.tel}`} size="sm">
                <Phone size={15} /> {b.phone.display}
              </Cta>
              <CtaGhost href={b.whatsappHref} target="_blank" size="sm">
                <MessageCircle size={15} /> {labels.whatsapp}
              </CtaGhost>
              <CtaGhost href={b.directionsHref} target="_blank" size="sm">
                <Navigation size={15} /> {labels.directions}
              </CtaGhost>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
