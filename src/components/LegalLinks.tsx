import Link from "next/link";
import type { Locale } from "@/lib/business";
import { getContent } from "@/content";

/**
 * Enlaces a la Política de privacidad y a los Términos (solo en inglés, en
 * /privacy-policy y /terms). Van en el footer de todas las páginas y en /faq.
 */
export default function LegalLinks({ locale, className = "" }: { locale: Locale; className?: string }) {
  const { legal } = getContent(locale).ui;
  return (
    <p className={`legal-links ${className}`.trim()}>
      <Link href="/privacy-policy" hrefLang="en">
        {legal.privacy}
      </Link>
      <span aria-hidden="true">·</span>
      <Link href="/terms" hrefLang="en">
        {legal.terms}
      </Link>
      {legal.englishOnly && <span className="legal-links__note">{legal.englishOnly}</span>}
    </p>
  );
}
