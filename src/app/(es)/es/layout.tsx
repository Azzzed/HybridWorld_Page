import type { ReactNode } from "react";
import RootDocument from "@/components/layout/RootDocument";
import { layoutMetadata, layoutViewport } from "@/lib/layout-metadata";

/** Layout raíz en español (/es): <html lang="es">. */
export const metadata = layoutMetadata;
export const viewport = layoutViewport;

export default function Layout({ children }: { children: ReactNode }) {
  return <RootDocument locale="es">{children}</RootDocument>;
}
