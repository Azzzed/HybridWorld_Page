import { useMemo, useState } from "react";
import { ChevronDown, Mail, MessageCircle, Send } from "lucide-react";
import { locations } from "../data/locations";
import { site } from "../data/site";
import { Cta, CtaGhost } from "./ui/Cta";
import "./quote-form.css";

/**
 * Formulario de cotización. Vive en el hero.
 *
 * No tiene backend: arma el mensaje y lo abre por WhatsApp o por correo.
 * Para mandarlo a un servidor, reemplaza `openWhatsApp` / `openMail` por un
 * fetch a tu endpoint (Formspree, Netlify Forms, etc.).
 */

const EMPTY = {
  name: "",
  phone: "",
  email: "",
  vehicle: "",
  branch: locations[0].id,
  message: "",
};

export default function QuoteForm({ id }: { id?: string }) {
  const [form, setForm] = useState(EMPTY);
  const branch = locations.find((l) => l.id === form.branch) ?? locations[0];

  const body = useMemo(
    () =>
      [
        `Hola Hybrid World (${branch.city}), quiero una cotización.`,
        "",
        `Nombre: ${form.name || "—"}`,
        `Teléfono: ${form.phone || "—"}`,
        `Correo: ${form.email || "—"}`,
        `Vehículo: ${form.vehicle || "—"}`,
        "",
        `Qué le pasa: ${form.message || "—"}`,
      ].join("\n"),
    [form, branch],
  );

  const set =
    (k: keyof typeof EMPTY) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const openWhatsApp = () =>
    window.open(`${branch.whatsapp}?text=${encodeURIComponent(body)}`, "_blank", "noopener");

  const openMail = () =>
    window.open(
      `mailto:${site.email}?subject=${encodeURIComponent(
        `Cotización ${branch.city} — ${form.vehicle || "vehículo híbrido"}`,
      )}&body=${encodeURIComponent(body)}`,
    );

  return (
    <form
      id={id}
      className="quote__card"
      onSubmit={(e) => {
        e.preventDefault();
        openWhatsApp();
      }}
    >
      <header className="quote__head">
        <h2>Cotización gratis</h2>
        <p>Sin compromiso. Se habla español.</p>
      </header>

      <div className="field">
        <label htmlFor="q-branch">Sucursal</label>
        <div className="field__select">
          <select id="q-branch" value={form.branch} onChange={set("branch")}>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.city} — {l.address}
              </option>
            ))}
          </select>
          <ChevronDown size={16} />
        </div>
      </div>

      <div className="field__row">
        <div className="field">
          <label htmlFor="q-name">Nombre</label>
          <input id="q-name" value={form.name} onChange={set("name")} placeholder="Tu nombre" />
        </div>
        <div className="field">
          <label htmlFor="q-phone">Teléfono</label>
          <input
            id="q-phone"
            type="tel"
            value={form.phone}
            onChange={set("phone")}
            placeholder="(562) 000-0000"
            required
          />
        </div>
      </div>

      <div className="field__row">
        <div className="field">
          <label htmlFor="q-email">Correo</label>
          <input
            id="q-email"
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="tucorreo@ejemplo.com"
          />
        </div>
        <div className="field">
          <label htmlFor="q-vehicle">Vehículo</label>
          <input
            id="q-vehicle"
            value={form.vehicle}
            onChange={set("vehicle")}
            placeholder="Prius 2012…"
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="q-msg">¿Qué le pasa?</label>
        <textarea
          id="q-msg"
          rows={2}
          value={form.message}
          onChange={set("message")}
          placeholder="Triángulo rojo, código P0A80, pierde fuerza…"
        />
      </div>

      <div className="quote__actions">
        <Cta type="submit" size="sm">
          <MessageCircle size={16} /> Enviar por WhatsApp
        </Cta>
        <CtaGhost type="button" size="sm" onClick={openMail}>
          <Mail size={16} /> Enviar por correo
        </CtaGhost>
      </div>

      <p className="quote__note">
        <Send size={13} /> Va al asesor de {branch.city} · {branch.phone}
      </p>
    </form>
  );
}
