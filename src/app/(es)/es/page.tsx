import HomeView from "@/views/HomeView";
import { pageMetadata } from "@/lib/seo";
import { getContent } from "@/content";

/* Las reseñas de Google se refrescan como mucho una vez al día (ISR). */
export const revalidate = 86400;

const { home } = getContent("es");
export const metadata = pageMetadata({ locale: "es", path: "/", title: home.title, description: home.description });

export default function Page() {
  return <HomeView locale="es" />;
}
