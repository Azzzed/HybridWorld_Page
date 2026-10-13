"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { MapPoint } from "./BranchMap";
import "../locations.css";

/* Leaflet va en su propio chunk y solo cuando el mapa se acerca a la pantalla */
const BranchMap = dynamic(() => import("./BranchMap"), {
  ssr: false,
  loading: () => <div className="map__canvas map__loading" aria-busy="true" />,
});

/**
 * Mapa de /locations con las tres sedes. Tocar un pin baja a la ficha de
 * esa sede, que está en el HTML debajo del mapa.
 */
export default function LocationsMap({ points, credit, label }: { points: MapPoint[]; credit: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [active, setActive] = useState(points[0].slug);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShow(true);
        io.disconnect();
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const select = (slug: string) => {
    setActive(slug);
    document.getElementById(slug)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="map locations-map" ref={ref} role="region" aria-label={label}>
      {show ? <BranchMap points={points} active={active} fitAll={0} onSelect={select} /> : <div className="map__canvas map__loading" />}
      <div className="map__overlay">
        <span className="map__attr">{credit}</span>
      </div>
    </div>
  );
}
