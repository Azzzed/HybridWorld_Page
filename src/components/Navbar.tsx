import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Phone, X } from "lucide-react";
import { nav, site } from "../data/site";
import { locations } from "../data/locations";
import { Cta } from "./ui/Cta";
import "./navbar.css";

/**
 * El menú no está presente al cargar: aparece cuando el hero sale de pantalla,
 * de modo que el primer scroll sea solo el hero.
 */
export default function Navbar() {
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero) return;

    /* El observer dispara en cuanto se llama observe(), así que el estado
       inicial lo define él y no hace falta tocarlo aquí. */
    const io = new IntersectionObserver(
      ([e]) => {
        setShow(!e.isIntersecting);
        if (e.isIntersecting) setOpen(false);
      },
      /* Sin rootMargin el hero deja de intersecar justo cuando sale entero
         de la pantalla: ese es el momento en que aparece el menú. */
      { threshold: 0 },
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        className="nav"
        initial={false}
        animate={{ y: show ? 0 : "-110%" }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden={!show}
      >
        <div className="shell nav__in">
          <a href="#top" className="nav__brand" aria-label={`${site.name} — inicio`}>
            <img src={site.logoMark} alt="" width={48} height={35} />
            <span>
              <strong>Hybrid World</strong>
              <em>Auto Repair</em>
            </span>
          </a>

          <nav className="nav__links" aria-label="Principal">
            {nav.map((item) => (
              <a key={item.href} href={item.href} tabIndex={show ? 0 : -1}>
                <span>{item.label}</span>
              </a>
            ))}
          </nav>

          <div className="nav__actions">
            <a className="nav__phone" href={site.mainPhoneHref} tabIndex={show ? 0 : -1}>
              <Phone size={15} strokeWidth={2.2} />
              {site.mainPhone}
            </a>
            <span className="nav__cta">
              {/* Sin formulario en la página, la cotización se pide por
                  WhatsApp a la sucursal principal. */}
              <Cta href={locations[0].whatsapp} target="_blank" size="sm">
                Cotización gratis
              </Cta>
            </span>
            <button
              className="nav__burger"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
              tabIndex={show ? 0 : -1}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="drawer"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {nav.map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + i * 0.05 }}
              >
                {item.label}
              </motion.a>
            ))}
            <span className="drawer__cta">
              <Cta
                href={locations[0].whatsapp}
                target="_blank"
                onClick={() => setOpen(false)}
              >
                Cotización gratis
              </Cta>
            </span>
            <a className="drawer__phone" href={site.mainPhoneHref}>
              <Phone size={16} /> {site.mainPhone}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
