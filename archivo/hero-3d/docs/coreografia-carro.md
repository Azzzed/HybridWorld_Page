# Coreografía del auto — configuración congelada

Estado: **cerrado**. Los valores de `src/three/choreography.ts` y
`src/three/framing.ts` son el resultado de varias rondas de ajuste y
verificación, y no se tocan al personalizar el hero. Lo que cambie en adelante
—tipografía, paleta, copy, paneles, luces, cámara del sitio— va en los
componentes.

## Qué hace

Un recorrido de dos fases atado al scroll, sin ninguna animación autónoma:

1. **Apertura.** Primer plano del frente del auto, ocupando un lado de la
   pantalla y sangrando por ese borde, con el otro lado libre para el texto.
2. **Transición.** Retrocede, gira media vuelta y cruza hacia el otro lado.
3. **Cierre.** El auto entero, de tres cuartos trasera, quieto en su pose final.

El estado es una **función pura del scroll**: subir reproduce el movimiento
hacia atrás y detener el scroll deja el auto exactamente donde está.

## Línea de tiempo

| Tramo | Scroll |
|---|---|
| Apertura inmóvil | 0 – 15% |
| Retroceso | 15 – 62% |
| Giro (0° → 180°) | 32 – 80% |
| Desplazamiento lateral | 20 – 85% |
| Todo estabilizado | 85 – 100% |

El retroceso va por delante del giro a propósito: cuando el auto se pone de
perfil, que es su ángulo más ancho, ya se ha reducido lo suficiente para caber.

## Composición

Los valores se dan para móvil estrecho y para portátil en adelante; cualquier
ancho intermedio recibe una mezcla, así que no hay salto en ningún breakpoint.

| | móvil (380 px) | escritorio (≥1100 px) |
|---|---|---|
| Escala de apertura | 1.45 | 1.58 |
| Posición de apertura | +0.45 | +0.85 |
| Escala de cierre | 1.00 | 1.00 |
| Posición de cierre | 0.00 (centrado) | −0.35 |

Las posiciones se expresan en medios anchos de pantalla: `+1` es el borde
derecho, `−1` el izquierdo.

## Encuadre verificado

Medido ejecutando los módulos reales sobre la geometría de `camry.glb`
(858.289 vértices), en porcentajes del ancho de pantalla:

| Pantalla | Apertura | Cierre |
|---|---|---|
| 16:9 (1920×1080) | 59% .. 117% | 4% .. 54% |
| 16:10 (1440×900) | 58% .. 118% | 4% .. 55% |
| Móvil (375×812) | 23% .. 117% | 14% .. 82% |

Comprobado además:

- giro de 0° exactos al 32% a 180,00° exactos al 80%;
- las tres magnitudes monótonas: el giro nunca retrocede, el desplazamiento
  nunca vuelve a la derecha, la escala nunca vuelve a crecer;
- salto máximo de 0,35° por cada 0,05% de scroll;
- desde el 62% del scroll el auto no se corta en ninguna relación de aspecto.

## Cómo está montado

```
src/three/choreography.ts   línea de tiempo y poses (congelado)
src/three/framing.ts        cámara y encuadre (congelado)
src/three/useHeroScroll.ts  scroll de la sección -> ref, sin re-render
src/components/hero3d/      lienzo, luces y carga del modelo
src/components/HeroScroll.tsx  los dos paneles de texto
public/models/camry.glb     el modelo, tal cual viene
```

Decisiones que sostienen lo anterior y conviene no deshacer sin querer:

- **`frameloop="demand"`**: solo se dibuja mientras el scroll se mueve. Importa
  con un modelo de 1,23 M de triángulos.
- **El avance se guarda en una ref**, no en estado: un re-render de React por
  evento de rueda se notaría.
- **`body { overflow-x: clip }`** en `base.css`: con `hidden` el body pasa a ser
  contenedor de scroll y rompe el `position: sticky` del hero.
- **Objetivo de 28°** en lugar de 40°: con un objetivo corto la cámara queda tan
  cerca que el primer plano se deforma y el auto se sale por arriba y por abajo.

## Si hace falta reajustar

Solo estas cuatro constantes, y midiendo después:

- `HERO_SCALE` / `HERO_OFFSET` — tamaño y sitio de la apertura.
- `FINAL_OFFSET` — más cerca de 0 agranda el cierre.
- `FILL` en `framing.ts` — margen que deja la pose final contra el borde.
