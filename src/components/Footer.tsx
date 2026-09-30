import { Mail, MapPin, Phone } from "lucide-react";
import { locations } from "../data/locations";
import { nav, site } from "../data/site";
import "./footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top" aria-hidden />

      <div className="shell footer__grid">
        <div className="footer__brand">
          <a href="#top" className="footer__logo">
            <img src={site.logoMark} alt="" width={64} height={47} />
            <span>
              <strong>Hybrid World Inc</strong>
              <em>{site.tagline}</em>
            </span>
          </a>
          <p className="footer__pitch">
            Escríbenos y te respondemos con una cotización.{" "}
            <strong>Se habla español.</strong>
          </p>
          <div className="footer__contact">
            <a href={site.mainPhoneHref}>
              <Phone size={15} /> {site.mainPhone}
            </a>
            <a href={`mailto:${site.email}`}>
              <Mail size={15} /> {site.email}
            </a>
          </div>
        </div>

        <div className="footer__col">
          <h3>Sucursales</h3>
          <ul className="footer__branches">
            {locations.map((l) => (
              <li key={l.id}>
                <MapPin size={14} />
                <div>
                  <strong>{l.city}</strong>
                  <span>
                    {l.address}, {l.zip}
                  </span>
                  <a href={l.phoneHref}>{l.phone}</a>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h3>Horario</h3>
          <ul className="footer__hours">
            {site.hours.map((h) => (
              <li key={h.day} className={h.open === "Cerrado" ? "is-closed" : ""}>
                <span>{h.day}</span>
                <span>{h.open}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h3>Navegación</h3>
          <ul className="footer__nav">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href}>{n.label}</a>
              </li>
            ))}
            <li>
              <a href={locations[0].whatsapp} target="_blank" rel="noreferrer noopener">
                Cotización por WhatsApp
              </a>
            </li>
            <li>
              <a href={site.googleMapsUrl} target="_blank" rel="noreferrer noopener">
                Ficha en Google
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="shell footer__legal">
        <p>© {new Date().getFullYear()} Hybrid World Inc — Todos los derechos reservados.</p>
        <p className="footer__credits">
          Fotos del taller: ficha de Google de Hybrid World Inc · Fotos de vehículos:
          Wikimedia Commons · Logos: Simple Icons. Las marcas son de sus dueños.
        </p>
      </div>
    </footer>
  );
}
