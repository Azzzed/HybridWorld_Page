import Marquee from "./Marquee";
import { brands } from "../data/brands";

/** Tira de logos en movimiento. Sin título ni contenedor: solo las marcas. */
export default function BrandStrip() {
  return (
    <section className="brands" aria-label="Marcas que atendemos">
      <Marquee duration={34} gap={0}>
        {brands.map((b) => (
          <span className="brand-logo" key={b.name}>
            <img
              src={`/img/brands/${b.file}.svg`}
              alt={b.name}
              loading="lazy"
              style={{ height: `calc(var(--logo-h) * ${b.scale})` }}
            />
          </span>
        ))}
      </Marquee>
    </section>
  );
}
