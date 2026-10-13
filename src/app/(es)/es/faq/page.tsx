import FaqView from "@/views/FaqView";
import { pageMetadata } from "@/lib/seo";
import { getContent } from "@/content";

const { faqPage: page } = getContent("es");
export const metadata = pageMetadata({ locale: "es", path: "/faq", title: page.title, description: page.description });

export default function Page() {
  return <FaqView locale="es" />;
}
