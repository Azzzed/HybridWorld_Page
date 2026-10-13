"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Parte un titular en palabras y letras (spans) para animarlas una por una.
 * El texto completo queda en aria-label y las letras se ocultan al lector de
 * pantalla, que así lee el titular entero y no letra por letra.
 */
function split(el: HTMLElement) {
  if (el.classList.contains("is-split")) return;
  el.setAttribute("aria-label", el.textContent?.replace(/\s+/g, " ").trim() ?? "");
  let index = 0;

  const walk = (node: Node) => {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        for (const part of (child.textContent ?? "").split(/(\s+)/)) {
          if (!part) continue;
          if (/^\s+$/.test(part)) {
            frag.append(" ");
            continue;
          }
          const word = document.createElement("span");
          word.className = "st-word";
          word.setAttribute("aria-hidden", "true");
          for (const ch of part) {
            const char = document.createElement("span");
            char.className = "st-char";
            char.style.setProperty("--i", String(index++));
            char.textContent = ch;
            word.append(char);
          }
          frag.append(word);
        }
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE && (child as Element).tagName !== "BR") {
        walk(child);
      }
    }
  };

  walk(el);
  el.classList.add("is-split");
}

/**
 * Un solo IntersectionObserver para todos los `.reveal` y los titulares
 * `[data-split]` de la página: les pone `is-in` al entrar en pantalla. Se
 * rehace al cambiar de ruta, porque la página nueva trae elementos nuevos.
 */
export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(".reveal:not(.is-in), [data-split]:not(.is-in)");
    if (!targets.length) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          io.unobserve(el);
          if (el.hasAttribute("data-split") && !calm) {
            split(el);
            // Un fotograma con las letras ya partidas y escondidas, para que
            // la transición arranque desde ahí
            requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("is-in")));
          } else {
            el.classList.add("is-in");
          }
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -6% 0px" },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
