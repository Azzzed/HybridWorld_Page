import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { MessageCircle, Phone, X } from "lucide-react";
import { locations } from "../data/locations";
import "./quickcall.css";

/** Botón flotante: llamar o escribir por WhatsApp a la sucursal que elijas. */
export default function QuickCall() {
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (v) => setShown(v > 0.08 && v < 0.97));

  return (
    <AnimatePresence>
      {shown && (
        <motion.div
          className="qc"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
        >
          <AnimatePresence>
            {open && (
              <motion.ul
                className="qc__menu"
                initial={{ opacity: 0, y: 12, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.94 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <li className="qc__head">Marca a tu sucursal</li>
                {locations.map((l) => (
                  <li key={l.id}>
                    <a href={l.phoneHref}>
                      <Phone size={15} />
                      <span>
                        <strong>{l.city}</strong>
                        <em>{l.phone}</em>
                      </span>
                    </a>
                    <a
                      className="qc__wa"
                      href={l.whatsapp}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`WhatsApp ${l.city}`}
                    >
                      <MessageCircle size={16} />
                    </a>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>

          <button
            className={`qc__fab ${open ? "is-open" : ""}`}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Cerrar contacto rápido" : "Contacto rápido"}
          >
            {open ? <X size={21} /> : <Phone size={20} />}
            <span className="qc__ring" aria-hidden />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
