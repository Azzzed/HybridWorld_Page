# Pendientes para confirmar con Hybrid World

Todo lo que hay que preguntarle al cliente antes de publicar o para mejorar el
contenido. En el código, cada punto está marcado con `TODO(cliente)` junto al
dato o al texto que afecta.

## Reseñas de Google (lo que falta para conectarlas)

- [ ] Crear una API key de **Places API (New)** en Google Cloud (con la cuenta del negocio) y cargarla en Vercel como `GOOGLE_PLACES_API_KEY`. Los Place ID de las tres fichas ya están en `src/lib/business.ts`. Hasta entonces, el sitio muestra la nota y el total de cada ficha guardados a mano el 12/10/2026 (Norwalk 4.7 · 311, Fullerton 4.6 · 55, Mountain View 4.7 · 26) y 3 reseñas reales de Norwalk.

## Fichas de Google Business (afectan al SEO local)

- [ ] **Horario de Fullerton**: Google dice lunes a viernes de 8:30 a 4:00, sábado cerrado; el sitio anterior decía lunes a sábado de 8 a 4. El sitio nuevo usa el de Google: confirmar cuál es el real y que coincida en los dos lados.
- [ ] La ficha de Fullerton se llama **"HW fullerton"**; las otras dos, "Hybrid World, Inc.". Conviene renombrarla igual que las otras.
- [ ] Mountain View: la ficha dice "2362 Old Middlefield Way **B2**"; el sitio ahora también lo dice. Confirmar el número de local.

## Datos del negocio (`src/lib/business.ts`)

- [x] Teléfonos de las sedes: Norwalk (657) 267-9029 · Fullerton (562) 503-3183 · Mountain View (408) 449-1311 (confirmados).
- [x] Teléfono general: (657) 267-9029.
- [x] WhatsApp: +1 657 267 9029.
- [ ] Rango de precios para Google (`priceRange: "$$"` en el JSON-LD; no se muestra en la página).
- [ ] Ciudades de donde llegan más clientes a cada sede (aparecen como "Cerca de" en /locations y en el `areaServed` del JSON-LD).

## Textos legales (`src/content/legal.ts`)

- [ ] El texto entregado traía `[email]`; se usó hybridworldinc25@gmail.com. Confirmar que es el correo que debe aparecer en la Política de privacidad y en los Términos.
- [ ] Están solo en inglés. Si hace falta versión en español, pedir el texto traducido y revisado.

## Contenido

- [ ] "Reparación garantizada / Guaranteed repairs" en el hero y la respuesta sobre garantía en /faq: plazo y condiciones.
- [ ] Cifra "hasta 90% del rendimiento a ~1/4 del costo de la agencia" (preguntas frecuentes): ¿es correcta?
- [ ] Baterías: ¿instalan también baterías nuevas? ¿cuánto tarda el trabajo?
- [ ] Qué incluye la "revisión multipunto" del cambio de aceite.
- [ ] Nombre y foto del asesor de servicio de cada sede (la sección de sucursales de la home muestra hoy un rótulo genérico).

## Fotos

- [ ] En qué sede está la fachada de la foto del equipo (`equipo-hybrid-world.webp`), para mencionarla en el texto alternativo.
- [ ] Derechos de uso de las fotos de los servicios y del video del hero (material de la demo).

## Al cambiar el dominio

- [ ] En Vercel: agregar `hybridworldinc.com` (y `www`) al proyecto y redirigir `hybridworldinc.vercel.app` al dominio.
- [ ] Revisar en Vercel que el *Framework Preset* sea **Next.js** (`vercel.json` ya lo fija).
- [ ] Google Search Console: verificar el dominio, enviar `https://hybridworldinc.com/sitemap.xml` y revisar que los redirects 301 del sitio viejo respondan.
- [ ] En cada ficha de Google Business, poner como sitio web `https://hybridworldinc.com/locations` (o la home).
