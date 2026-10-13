import Image from "next/image";
import Marquee from "./Marquee";
import Reveal from "./ui/Reveal";
import { cars } from "@/lib/business";

/** Mismo efecto de carrusel, ahora con los autos de esas marcas. */
export default function CarStrip({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <section className="cars" aria-labelledby="autos-title">
      <div className="shell cars__head">
        <Reveal>
          <span className="eyebrow">{eyebrow}</span>
          <h2 id="autos-title" className="section-title">
            {title}
          </h2>
        </Reveal>
      </div>

      <Marquee duration={58} reverse gap={18}>
        {cars.map((c) => (
          <figure className="car-card" key={c.src}>
            <Image
              src={c.src}
              alt={`${c.brand} ${c.model}`}
              width={c.width}
              height={c.height}
              sizes="(max-width: 900px) 260px, 360px"
            />
            <figcaption>
              <span className="car-card__model">{c.model}</span>
              <span className="car-card__brand">{c.brand}</span>
            </figcaption>
          </figure>
        ))}
      </Marquee>
    </section>
  );
}
