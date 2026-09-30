import { useEffect, useMemo, useRef } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { locations, type Location } from "../data/locations";
import "leaflet/dist/leaflet.css";

/**
 * Mapa de sucursales (Leaflet). Vive en su propio archivo para que
 * Locations lo cargue con React.lazy: así Leaflet no pesa en el bundle
 * inicial, que es lo que ve el usuario al entrar.
 */

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

/** Mueve la cámara cuando cambia la sucursal activa o se pide ver las 3. */
function Camera({ target, fitAll }: { target: Location; fitAll: number }) {
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
    map.flyToBounds(L.latLngBounds(locations.map((l) => l.coords)).pad(0.25), {
      duration: 1.6,
    });
  }, [map, fitAll]);

  return null;
}

export default function BranchMap({
  active,
  fitAll,
  onSelect,
}: {
  active: Location;
  fitAll: number;
  onSelect: (id: string) => void;
}) {
  const bounds = useMemo(() => L.latLngBounds(locations.map((l) => l.coords)).pad(0.25), []);

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
      {locations.map((l) => (
        <Marker
          key={l.id}
          position={l.coords}
          icon={pinIcon(l.id === active.id, l.city)}
          eventHandlers={{ click: () => onSelect(l.id) }}
          zIndexOffset={l.id === active.id ? 1000 : 0}
        />
      ))}
      <Camera target={active} fitAll={fitAll} />
    </MapContainer>
  );
}
