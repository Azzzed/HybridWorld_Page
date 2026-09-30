# Renders originales — Toyota Prius 2026 plata

PNG a 1024×1024 con alfa, tal como los entrega carimage.dev.
**No se sirven**: Vite solo publica lo que está en `public/`, y estos pesan
~850 kB cada uno. Lo que va al sitio son los `.webp` de
`public/img/prius/` (~55 kB cada uno, mismo alfa).

- Vehículo: `veh_fk381t13pphvj` (Toyota Prius 2026)
- Color: `silver` (#c3c6cb)
- Coste: 6 créditos, uno por ángulo
- Ángulos: front (0°), front-3-4 (35°), side (90°), rear-3-4 (145°),
  rear (180°), side-right (270°)

Para regenerarlos: `node scripts/fetch-prius.mjs` (vuelve a cobrar 1 crédito
por imagen). Para volver a convertirlos a WebP, ver el README principal.
