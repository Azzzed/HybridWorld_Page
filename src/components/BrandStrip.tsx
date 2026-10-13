import Image from "next/image";
import Marquee from "./Marquee";
import { brands } from "@/lib/business";

/** Tira de logos en movimiento. Sin título ni contenedor: solo las marcas. */
export default function BrandStrip({ label }: { label: string }) {
  return (
    <section className="brands" aria-label={label}>
      <Marquee duration={34} gap={0}>
        {brands.map((b) => (
          <span className="brand-logo" key={b.name}>
            <Image
              src={`/img/brands/${b.file}.svg`}
              alt={b.name}
              width={120}
              height={44}
              unoptimized
              style={{ height: `calc(var(--logo-h) * ${b.scale})`, width: "auto" }}
            />
          </span>
        ))}
      </Marquee>
    </section>
  );
}
