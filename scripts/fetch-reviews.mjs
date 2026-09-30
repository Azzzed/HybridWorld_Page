/**
 * Trae las reseñas reales desde la Google Places API (New) y las escribe en
 * public/reviews.json, que es lo que el sitio lee en caliente.
 *
 *   1. Consigue una API key en https://console.cloud.google.com/
 *      (habilita "Places API (New)" y restríngela por IP para uso en servidor).
 *   2. Ponla en un archivo .env en la raíz:
 *        GOOGLE_PLACES_API_KEY=xxxxxxxx
 *        # opcional, si ya conoces el Place ID:
 *        GOOGLE_PLACE_ID=ChIJ...
 *   3. npm run reviews
 *
 * Se ejecuta a mano o en el build (no en el navegador) para que la key nunca
 * viaje al cliente. Si la API falla, public/reviews.json se queda como estaba
 * y el sitio sigue usando las reseñas que tiene empaquetadas.
 */

import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "public", "reviews.json");

/* Carga .env sin dependencias */
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

const KEY_FIELDS = "places.id,places.displayName,places.rating,places.userRatingCount";

async function findPlaceId(key) {
  const r = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": KEY_FIELDS,
    },
    body: JSON.stringify({
      textQuery: "Hybrid World Inc, 12139 Firestone Blvd, Norwalk, CA 90650",
      languageCode: "es",
    }),
  });
  if (!r.ok) throw new Error(`searchText ${r.status}: ${await r.text()}`);
  const j = await r.json();
  const place = j.places?.[0];
  if (!place) throw new Error("La búsqueda no devolvió ningún lugar");
  console.log(`  lugar encontrado: ${place.displayName?.text} (${place.id})`);
  return place.id;
}

async function fetchPlace(key, placeId) {
  const r = await fetch(`https://places.googleapis.com/v1/places/${placeId}?languageCode=es`, {
    headers: {
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": "id,displayName,rating,userRatingCount,googleMapsUri,reviews",
    },
  });
  if (!r.ok) throw new Error(`places/${placeId} ${r.status}: ${await r.text()}`);
  return r.json();
}

/** Pasa la respuesta de Google al tipo `Review` que usa el sitio. */
function toReview(r) {
  const texto = r.originalText?.text ?? r.text?.text ?? "";
  return {
    author: r.authorAttribution?.displayName ?? "Cliente de Google",
    photo: r.authorAttribution?.photoUri ?? "",
    meta: "Reseña de Google",
    when: r.relativePublishTimeDescription ?? "",
    rating: r.rating ?? 5,
    text: texto.replace(/\s+/g, " ").trim(),
  };
}

async function main() {
  await loadEnv();
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) {
    console.error(
      "\n  Falta GOOGLE_PLACES_API_KEY.\n" +
        "  Crea un .env en la raíz con:  GOOGLE_PLACES_API_KEY=tu_key\n" +
        "  El sitio sigue funcionando con las reseñas empaquetadas.\n",
    );
    process.exit(1);
  }

  const placeId = process.env.GOOGLE_PLACE_ID || (await findPlaceId(key));
  const place = await fetchPlace(key, placeId);

  const payload = {
    fetchedAt: new Date().toISOString(),
    placeId: place.id,
    name: place.displayName?.text ?? "Hybrid World, Inc.",
    rating: place.rating ?? null,
    count: place.userRatingCount ?? null,
    url: place.googleMapsUri ?? "https://maps.google.com/maps?cid=5416074954660802581",
    reviews: (place.reviews ?? []).map(toReview).filter((r) => r.text.length > 0),
  };

  await fs.writeFile(OUT, JSON.stringify(payload, null, 2) + "\n");
  console.log(
    `\n  ✓ ${payload.reviews.length} reseñas guardadas en public/reviews.json` +
      `  ·  ${payload.rating} ★ de ${payload.count}\n`,
  );
  if (payload.reviews.length <= 5) {
    console.log(
      "  Nota: la Places API devuelve como máximo 5 reseñas por lugar.\n" +
        "  Para mostrar más hace falta la API de Google Business Profile,\n" +
        "  que requiere ser dueño verificado de la ficha.\n",
    );
  }
}

main().catch((e) => {
  console.error("\n  Error:", e.message, "\n");
  process.exit(1);
});
