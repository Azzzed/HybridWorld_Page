import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import InfiniteSpiral from "./reactbits/InfiniteSpiral";
import { faq } from "../data/faq";
import { shopPhotos } from "../data/shop";
import Reveal from "./ui/Reveal";
import SplitText from "./ui/SplitText";
import "./contact.css";

/** Fotos del taller intercaladas con los híbridos que pasan por él. */
const GALLERY = [
  ...shopPhotos.map((p) => ({ src: p.src, alt: p.alt })),
  { src: "/img/cars/prius-gen3-a.jpg", alt: "Toyota Prius ZVW30, tercera generación" },
  { src: "/img/cars/prius-gen3-c.jpg", alt: "Toyota Prius XW30" },
  { src: "/img/cars/tesla-model3.jpg", alt: "Tesla Model 3" },
  { src: "/img/cars/lexus-rx.jpg", alt: "Lexus RX 450h" },
];

export default function Contact() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section contact" id="faq">
      <div className="shell contact__layout">
        {/* ---------- FAQ ---------- */}
        <div className="faq">
          <Reveal>
            <span className="eyebrow">Dudas</span>
          </Reveal>
          <SplitText as="h2" className="section-title faq__title" text="Preguntas frecuentes" step={12} />

          <div className="faq__list">
            {faq.map((item, i) => {
              const isOpen = open === i;
              return (
                <div className={`faq__item ${isOpen ? "is-open" : ""}`} key={item.q}>
                  <button
                    className="faq__q"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    <span>{item.q}</span>
                    <motion.span
                      className="faq__chev"
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <ChevronDown size={18} />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        className="faq__a"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <p>{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* ---------- Galería en movimiento ---------- */}
        <div className="gallery">
          <InfiniteSpiral
            items={GALLERY}
            animationMode="auto"
            speed={0.4}
            direction="up"
            radius={150}
            cardWidth={210}
            cardHeight={132}
            verticalSpacing={58}
            cardsPerTurn={9}
            perspective={1000}
            cardRadius={0}
            cardTilt={2}
            centerScale={1.18}
            edgeFade={0.55}
            edgeBlur={3}
            grayscale={0.6}
            pauseOnHover={false}
            className="gallery__spiral"
          />
        </div>
      </div>
    </section>
  );
}
