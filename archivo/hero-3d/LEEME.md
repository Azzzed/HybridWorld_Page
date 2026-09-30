# Hero 3D (archivado)

La versión del hero con el Camry en Three.js / React Three Fiber, tal como
estaba antes de pasar al video (`docs/hero-video.md`). No se compila ni se
publica: `tsconfig` solo incluye `src/`, Vite solo sirve `public/` y el lint
ignora esta carpeta.

- `src/components/hero3d/`: lienzo, modelo, sala de hormigón y texturas.
- `src/three/`: coreografía y encuadre congelados, y el hook de scroll.
- `src/components/HeroScroll.tsx` y `hero-scroll.css`: el hero tal como era
  con el 3D (clases `hero3d__*`).
- `public/models/camry.glb`: el modelo (55 MB). **No está en el repositorio**
  (.gitignore): pesa demasiado y su licencia no está confirmada. Solo existe en
  la copia local del proyecto.
- `docs/coreografia-carro.md`: la documentación de la coreografía.

Para recuperarlo: devolver cada carpeta a su sitio, reinstalar
`npm install three @react-three/fiber @react-three/drei` y restaurar
`HeroScroll.tsx` y `hero-scroll.css` desde aquí.
