import FaqView from "@/views/FaqView";
import { pageMetadata } from "@/lib/seo";
import { getContent } from "@/content";

const { faqPage: page } = getContent("en");
export const metadata = pageMetadata({ locale: "en", path: "/faq", title: page.title, description: page.description });

export default function Page() {
  return <FaqView locale="en" />;
}
