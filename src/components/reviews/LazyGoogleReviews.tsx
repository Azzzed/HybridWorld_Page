"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { GoogleReviewsCarouselProps } from "./GoogleReviewsCarousel";

const Carousel = dynamic(() => import("./GoogleReviewsCarousel"), { ssr: false });

/**
 * El carrusel (react-google-reviews, ~130 KB de JS con su slider) solo se
 * descarga cuando la sección se acerca a la pantalla: no compite con el
 * primer pintado de la página. Hasta entonces, un hueco del mismo alto.
 */
export default function LazyGoogleReviews(props: GoogleReviewsCarouselProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="grc-wrap">
      {show && <Carousel {...props} />}
    </div>
  );
}
