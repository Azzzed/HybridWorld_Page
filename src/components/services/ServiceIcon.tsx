import { Droplet, Funnel, Settings, Snowflake, Thermometer, Zap, type LucideIcon, type LucideProps } from "lucide-react";
import type { ServiceIcon as IconKey } from "@/lib/business";

const ICONS: Record<IconKey, LucideIcon> = {
  zap: Zap,
  snowflake: Snowflake,
  gear: Settings,
  droplet: Droplet,
  funnel: Funnel,
  thermometer: Thermometer,
};

/** El icono de un servicio (la clave vive en business.ts). */
export default function ServiceIcon({ icon, ...props }: { icon: IconKey } & LucideProps) {
  const Icon = ICONS[icon];
  return <Icon aria-hidden="true" {...props} />;
}
