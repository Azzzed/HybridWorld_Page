import type { Metadata } from "next";
import BranchView from "@/views/BranchView";
import { branchPages, type LocationSlug } from "@/lib/business";
import { pageMetadata } from "@/lib/seo";
import { getBranchContent } from "@/content/locations";

/* Las notas y reseñas de Google se refrescan como mucho una vez al día (ISR). */
export const revalidate = 86400;

/** Solo las sedes con página propia (`hasPage` en business.ts); el resto, 404. */
export const dynamicParams = false;
export const generateStaticParams = () => branchPages.map((l) => ({ slug: l.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getBranchContent(slug as LocationSlug, "en");
  if (!page) return {};
  return pageMetadata({ locale: "en", path: `/locations/${slug}`, title: page.title, description: page.description });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <BranchView locale="en" slug={slug as LocationSlug} />;
}
