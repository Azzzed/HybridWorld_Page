import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { business } from "@/lib/business";
import type { LegalDoc } from "@/content/legal";
import PageIntro from "@/components/page/PageIntro";

/** Enlaces dentro del texto: el correo, el teléfono y la URL de la política. */
const LINKS: { match: string; render: (key: number) => ReactNode }[] = [
  {
    match: "hybridworldinc.com/privacy-policy",
    render: (key) => (
      <Link key={key} href="/privacy-policy">
        hybridworldinc.com/privacy-policy
      </Link>
    ),
  },
  {
    match: business.email,
    render: (key) => (
      <a key={key} href={`mailto:${business.email}`}>
        {business.email}
      </a>
    ),
  },
  {
    match: "(408) 449-1311",
    render: (key) => (
      <a key={key} href="tel:+14084491311">
        (408) 449-1311
      </a>
    ),
  },
];

function linkify(text: string): ReactNode {
  const pattern = new RegExp(`(${LINKS.map((l) => l.match.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`);
  return text.split(pattern).map((part, i) => {
    const link = LINKS.find((l) => l.match === part);
    return link ? link.render(i) : <Fragment key={i}>{part}</Fragment>;
  });
}

/** /privacy-policy y /terms (solo en inglés). */
export default function LegalView({ doc }: { doc: LegalDoc }) {
  return (
    <main id="main" className="page">
      <div className="shell">
        <PageIntro locale="en" path={doc.path} name={doc.name} eyebrow="Legal" title={doc.title} intro={`Effective date: ${doc.effectiveDate}`} />

        <article className="legal">
          <p>{linkify(doc.intro)}</p>
          {doc.sections.map((s) => (
            <section key={s.h2}>
              <h2>{s.h2}</h2>
              {s.paragraphs?.map((p) => (
                <p key={p}>{linkify(p)}</p>
              ))}
              {s.bullets && (
                <ul>
                  {s.bullets.map((b) => (
                    <li key={b}>{linkify(b)}</li>
                  ))}
                </ul>
              )}
              {s.numbered && (
                <ol>
                  {s.numbered.map((n) => (
                    <li key={n}>{linkify(n)}</li>
                  ))}
                </ol>
              )}
            </section>
          ))}
        </article>
      </div>
    </main>
  );
}
