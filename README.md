# Hybrid World Inc — demo de la página principal

> [!IMPORTANT]
> **Esto es una demo.** Es una propuesta de rediseño de la página principal de
> [Hybrid World Inc](https://hybridworldinc.com), un taller especializado en
> autos híbridos con sucursales en Norwalk, Fullerton y Mountain View
> (California). **No es el sitio oficial**, no está en producción y parte del
> contenido es de muestra. Lo que hay que confirmar antes de publicarla está en
> [Qué es de muestra](#qué-es-de-muestra).

Un sitio de una sola página, negro y mate, con el verde del logo como único
acento: esquinas rectas, botones de contorno con borde neón y efectos que
responden al cursor y al scroll.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # comprueba los tipos y genera /dist
npm run preview  # sirve /dist
npm run lint     # oxlint
```

Hace falta Node 20.19 o superior (Vite 8).

---

## Qué muestra

| Sección | Qué hace |
|---|---|
| **Hero** | Un video de una cámara que gira alrededor de un Prius, **gobernado por el scroll**: bajar lo hace avanzar, subir lo rebobina y parar lo deja quieto. Dos paneles de texto: «Hybrid World» al empezar y «Lo revisamos entero, no solo la batería» al terminar. Hay un video horizontal para escritorio y otro vertical para el móvil. |
| **Marcas** | Tira en movimiento con Toyota, Lexus, Ford y Tesla. |
| **Servicios** | Rejilla bento con los 6 servicios, basada en el `MagicBento` de ReactBits: foco que sigue al cursor, borde que se enciende por cercanía, partículas e imán. Al pasar el mouse, la tarjeta se rellena de negro, toma el borde neón de los botones y muestra la descripción con el enlace «Ver servicio». |
| **El equipo** | La foto del equipo arranca en un marco pequeño y se abre a pantalla completa conforme se baja (`ScrollExpand` de ReactBits). |
| **Autos** | Carrusel horizontal con Prius, Lexus, Camry, Ford y Tesla. |
| **Sucursales** | Mapa oscuro con las 3 ubicaciones; cada una con teléfono directo, WhatsApp y cómo llegar. |
| **Reseñas** | Reseñas de Google en tira horizontal, leídas de `public/reviews.json`. |
| **Preguntas + galería** | Preguntas frecuentes y, al lado, una galería en espiral con fotos del taller. |
| **Botón flotante** | Contacto rápido con las 3 sucursales. |

El menú no aparece al cargar: entra deslizándose cuando el hero sale de
pantalla.

### Para buscadores

- **Datos estructurados** (JSON-LD, `src/components/StructuredData.tsx`): la
  empresa, los tres talleres con dirección, teléfono y horario, y los servicios
  con su descripción y su foto. Se arman con los mismos datos que pinta el
  sitio, así que no pueden contradecirlo.
- **Imágenes**: cada foto de servicio tiene un texto alternativo que describe lo
  que se ve, nombres de archivo descriptivos y dos tamaños en WebP para que el
  navegador baje el justo.

---

## Cómo está hecho

**Stack:** React 19 · TypeScript · Vite 8 · motion.dev · anime.js v4 · gsap ·
OGL (WebGL) · Leaflet · lucide-react · oxlint.

### El hero en video

El video se pinta en un `<canvas>` **fotograma a fotograma** (122 WebP por
video) en lugar de usar `<video>`: los MP4 originales solo traen dos fotogramas
clave en cinco segundos, y buscar con `currentTime` al ritmo del scroll daba
saltos. Se descarga primero el fotograma visible y luego el resto de grueso a
fino, así que el giro se entiende antes de que termine la descarga.

`docs/hero-video.md` explica el funcionamiento y cómo cambiar un video.
`scripts/video-frames/` exporta los fotogramas con WebCodecs, sin ffmpeg.

### Componentes de ReactBits

Se bajaron del registro de ReactBits y se adaptaron al sitio (paleta, esquinas
rectas, TypeScript):

- **MagicBento** (`src/components/MagicBento.tsx`): la rejilla de servicios. El
  borde del hover es el mismo shader que los botones, en un único lienzo WebGL
  que se muda a la tarjeta que tiene el cursor (`src/components/specular-frame.ts`).
- **SpecularButton** (`src/components/reactbits/SpecularButton.tsx`): los botones
  del sitio (`<Cta>` en `src/components/ui/Cta.tsx`), con `href` para usarlos
  como enlaces.
- **ScrollExpand**, **InfiniteSpiral**, **MetallicPaint**, **GradientWaves** y
  **DarkVeil**: equipo, galería y fondos. Los tres últimos ya no se ven en la
  página, pero se conservan.

### Movimiento reducido

Con `prefers-reduced-motion` (en Windows, los «Efectos de animación»
desactivados) el sitio quita las animaciones de entrada y las transiciones.
El hover de los servicios se mantiene, porque solo responde al cursor. Lo que
desplaza cosas sí se apaga: partículas, imán y zoom. Los carruseles giran
siempre a un tercio de velocidad, por decisión del cliente.

---

## Estructura

```text
src/
  components/        secciones del sitio y sus estilos
    hero-video/      el video del hero: canvas, secuencias y scroll
    reactbits/       componentes adaptados de ReactBits
    ui/              botones, revelados y texto animado
  data/              todo el contenido editable
  styles/            tokens (colores, tipografía) y CSS base
public/
  hero/              fotogramas del video del hero (horizontal y vertical)
  img/               logo, servicios, taller, autos y marcas
scripts/             utilidades: fotogramas del video, reseñas de Google…
docs/                documentación del hero en video
archivo/hero-3d/     la versión anterior del hero, en 3D con Three.js (no se compila)
assets-src/          originales y escenas retiradas (no se compilan)
```

### Dónde editar el contenido

Todo el texto vive en `src/data/`:

| Archivo | Contiene |
|---|---|
| `site.ts` | Nombre, teléfonos, correo, horario y menú. |
| `locations.ts` | Las 3 sucursales: dirección, coordenadas, teléfono, WhatsApp y asesor. |
| `services.ts` | Las 6 tarjetas de servicios: texto, descripción para buscadores, foto y su texto alternativo. |
| `reviews.ts` | Reseñas de respaldo, por si `public/reviews.json` no está. |
| `faq.ts` | Preguntas frecuentes. |
| `brands.ts` · `cars.ts` · `shop.ts` | Marcas, autos del carrusel y fotos de la galería. |

---

## Qué es de muestra

Antes de publicar esta demo como sitio real hay que revisar:

- **Datos del negocio.** Teléfonos, direcciones y horario salen del sitio actual
  y de la ficha pública de Google del taller. Conviene confirmarlos.
- **Promociones y garantías.** El «$50 este mes» del cambio de aceite y la
  «Reparación garantizada» del hero son de ejemplo: confirmarlos con el taller.
- **Asesores.** En `locations.ts` el nombre y la foto del asesor de cada
  sucursal están vacíos a propósito; mientras lo estén, la tarjeta muestra un
  rótulo genérico.
- **Reseñas.** `public/reviews.json` se genera con las reseñas de respaldo. Para
  traer las reales de Google hace falta una key de la Places API (ver abajo).
- **Imágenes y video.** El video del hero y las fotos de los servicios son
  material de la demo; hay que tener derecho a publicarlos. Las fotos del taller
  vienen de su ficha de Google, y las de autos y marcas de Wikimedia Commons y
  Simple Icons, con sus créditos en `public/img/CREDITS.json`.
- **Contacto.** No hay formulario: «Ver servicio», «Cotización gratis» y el botón
  flotante abren el teléfono o el WhatsApp de la sucursal.
  `src/components/QuoteForm.tsx` sigue disponible, sin usar.

### Reseñas reales de Google

```bash
# 1. Habilita "Places API (New)" en https://console.cloud.google.com/
# 2. Crea un .env en la raíz a partir de .env.example:
#      GOOGLE_PLACES_API_KEY=tu_key
# 3. Trae las reseñas:
npm run reviews
```

La key nunca llega al navegador: el script corre en tu máquina y escribe
`public/reviews.json`. La Places API devuelve como máximo 5 reseñas por lugar.
El `.env` está en `.gitignore` y no se sube al repositorio.

---

Demo hecha como propuesta de diseño. Las marcas y los nombres comerciales que
aparecen pertenecen a sus dueños.
