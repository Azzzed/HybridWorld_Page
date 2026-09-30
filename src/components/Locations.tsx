import { lazy, Suspense, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Clock, Headset, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { locations } from "../data/locations";
import Reveal from "./ui/Reveal";
import SplitText from "./ui/SplitText";
import { Cta, CtaGhost } from "./ui/Cta";
import "./locations.css";

/* Leaflet pesa ~150 kB: se carga solo cuando hace falta esta sección. */
const BranchMap = lazy(() => import("./BranchMap"));

export default function Locations() {
  const [activeId, setActiveId] = useState(locations[0].id);
  const [fitAll, setFitAll] = useState(0);
  const active = useMemo(
    () => locations.find((l) => l.id === activeId) ?? locations[0],
    [activeId],
  );

  return (
    <section className="section locations" id="sucursales">
      <div className="shell">
        <header className="locations__head">
          <Reveal>
            <span className="eyebrow">Sucursales</span>
          </Reveal>
          <SplitText as="h2" className="section-title" text="Tres talleres en California" step={12} />
        </header>

        <div className="locations__layout">
          {/* ---------- Mapa ---------- */}
          <div className="map">
            <Suspense fallback={<div className="map__canvas map__loading" aria-busy="true" />}>
              <BranchMap active={active} fitAll={fitAll} onSelect={setActiveId} />
            </Suspense>

            <div className="map__overlay">
              <button className="map__all" onClick={() => setFitAll((v) => v + 1)}>
                <MapPin size={13} /> Ver las 3
              </button>
              <span className="map__attr">© Esri · OpenStreetMap</span>
            </div>
          </div>

          {/* ---------- Selector + ficha ---------- */}
          <div className="branch">
            <div className="branch__tabs" role="tablist" aria-label="Sucursales">
              {locations.map((l) => (
                <button
                  key={l.id}
                  role="tab"
                  aria-selected={l.id === activeId}
                  className={`branch__tab ${l.id === activeId ? "is-on" : ""}`}
                  onClick={() => setActiveId(l.id)}
                >
                  {l.id === activeId && (
                    <motion.span
                      layoutId="branch-underline"
                      className="branch__underline"
                      transition={{ type: "spring", stiffness: 420, damping: 36 }}
                    />
                  )}
                  <span className="branch__tab-in">
                    {l.city}
                    {l.isNew && <em aria-hidden title="Sucursal nueva">Nueva</em>}
                  </span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                className="branch__card neon neon--hover neon--slow"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3>{active.city}</h3>
                <p className="branch__blurb">{active.blurb}</p>

                <address className="branch__row">
                  <MapPin size={15} />
                  <span>
                    {active.address}, {active.zip}
                  </span>
                </address>

                <div className="branch__row">
                  <Clock size={15} />
                  <span>Lun a sáb · 8:00 am – 4:00 pm</span>
                </div>

                <div className="advisor">
                  <span className="advisor__icon" aria-hidden>
                    {active.advisor.photo ? (
                      <img src={active.advisor.photo} alt="" />
                    ) : (
                      <Headset size={18} />
                    )}
                  </span>
                  <span className="advisor__meta">
                    <strong>{active.advisor.name || active.advisor.role}</strong>
                    <em>{active.advisor.languages}</em>
                  </span>
                </div>

                <div className="branch__actions">
                  <Cta href={active.phoneHref} size="sm">
                    <Phone size={15} /> {active.phone}
                  </Cta>
                  <CtaGhost href={active.whatsapp} target="_blank" size="sm">
                    <MessageCircle size={15} /> WhatsApp
                  </CtaGhost>
                  <CtaGhost href={active.directions} target="_blank" size="sm">
                    <Navigation size={15} /> Cómo llegar
                  </CtaGhost>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
