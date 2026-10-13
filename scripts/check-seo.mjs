/**
 * Revisa el HTML que genera `next build` (sin ejecutar JavaScript) y comprueba
 * lo básico de SEO en cada ruta: <html lang>, un solo H1, title, description,
 * canonical, hreflang (en / es / x-default), og:image absoluta, Twitter card,
 * JSON-LD válido y cantidad de texto.
 *
 *   npm run build && node scripts/check-seo.mjs
 *
 * Termina con código 1 si alguna ruta falla.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..", ".next", "server", "app");
const SITE = "https://hybridworldinc.com";

/** Todos los .html prerenderizados, menos los internos de Next. */
function htmlFiles(dir, base = "") {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const rel = path.join(base, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.startsWith("(") || entry.name.startsWith("_") || entry.name === "og") return [];
      return htmlFiles(path.join(dir, entry.name), rel);
    }
    return entry.name.endsWith(".html") && !entry.name.startsWith("_") ? [rel] : [];
  });
}

const toRoute = (file) => {
  const route = "/" + file.replace(/\\/g, "/").replace(/\.html$/, "");
  return route === "/index" ? "/" : route;
};

const attr = (tag, name) => tag.match(new RegExp(`${name}="([^"]*)"`))?.[1];
const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");

function check(file) {
  const html = fs.readFileSync(path.join(ROOT, file), "utf8");
  const route = toRoute(file);
  const problems = [];

  const lang = html.match(/<html[^>]*\slang="([^"]+)"/)?.[1];
  const expectedLang = route === "/es" || route.startsWith("/es/") ? "es" : "en";
  if (lang !== expectedLang) problems.push(`lang="${lang}" (esperado ${expectedLang})`);

  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => decode(m[1].replace(/<[^>]+>/g, "").trim()));
  if (h1s.length !== 1) problems.push(`${h1s.length} H1`);

  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "");
  if (!title) problems.push("sin <title>");

  const metas = [...html.matchAll(/<meta [^>]+>/g)].map((m) => m[0]);
  const meta = (key, value) => metas.find((t) => attr(t, key) === value);
  const description = attr(meta("name", "description") ?? "", "content");
  if (!description) problems.push("sin description");

  const links = [...html.matchAll(/<link [^>]+>/g)].map((m) => m[0]);
  const canonical = attr(links.find((l) => attr(l, "rel") === "canonical") ?? "", "href");
  const expectedCanonical = SITE + (route === "/" ? "" : route);
  if (canonical !== expectedCanonical && canonical !== expectedCanonical + "/") {
    problems.push(`canonical ${canonical} (esperado ${expectedCanonical})`);
  }

  const hreflang = Object.fromEntries(
    links.filter((l) => attr(l, "rel") === "alternate" && attr(l, "hrefLang")).map((l) => [attr(l, "hrefLang"), attr(l, "href")]),
  );
  for (const lng of ["en", "es", "x-default"]) if (!hreflang[lng]?.startsWith(SITE)) problems.push(`sin hreflang ${lng}`);

  const ogImage = attr(meta("property", "og:image") ?? "", "content");
  if (!ogImage?.startsWith(SITE + "/og/")) problems.push(`og:image ${ogImage}`);
  if (attr(meta("property", "og:image:width") ?? "", "content") !== "1200") problems.push("og:image sin 1200 de ancho");
  if (attr(meta("name", "twitter:card") ?? "", "content") !== "summary_large_image") problems.push("sin twitter:card");

  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const types = [];
  for (const block of jsonLd) {
    try {
      const data = JSON.parse(block);
      const nodes = data["@graph"] ?? [data];
      types.push(...nodes.map((n) => n["@type"]));
      if (block.includes("aggregateRating") || block.includes('"Review"')) problems.push("JSON-LD con reseñas");
    } catch (e) {
      problems.push(`JSON-LD inválido: ${e.message}`);
    }
  }

  const body = html.match(/<main[\s\S]*<\/main>/)?.[0] ?? "";
  const words = decode(
    body
      .replace(/<script[\s\S]*?<\/script>/g, " ")
      .replace(/<style[\s\S]*?<\/style>/g, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .split(/\s+/)
    .filter(Boolean).length;

  const noindex = Boolean(meta("name", "robots") && /noindex/.test(attr(meta("name", "robots"), "content")));

  return { route, lang, h1: h1s[0], title, canonical, ogImage, types, words, noindex, problems };
}

const results = htmlFiles(ROOT).map(check).sort((a, b) => a.route.localeCompare(b.route));
let failed = 0;
for (const r of results) {
  const status = r.problems.length ? "✗" : "✓";
  if (r.problems.length) failed += 1;
  console.log(
    `${status} ${r.route.padEnd(44)} ${r.lang}  ${String(r.words).padStart(4)} palabras  [${r.types.join(", ")}]${r.noindex ? "  noindex" : ""}`,
  );
  for (const p of r.problems) console.log(`    · ${p}`);
}
console.log(`\n${results.length} rutas, ${failed} con problemas`);
process.exit(failed ? 1 : 0);
