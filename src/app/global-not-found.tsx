import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { business, fullAddress, locations } from "@/lib/business";
import { archivo, athiti } from "@/lib/fonts";
import "@/index.css";
import "@/styles/not-found.css";

/**
 * 404 de las URLs que no existen. Como hay dos layouts raíz (inglés y
 * español), esta página no pasa por ninguno: trae su propio <html>, sus
 * estilos y sus fuentes, y va en los dos idiomas.
 */
export const metadata: Metadata = {
  title: "Page not found · Página no encontrada | Hybrid World Inc",
  description: "This page doesn't exist. Hybrid battery repair and replacement in Norwalk, Fullerton and Mountain View.",
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${archivo.variable} ${athiti.variable}`}>
      <body>
        <main className="not-found">
          <div className="shell">
            <a href="/" className="not-found__brand" aria-label={`${business.name} — home`}>
              <Image src={business.logoMark} alt="" width={48} height={35} />
              <strong>{business.name}</strong>
            </a>

            <span className="eyebrow">404</span>
            <h1 className="not-found__title">Page not found</h1>
            <p className="not-found__text">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
            <p className="not-found__text" lang="es">
              Página no encontrada: la página que buscas no existe o cambió de dirección.
            </p>

            <div className="not-found__actions">
              <a className="cta-ghost cta-ghost--md" href="/">
                Go to the home page <ArrowRight size={16} aria-hidden="true" />
              </a>
              <a className="cta-ghost cta-ghost--md" href="/es" lang="es">
                Ir al inicio en español <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>

            <h2 className="not-found__subtitle">Locations · Sucursales</h2>
            <ul className="not-found__list">
              {locations.map((l) => (
                <li key={l.slug}>
                  <MapPin size={15} aria-hidden="true" />
                  <strong>{l.city}</strong>
                  <span>{fullAddress(l)}</span>
                  <a href={`tel:${l.phone.tel}`}>{l.phone.display}</a>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </body>
    </html>
  );
}
