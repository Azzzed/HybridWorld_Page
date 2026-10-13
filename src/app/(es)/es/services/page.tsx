import ServicesView from "@/views/ServicesView";
import { pageMetadata } from "@/lib/seo";
import { getContent } from "@/content";

const { servicesPage: page } = getContent("es");
export const metadata = pageMetadata({ locale: "es", path: "/services", title: page.title, description: page.description });

export default function Page() {
  return <ServicesView locale="es" />;
}
