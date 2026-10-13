import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/content/types";
import "./contact.css";

/**
 * Preguntas frecuentes con <details>: todas las respuestas están en el HTML
 * (se indexan aunque estén cerradas) y abren sin JavaScript.
 */
export default function FaqList({ items, openFirst = true }: { items: FaqItem[]; openFirst?: boolean }) {
  return (
    <div className="faq__list">
      {items.map((item, i) => (
        <details className="faq__item" key={item.q} open={openFirst && i === 0}>
          <summary className="faq__q">
            <span>{item.q}</span>
            <span className="faq__chev" aria-hidden="true">
              <ChevronDown size={18} />
            </span>
          </summary>
          <div className="faq__a">
            <p>{item.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
