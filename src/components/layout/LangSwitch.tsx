"use client";

import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import type { Locale } from "@/lib/business";
import { localePath, otherLocale, splitLocale } from "@/lib/i18n";

/**
 * Enlace a la misma página en el otro idioma. Es un <a> normal (no <Link>):
 * cada idioma tiene su propio layout raíz y el cambio recarga la página.
 */
export default function LangSwitch({ locale, label, className = "" }: { locale: Locale; label: string; className?: string }) {
  const { path } = splitLocale(usePathname() || "/");
  const target = otherLocale(locale);
  return (
    <a className={`lang-switch ${className}`.trim()} href={localePath(target, path)} hrefLang={target} lang={target}>
      <Languages size={15} aria-hidden="true" />
      {label}
    </a>
  );
}
