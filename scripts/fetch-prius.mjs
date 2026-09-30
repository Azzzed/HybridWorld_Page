/**
 * Baja los ángulos del Prius 2026 plata desde carimage.dev.
 *
 * Cuesta 1 crédito por imagen entregada. La API solo ofrece SEIS ángulos
 * fijos, así que este script gasta como mucho 6 créditos.
 *
 *   CAR_IMAGE_API_KEY=...  (en .env, nunca en el código)
 *   node scripts/fetch-prius.mjs
 */

import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "public", "img", "prius");

/* Prius 2026 del catálogo (GET /api/v1/vehicles?make=toyota&model=prius) */
const VEHICLE = "veh_fk381t13pphvj";
const COLOR = "silver";
const SIZE = 1024;

/** Los seis ángulos que expone la API, con su yaw real. */
const VIEWS = [
  { id: "front", yaw: 0 },
  { id: "front-3-4", yaw: 35 },
  { id: "side", yaw: 90 },
  { id: "rear-3-4", yaw: 145 },
  { id: "rear", yaw: 180 },
  { id: "side-right", yaw: 270 },
];

async function loadEnv() {
  try {
    const raw = await fs.readFile(path.join(ROOT, ".env"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    /* sin .env, se usan las variables del entorno */
  }
}

await loadEnv();
const KEY = process.env.CAR_IMAGE_API_KEY;
if (!KEY) {
  console.error("\n  Falta CAR_IMAGE_API_KEY en .env\n");
  process.exit(1);
}

await fs.mkdir(OUT, { recursive: true });
const manifest = [];
let remaining = null;

for (const view of VIEWS) {
  const url =
    `https://carimage.dev/api/v1/images/car` +
    `?vehicle=${VEHICLE}&view=${view.id}&color=${COLOR}` +
    `&w=${SIZE}&background=transparent&format=png`;

  const res = await fetch(url, { headers: { Authorization: `Bearer ${KEY}` } });
  if (!res.ok) {
    console.error(`  FALLO ${view.id}: ${res.status} ${(await res.text()).slice(0, 200)}`);
    continue;
  }

  const buf = Buffer.from(await res.arrayBuffer());
  const file = `${view.id}.png`;
  await fs.writeFile(path.join(OUT, file), buf);

  const charged = res.headers.get("x-credits-charged");
  remaining = res.headers.get("x-credits-remaining") ?? remaining;
  const source = res.headers.get("x-image-source");
  const dims = `${res.headers.get("x-image-width")}x${res.headers.get("x-image-height")}`;

  manifest.push({ view: view.id, yaw: view.yaw, file, width: Number(res.headers.get("x-image-width")) });
  console.log(
    `  ok ${view.id.padEnd(11)} ${dims.padEnd(10)} ${(buf.length / 1024).toFixed(0)}kb` +
      `  ·  ${charged} crédito  ·  ${source}  ·  quedan ${remaining}`,
  );
}

await fs.writeFile(
  path.join(OUT, "manifest.json"),
  JSON.stringify({ vehicle: VEHICLE, model: "Toyota Prius 2026", color: COLOR, views: manifest }, null, 2) + "\n",
);
console.log(`\n  ${manifest.length} imágenes en public/img/prius · créditos restantes: ${remaining}\n`);
