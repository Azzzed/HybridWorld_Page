# Escena de scroll — retirada

Aquí queda la maquinaria del hero con secuencia de fotogramas recorrida por
scroll, por si algún día se quiere recuperar. **No compila**: está fuera de
`src/`, así que TypeScript y Vite la ignoran por completo.

- `ScrollScene.tsx` / `scroll-scene.css` — contenedor alto con lienzo pegado
  (`sticky`) que elige el fotograma según el avance del scroll, cuantizado a
  100 pasos. Soporta tres fuentes: `placeholder`, `photos` y `frames`.
- `carScene.ts` — el sketch 3D de prueba: crossover low-poly con proyección
  en perspectiva, caras ordenadas por profundidad y recorrido de cámara por
  claves interpoladas.
- `priusScene.ts` — la versión con las fotos del Prius de carimage.dev.

Para recuperarla: devolver los cuatro archivos a `src/components/` y
`src/lib/`, y montar `<ScrollScene>` en `Hero.tsx`.
