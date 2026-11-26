# Pendientes para confirmar con Hybrid World

Todo lo que hay que preguntarle al cliente antes de publicar o para mejorar el
contenido. En el código, cada punto está marcado con `TODO(cliente)` junto al
dato o al texto que afecta.

## Reseñas de Google (lo que falta para conectarlas)

- [ ] Crear una API key de **Places API (New)** en Google Cloud (con la cuenta del negocio) y cargarla en Vercel como `GOOGLE_PLACES_API_KEY`. Los Place ID de las tres fichas ya están en `src/lib/business.ts`. Hasta entonces, el sitio muestra la nota y el total de cada ficha guardados a mano el 12/10/2026 (Norwalk 4.7 · 311, Fullerton 4.6 · 55, Mountain View 4.7 · 26) y 3 reseñas reales de Norwalk.

## Fichas de Google Business (afectan al SEO local)

- [ ] **Horario de Fullerton**: Google dice lunes a viernes de 8:30 a 4:00, sábado cerrado; el sitio anterior decía lunes a sábado de 8 a 4. El sitio nuevo usa el de Google: confirmar cuál es el real y que coincida en los dos lados.
- [ ] La ficha de Fullerton se llama **"HW fullerton"**; las otras dos, "Hybrid World, Inc.". Conviene renombrarla igual que las otras.
- [ ] Datos viejos que pueden seguir en directorios (Yelp, Facebook, Bing, Apple, BBB…): teléfonos **(714) 880-4499** y **(562) 888-9770** y el correo **hybridworld2022@gmail.com** (salían en el sitio de 2022). Buscarlos y cambiarlos por los actuales.
- [ ] Mountain View: la ficha dice "2362 Old Middlefield Way **B2**"; el sitio ahora también lo dice. Confirmar el número de local.

## Página de Mountain View (`/locations/mountain-view`)

Los textos están en `src/content/locations/mountain-view.ts`; lo que falta está marcado con `TODO(cliente)` o `TODO(técnico)`.

- [ ] **Revisión técnica** de los textos de batería y motor: 28 módulos de 7.2 V (201.6 V), código P0A80 y la falla EGR → junta de cabeza del 2ZR-FXE.
- [ ] **Fotos del taller** (carrusel): confirmar en qué sede se tomó cada una y mandar más de Mountain View (Instagram, Facebook o la ficha de Google). Hoy salen 5 fotos enviadas por el cliente y 6 de la ficha de Google de Hybrid World.
- [ ] **Tiempo** de una reparación de batería, para la pregunta "¿Cuánto tarda…?" (hoy dice que se informa después del escaneo).
- [ ] **Estacionamiento y referencias cercanas**: falta la pregunta "¿Dónde me estaciono?" y el párrafo propio de la sede (referencias, estacionamiento, equipo). No se publican hasta tener el texto real.
- [ ] **Foto propia** de la sede: confirmar si `taller-02.jpg` (los Tesla en las rampas) es de Mountain View. Es la imagen de la sede en el JSON-LD; en la página no se muestra hasta confirmarlo.
- [x] **Reseñas** (25/11/2026): widget de Featurable conectado a la ficha de Mountain View (`featurableId` en `business.ts`). El sitio lee de ahí la nota, el total y las reseñas reales (cada 24 h) y la página las muestra en un carrusel (react-google-reviews). Si Featurable falla, usa el respaldo de business.ts (4.8 · 50).
- [x] **Redes** de la sede: Instagram @hybridworld.mountainview, Facebook /Hwmountainview y TikTok @hwmountainview (en `business.ts`; salen en la página, en el footer y en el `sameAs` del JSON-LD).
- [x] **Garantías** (19/11/2026): 30 días en reparaciones de misfire; 3 meses en piezas (bombas de agua, luces, pantallas, radios, radiadores…), junta de cabeza y reparación de batería híbrida; 6 meses en motores reconstruidos y baterías reconstruidas completas; 1 año en "pilas de 12v completas" y en baterías reconstruidas con celdas de 4.ª generación. En la página van las de batería, motor, junta, bombas y radiadores, y misfire. Pendiente: confirmar qué significa "pilas de 12v completas" (¿baterías auxiliares de 12 V?) y si hay condiciones (millas, uso).

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

- [ ] Garantía: los plazos ya están (ver Mountain View, arriba); faltan las condiciones por servicio (millas, uso). Se quitó "Reparación garantizada / Guaranteed repairs" del hero porque, sin términos publicados, Google Ads puede rechazar la página; con los términos, se publica una página /warranty y se vuelve a poner.
- [x] Se quitó la cifra "hasta 90% del rendimiento a ~1/4 del costo" (no había con qué respaldarla). Si el cliente tiene datos, se puede volver a poner.
- [ ] Baterías: ¿instalan también baterías nuevas? ¿cuánto tarda el trabajo?
- [ ] Qué incluye la "revisión multipunto" del cambio de aceite.
- [ ] Nombre y foto del asesor de servicio de cada sede (la sección de sucursales de la home muestra hoy un rótulo genérico).

## Fotos

- [ ] En qué sede está la fachada de la foto del equipo (`equipo-hybrid-world.webp`), para mencionarla en el texto alternativo.
- [ ] Derechos de uso de las fotos de los servicios y del video del hero (material de la demo).

## Al cambiar el dominio

- [ ] En Vercel: agregar `hybridworldinc.com` (y `www`) al proyecto y redirigir `hybridworldinc.vercel.app` al dominio.
- [ ] Revisar en Vercel que el *Framework Preset* sea **Next.js** (`vercel.json` ya lo fija).
- [ ] Google Search Console: verificar el dominio, enviar `https://www.hybridworldinc.com/sitemap.xml` y revisar que los redirects 301 del sitio viejo respondan.
- [ ] En cada ficha de Google Business, poner como sitio web `https://www.hybridworldinc.com/locations` (o la home).
