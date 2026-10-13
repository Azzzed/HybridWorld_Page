import ReviewsView from "@/views/ReviewsView";
import { pageMetadata } from "@/lib/seo";
import { getContent } from "@/content";

/* Las notas y reseñas de Google se refrescan como mucho una vez al día (ISR). */
export const revalidate = 86400;

const { reviewsPage: page } = getContent("en");
export const metadata = pageMetadata({ locale: "en", path: "/reviews", title: page.title, description: page.description });

export default function Page() {
  return <ReviewsView locale="en" />;
}
