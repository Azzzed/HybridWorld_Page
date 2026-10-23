# Hybrid World Inc — sitio web

Sitio de [Hybrid World Inc](https://hybridworldinc.com), taller especializado
en autos híbridos con sedes en Norwalk, Fullerton y Mountain View
(California). Reemplaza al sitio de GoDaddy en `hybridworldinc.com`; hoy se
despliega en Vercel (`hybridworldinc.vercel.app`).

Una home de una sola página, negra y mate, con el verde del logo como único
acento, y una página por cada sección del menú, todo en inglés (`/`) y en
español (`/es`).

> [!IMPORTANT]
> Antes de publicar hay datos que confirmar con el cliente (teléfonos,
> horario, fotos…): [docs/pendientes-cliente.md](docs/pendientes-cliente.md).

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de producción (páginas estáticas)
npm run start      # sirve el build
npm run lint       # oxlint
npm run check:seo  # revisa el HTML generado (después de build)
```

Hace falta Node 20.9 o superior.

---

## Páginas

| Ruta (también bajo `/es`) | |
|---|---|
| `/` | La home, con todas las secciones (abajo) |
| `/services` | Los 6 servicios, cada uno con su sección (`#hybrid-battery`, `#ac`…) |
| `/locations` | Las 3 sedes (`#norwalk`, `#fullerton`, `#mountain-view`): dirección, teléfono, horario, mapa y nota de Google |
| `/reviews` | La nota de Google de cada sede, enlaces para leer y dejar reseñas, y las reseñas recientes |
| `/faq` | Todas las preguntas frecuentes |
| `/privacy-policy` · `/terms` | Política de privacidad y Términos y condiciones (incluyen los términos del programa de SMS). Solo en inglés, enlazadas desde el footer y `/faq`; el texto está en `src/content/legal.ts` |

Son las secciones del menú: Google usa esas páginas para los enlaces que
muestra debajo del resultado (sitelinks). Cada sección de la home enlaza a su
página.

## Secciones de la home

| Sección | Qué hace |
|---|---|
| **Hero** | Un video de una cámara que gira alrededor de un Prius, gobernado por el scroll. Dos paneles de texto: la apertura (con el H1) y el cierre. |
| **Marcas** | Tira en movimiento con Toyota, Lexus, Ford y Tesla. |
| **Servicios** | Rejilla bento con los 6 servicios (`MagicBento` de ReactBits). «Ver servicio» lleva a su sección en `/services`. |
| **El equipo** | La foto del equipo arranca en un marco pequeño y se abre a pantalla completa conforme se baja. |
| **Autos** | Carrusel horizontal con Prius, Lexus, Camry, Ford y Tesla. |
| **Sucursales** | Mapa oscuro con las 3 ubicaciones; cada una con teléfono directo, WhatsApp y cómo llegar. |
| **Reseñas** | Reseñas de Google en tira horizontal. |
| **Preguntas + galería** | Preguntas frecuentes y, al lado, una galería en espiral con fotos del taller. |
| **Botón flotante** | Contacto rápido con las 3 sucursales. |

El menú no aparece al cargar en escritorio: entra cuando el hero sale de
pantalla. En móvil se ve siempre, con llamar y WhatsApp a la vista.

## Stack

**Next.js 16** (App Router, TypeScript) · React 19 · CSS propio · gsap (solo
en los efectos del bento, cargado aparte) · OGL (WebGL) · Leaflet ·
lucide-react · oxlint.

Las páginas se generan en el build (SSG): el HTML trae el H1, el texto, los
enlaces, las imágenes, la metadata y el JSON-LD sin ejecutar JavaScript. La
home, `/locations` y `/reviews` se regeneran como mucho una vez al día (ISR)
para refrescar las reseñas de Google.

`"use client"` solo va en las piezas interactivas: header y menú móvil, el
canvas del hero, los botones con borde WebGL, las pestañas del mapa, el botón
flotante y la espiral de la galería. Las secciones son componentes de
servidor.

## SEO

- Cada idioma tiene su propio layout raíz (`<html lang="en">` /
  `<html lang="es">`), y cada página su title, description, canonical,
  hreflang (`en`, `es`, `x-default`), Open Graph y Twitter card (imagen de
  1200×630 generada en el build, en `/og/...`).
- JSON-LD (`src/lib/schema.ts`): `Organization` y los 3 talleres como
  `AutoRepair` (dirección, teléfono, horario, coordenadas, ficha de Google),
  los servicios como `Service`, `FAQPage` en `/faq` y `BreadcrumbList` en las
  páginas del menú. Sin reseñas ni `aggregateRating`.
- Dirección, teléfono y horario de cada sede coinciden con su ficha de Google
  Business (Place ID en `business.ts`).
- `/sitemap.xml`, `/robots.txt` y una 404 bilingüe.
- Las URLs del sitio de GoDaddy redirigen con 301 (`next.config.ts`):
  `/about-us-1` → `/`; `/price-list-1` → `/services`; `/contact-us-1` y
  `/ola/services/schedule-service` → `/locations`; `/gallery` → `/#gallery`.
  `/services` conserva su URL.

## Dónde editar

| Archivo | Contiene |
|---|---|
| `src/lib/business.ts` | **Fuente única**: teléfonos, WhatsApp, sedes (dirección, coordenadas, horario, Place ID de Google), servicios y fotos con su `alt`. Lo usan las páginas, el header, el footer, el mapa, el botón flotante y el JSON-LD. |
| `src/content/en.ts` · `es.ts` | Todos los textos de cada idioma. Los dos cumplen el mismo tipo (`types.ts`): si falta un texto en uno, TypeScript lo marca. |
| `src/lib/reviews.ts` | Reseñas de Google (ver abajo). |

Cada página vive en `src/views` (`HomeView`, `ServicesView`, `LocationsView`,
`ReviewsView`, `FaqView`); las rutas de `src/app/(en)` y `src/app/(es)/es`
solo les pasan el idioma.

## Reseñas de Google

Cada sede tiene su ficha en Google Business, y su Place ID está en
`business.ts`. Con `GOOGLE_PLACES_API_KEY` en las variables de entorno de
Vercel, el servidor lee de la **Places API (New)** la nota, el total y las
reseñas de las tres fichas, y las refresca como mucho una vez al día (ISR).
La key nunca llega al navegador. La API devuelve hasta 5 reseñas por ficha
(15 en total).

Sin key, o si la API falla, se muestran la nota y el total de cada ficha
guardados en `business.ts` y 3 reseñas reales de Norwalk. Los enlaces «Leer
reseñas en Google» y «Escribir una reseña» de cada sede funcionan siempre.

## Rendimiento

- El hero pinta el primer fotograma como imagen estática con prioridad alta
  (vertical en móvil, horizontal en escritorio). La secuencia de 122
  fotogramas se baja después; en móvil, uno de cada dos, y con ahorro de datos
  o 2G/3G no se baja. Detalle en [docs/hero-video.md](docs/hero-video.md).
- Los efectos del bento (gsap + WebGL), la espiral de la galería y el mapa de
  Leaflet se cargan con `next/dynamic` cuando se acercan a la pantalla.
- Los botones crean su borde WebGL solo con ratón, cuando están en pantalla y
  con el navegador libre; en táctil el borde es CSS.
- motion y anime.js se quitaron: las entradas al hacer scroll, las tiras en
  movimiento, el menú, el acordeón y las pestañas son CSS.
- Imágenes con `next/image`, fuentes con `next/font` y el CSS dentro del HTML
  (`experimental.inlineCss`).

## Despliegue (Vercel)

- `vercel.json` fija el framework en Next.js: el proyecto estaba configurado
  como Vite.
- `metadataBase` apunta a `https://hybridworldinc.com`. Al conectar el dominio,
  redirigir `hybridworldinc.vercel.app` a él.

## Estructura

```text
src/
  app/
    (en)/            las páginas en inglés (layout raíz con lang="en")
    (es)/es/         las páginas en español (layout raíz con lang="es")
    og/              imágenes Open Graph
    sitemap.ts · robots.ts · global-not-found.tsx
  views/             el contenido de cada página, por idioma
  components/        secciones, header, footer y efectos
  content/           textos en inglés y español
  lib/               datos del negocio, SEO, JSON-LD y reseñas
  styles/            tokens, CSS base y páginas del menú
public/
  hero/              fotogramas del video del hero
  img/               logo, servicios, taller, autos y marcas
scripts/             fotogramas del video, revisión SEO del build…
docs/                hero en video y pendientes del cliente
archivo/hero-3d/     la versión anterior del hero en 3D (no se compila)
assets-src/          originales y escenas retiradas (no se compilan)
```

---

Las marcas y los nombres comerciales que aparecen pertenecen a sus dueños.
Fotos de vehículos: Wikimedia Commons (créditos en `public/img/CREDITS.json`).
