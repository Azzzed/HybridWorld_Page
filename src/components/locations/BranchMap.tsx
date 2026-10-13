"use client";

import { useEffect, useMemo, useRef } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/**
 * Mapa de sucursales (Leaflet). BranchExplorer lo carga con next/dynamic
 * (sin SSR) cuando la sección se acerca a la pantalla, así Leaflet no pesa
 * en el bundle inicial.
 */

export type MapPoint = { slug: string; city: string; coords: [number, number] };

/** Pin de marca dibujado con HTML para poder animarlo con CSS. */
const pinIcon = (active: boolean, city: string) =>
  L.divIcon({
    className: "",
    html: `<span class="pin ${active ? "pin--on" : ""}">
             <span class="pin__pulse"></span>
             <span class="pin__core"></span>
             <span class="pin__label">${city}</span>
           </span>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

/** Mueve la cámara cuando cambia la sucursal activa o se pide ver todas. */
function Camera({ target, bounds, fitAll }: { target: MapPoint; bounds: L.LatLngBounds; fitAll: number }) {
  const map = useMap();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    map.flyTo(target.coords, 15, { duration: 1.5 });
  }, [map, target]);

  useEffect(() => {
    if (!fitAll) return;
    map.flyToBounds(bounds, { duration: 1.6 });
  }, [map, bounds, fitAll]);

  return null;
}

export default function BranchMap({
  points,
  active,
  fitAll,
  onSelect,
}: {
  points: MapPoint[];
  active: string;
  fitAll: number;
  onSelect: (slug: string) => void;
}) {
  const bounds = useMemo(() => L.latLngBounds(points.map((p) => p.coords)).pad(0.25), [points]);
  const target = points.find((p) => p.slug === active) ?? points[0];

  return (
    <MapContainer
      bounds={bounds}
      scrollWheelZoom={false}
      zoomControl={false}
      className="map__canvas"
      attributionControl={false}
    >
      {/* Basemap oscuro de Esri: gratuito y sin API key (solo pide atribución) */}
      <TileLayer
        url="https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        maxZoom={16}
        maxNativeZoom={16}
      />
      <TileLayer
        url="https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
        maxZoom={16}
        maxNativeZoom={16}
      />
      {points.map((p) => (
        <Marker
          key={p.slug}
          position={p.coords}
          icon={pinIcon(p.slug === active, p.city)}
          eventHandlers={{ click: () => onSelect(p.slug) }}
          zIndexOffset={p.slug === active ? 1000 : 0}
        />
      ))}
      <Camera target={target} bounds={bounds} fitAll={fitAll} />
    </MapContainer>
  );
}
