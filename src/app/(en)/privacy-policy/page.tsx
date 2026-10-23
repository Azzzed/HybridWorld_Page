import LegalView from "@/views/LegalView";
import { privacyPolicy } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";

/* Solo en inglés (texto legal): sin versión /es ni hreflang. Comparte la imagen OG de la home. */
export const metadata = pageMetadata({
  locale: "en",
  path: privacyPolicy.path,
  title: privacyPolicy.metaTitle,
  description: privacyPolicy.description,
  translated: false,
  image: "/og/en",
});

export default function Page() {
  return <LegalView doc={privacyPolicy} />;
}
