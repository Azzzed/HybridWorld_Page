import { WEEKDAYS, type Locale, type OpeningHours, type Weekday } from "./business";

/**
 * Rutas por idioma: el inglés vive en la raíz (/) y el español bajo /es.
 */
export const localePath = (locale: Locale, path: string) => {
  if (locale === "en") return path;
  return path === "/" ? "/es" : `/es${path}`;
};

/** Separa el idioma de una ruta: "/es/faq" → { locale: "es", path: "/faq" }. */
export const splitLocale = (pathname: string): { locale: Locale; path: string } => {
  if (pathname === "/es" || pathname.startsWith("/es/")) {
    return { locale: "es", path: pathname.slice(3) || "/" };
  }
  return { locale: "en", path: pathname };
};

export const otherLocale = (locale: Locale): Locale => (locale === "en" ? "es" : "en");

/** Páginas que solo existen en inglés (los textos legales). */
export const ENGLISH_ONLY_PATHS = ["/privacy-policy", "/terms"];

/** La misma página en el otro idioma; si no existe en ese idioma, su home. */
export const alternatePath = (locale: Locale, path: string) => {
  const target = otherLocale(locale);
  return localePath(target, target === "es" && ENGLISH_ONLY_PATHS.includes(path) ? "/" : path);
};

export const htmlLang: Record<Locale, string> = { en: "en", es: "es" };
export const ogLocale: Record<Locale, string> = { en: "en_US", es: "es_US" };

const DAY_NAMES: Record<Locale, Record<Weekday, { short: string; long: string }>> = {
  en: {
    Monday: { short: "Mon", long: "Monday" },
    Tuesday: { short: "Tue", long: "Tuesday" },
    Wednesday: { short: "Wed", long: "Wednesday" },
    Thursday: { short: "Thu", long: "Thursday" },
    Friday: { short: "Fri", long: "Friday" },
    Saturday: { short: "Sat", long: "Saturday" },
    Sunday: { short: "Sun", long: "Sunday" },
  },
  es: {
    Monday: { short: "Lun", long: "Lunes" },
    Tuesday: { short: "Mar", long: "Martes" },
    Wednesday: { short: "Mié", long: "Miércoles" },
    Thursday: { short: "Jue", long: "Jueves" },
    Friday: { short: "Vie", long: "Viernes" },
    Saturday: { short: "Sáb", long: "Sábado" },
    Sunday: { short: "Dom", long: "Domingo" },
  },
};

/** "16:00" → "4:00 PM" / "4:00 p. m." */
export function formatTime(time: string, locale: Locale) {
  const [h, m] = time.split(":").map(Number);
  const hour = h % 12 || 12;
  const half = h < 12 ? (locale === "en" ? "AM" : "a. m.") : locale === "en" ? "PM" : "p. m.";
  return `${hour}:${String(m).padStart(2, "0")} ${half}`;
}

/** Horario día por día, de lunes a domingo, para tablas. */
export function hoursByDay(hours: OpeningHours, locale: Locale) {
  return WEEKDAYS.map((day) => {
    const slot = hours.find((h) => h.days.includes(day));
    return {
      day: DAY_NAMES[locale][day].long,
      hours: slot ? `${formatTime(slot.opens, locale)} – ${formatTime(slot.closes, locale)}` : null,
    };
  });
}

/** Resumen de una línea: "Mon–Sat · 8:00 AM – 4:00 PM". */
export function hoursSummary(hours: OpeningHours, locale: Locale) {
  return hours
    .map(({ days, opens, closes }) => {
      const first = DAY_NAMES[locale][days[0]].short;
      const last = DAY_NAMES[locale][days[days.length - 1]].short;
      const range = days.length > 1 ? `${first}–${last}` : first;
      return `${range} · ${formatTime(opens, locale)} – ${formatTime(closes, locale)}`;
    })
    .join(" / ");
}
