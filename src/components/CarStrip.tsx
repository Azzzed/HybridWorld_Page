import Marquee from "./Marquee";
import Reveal from "./ui/Reveal";
import { cars } from "../data/cars";

/** Mismo efecto de carrusel, ahora con los autos de esas marcas. */
export default function CarStrip() {
  return (
    <section className="cars" aria-labelledby="autos-title">
      <div className="shell cars__head">
        <Reveal>
          <span className="eyebrow">Lo que pasa por el taller</span>
          <h2 id="autos-title" className="section-title">
            Prius, Lexus, Camry, Ford y Tesla
          </h2>
        </Reveal>
      </div>

      <Marquee duration={58} reverse gap={18}>
        {cars.map((c) => (
          <figure className="car-card" key={c.src}>
            <img src={c.src} alt={`${c.brand} ${c.model}`} loading="lazy" />
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
