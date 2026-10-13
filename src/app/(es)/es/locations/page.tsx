import LocationsView from "@/views/LocationsView";
import { pageMetadata } from "@/lib/seo";
import { getContent } from "@/content";

/* Las notas y reseñas de Google se refrescan como mucho una vez al día (ISR). */
export const revalidate = 86400;

const { locationsPage: page } = getContent("es");
export const metadata = pageMetadata({ locale: "es", path: "/locations", title: page.title, description: page.description });

export default function Page() {
  return <LocationsView locale="es" />;
}
