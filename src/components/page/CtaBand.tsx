import { MessageCircle, Phone } from "lucide-react";
import { locations, whatsappHref, type Locale } from "@/lib/business";
import { getContent } from "@/content";
import { Cta, CtaGhost } from "../ui/Cta";

/** Cierre de las páginas internas: llamar a la sede que toque o escribir por WhatsApp. */
export default function CtaBand({ locale }: { locale: Locale }) {
  const { ui } = getContent(locale);
  return (
    <aside className="cta-band">
      <div>
        <h2 className="cta-band__title">{ui.cta.title}</h2>
        <p className="cta-band__text">{ui.cta.text}</p>
      </div>
      <div className="cta-band__actions">
        {locations.map((l, i) =>
          i === 0 ? (
            <Cta key={l.slug} href={`tel:${l.phone.tel}`}>
              <Phone size={16} /> {l.city} {l.phone.display}
            </Cta>
          ) : (
            <CtaGhost key={l.slug} href={`tel:${l.phone.tel}`}>
              <Phone size={16} /> {l.city} {l.phone.display}
            </CtaGhost>
          ),
        )}
        <CtaGhost href={whatsappHref()} target="_blank">
          <MessageCircle size={16} /> {ui.whatsapp}
        </CtaGhost>
      </div>
    </aside>
  );
}
