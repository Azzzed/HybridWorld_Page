# Hero: video gobernado por el scroll

El hero ya no usa Three.js. Es un video de una cámara que gira alrededor de un
Prius en una sala de hormigón con neón verde, y el scroll lo mueve adelante y
atrás. La escena 3D anterior está guardada en `archivo/hero-3d/`.

Hay dos videos del mismo giro:

| Video | Dónde | Composición |
|---|---|---|
| Horizontal, 1280×720 | Escritorio, tabletas apaisadas y móviles apaisados | Texto a la izquierda al empezar y a la derecha al terminar; el auto, al otro lado |
| Vertical, 720×1280 | Móviles y tabletas en vertical | El auto en la mitad de abajo; el texto arriba (y los botones de la apertura, abajo) |

El corte entre los dos es `VERTICAL_QUERY` en
`src/components/hero-video/sequence.ts`, y es el mismo con el que
`hero-scroll.css` pasa a la composición de móvil.

## Cómo funciona

- `src/components/hero-video/FrameSequence.tsx` pinta el video en un canvas,
  **fotograma a fotograma**. No usa `<video>`: los MP4 originales solo traen
  dos fotogramas clave en 5 s, así que buscar con `currentTime` al ritmo del
  scroll daba saltos, sobre todo hacia atrás. Con imágenes sueltas, cada
  posición del scroll es un fotograma exacto.
- Sigue al scroll con un amortiguado ligero: nunca se mueve solo; parar el
  scroll lo deja quieto y subir lo hace volver.
- Descarga solo el video que toca, empezando por el fotograma visible y los
  extremos, y luego de grueso a fino (uno de cada 16, de cada 8…), así que el
  giro se entiende aunque la descarga no haya terminado. Si se gira el móvil,
  cambia de video y reanuda la descarga del otro sin perder la del primero.
- El video cubre la pantalla y lo que sobra de los lados se recorta según
  `framing`:
  - **`pan` (horizontal):** en pantallas más estrechas que 16:9 el recorte se
    desliza con el giro, para dejar sitio al texto de la izquierda al principio
    y al de la derecha al final.
  - **`follow` (vertical):** el recorte se centra en el auto (`focus`).
- En móviles apaisados y ventanas apaisadas pequeñas se ocultan las ventajas y
  los avisos de scroll, y los botones van uno encima de otro.

Tramos del scroll (en `HeroScroll.tsx`):

| Qué | Scroll |
|---|---|
| Video, del primer al último fotograma | 4 – 86 % |
| Texto de apertura se va | 10 – 30 % |
| Haz y panel oscuro se van | 8 – 27 % |
| Cierre entra, pieza a pieza | 76 – 100 % |

## Archivos

| | |
|---|---|
| `public/hero/prius-1280/001…122.webp` | horizontal, 1280×720, calidad 0,78 (≈4,3 MB) |
| `public/hero/prius-vertical/001…122.webp` | vertical, 720×1280, calidad 0,72 (≈3,6 MB) |

El primer fotograma de cada uno se precarga desde `index.html`, con el mismo
corte que usa el hero.

## Cambiar un video

No hace falta ffmpeg: el navegador decodifica el MP4 con WebCodecs y un
servidor local guarda los fotogramas.

```bash
node scripts/video-frames/server.mjs ruta/al/video.mp4 public/hero/prius-1280
```

Abrir en Chrome o Edge `http://127.0.0.1:5199/?w=1280&q=0.78&analyze=1` y
esperar a que diga `LISTO`. Para el vertical, la carpeta es
`public/hero/prius-vertical` y la URL `http://127.0.0.1:5199/?q=0.72` (sin
`w`: se queda en su tamaño).

Con `analyze=1` la página imprime una línea `focus: [...]`: el centro del auto
a lo largo del video, que va en `focus` de su video en `sequence.ts`. Solo es
fiable con el horizontal. En el vertical el auto empieza oscuro y el suelo
mojado confunde la medición, así que esa lista se fija mirando los fotogramas
(12 puntos repartidos por el video). Si un video nuevo tiene otro número de
fotogramas, actualizar `FRAME_COUNT`. `track.json`, que también se genera, es
solo para consulta: se puede borrar.

La composición cuenta con esto:

- **Horizontal:** el auto termina a la izquierda, con el morro hacia el 60 %
  del ancho.
- **Vertical:** el auto termina en la mitad de abajo.

Si un video nuevo termina en otra pose, revisar:

- el ancho de `.hero-scroll__close-body` en `hero-scroll.css`;
- los velos de móvil (`.hero-scroll__overlay` y `.hero-scroll__scrim`);
- el haz de la apertura (`BEAM` en `HeroScroll.tsx`), que pasa justo delante
  del morro del primer fotograma horizontal.
