import type { Locale } from "@/lib/business";
import { faqSchema } from "@/lib/schema";
import { faqItems, getContent } from "@/content";
import PageIntro from "@/components/page/PageIntro";
import CtaBand from "@/components/page/CtaBand";
import FaqList from "@/components/FaqList";
import JsonLd from "@/components/JsonLd";

/** /faq: todas las preguntas, con su FAQPage (solo aquí, no en la home). */
export default function FaqView({ locale }: { locale: Locale }) {
  const c = getContent(locale);
  const items = faqItems(locale);

  return (
    <main id="main" className="page">
      <JsonLd data={faqSchema(items, locale)} />
      <div className="shell">
        <PageIntro locale={locale} path="/faq" name={c.ui.nav.faq} eyebrow={c.home.faq.eyebrow} title={c.faqPage.h1} intro={c.faqPage.intro} />
        <div className="faq-page">
          <FaqList items={items} />
        </div>
        <CtaBand locale={locale} />
      </div>
    </main>
  );
}
