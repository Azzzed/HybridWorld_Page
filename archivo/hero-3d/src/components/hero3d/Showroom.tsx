import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { MeshReflectorMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js'
import { FOV } from '../../three/framing'
import type { Stage } from '../../three/framing'
import { FLOOR_TILE, WALL_TILE, floorTexture, glowTexture, goboTexture, wallTexture } from './concrete'

RectAreaLightUniformsLib.init()

/* Verde del logo, el mismo de --neon. */
const NEON = '#12e06b'
/* Núcleo de las ranuras: casi blanco; el verde lo pone el halo. */
const SLOT_CORE = '#c4ffdd'
/* Lavado del muro: blanco apenas frío. El hormigón tiene que leerse gris; el
   verde se queda en las ranuras y en lo que tienen alrededor. */
const WASH = '#e4ecea'

/** Distancia de cámara en escritorio: la sala está diseñada a esta escala. */
const REFERENCE_DISTANCE = 8.35

/**
 * Distancia del muro detrás del auto. El auto, en su pose más grande (escala
 * 1,58), barre un círculo de radio 3,43 al girar: 4,2 deja margen de sobra.
 */
const WALL_DEPTH = 4.2

type Vec3 = [number, number, number]

type Props = {
  stage: Stage
  narrow: boolean
}

/** Una luz de área apuntada a un punto: así es fácil razonar hacia dónde ilumina. */
function AreaLight({ position, aim, width, height, intensity, color }: {
  position: Vec3
  aim: Vec3
  width: number
  height: number
  intensity: number
  color: string
}) {
  const ref = useRef<THREE.RectAreaLight>(null)
  useLayoutEffect(() => {
    ref.current?.lookAt(aim[0], aim[1], aim[2])
  }, [aim])
  return (
    <rectAreaLight
      ref={ref}
      position={position}
      width={width}
      height={height}
      intensity={intensity}
      color={color}
    />
  )
}

/**
 * Ranura de luz empotrada en el hormigón: un núcleo casi blanco que no pasa por
 * el tone mapping (así se lee como fuente de luz) y un halo verde aditivo.
 */
function Slot({ center, rotationY, length, thickness, glowWidth, vertical, glow, strength, core }: {
  center: Vec3
  rotationY: number
  length: number
  thickness: number
  glowWidth: number
  vertical: boolean
  glow: THREE.Texture
  strength: number
  /** Brillo del núcleo: 1 es la ranura a plena luz. */
  core: number
}) {
  const coreColor = useMemo(() => new THREE.Color(SLOT_CORE).multiplyScalar(core), [core])

  return (
    <group position={center} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0, 0.004]}>
        <planeGeometry args={vertical ? [thickness, length] : [length, thickness]} />
        <meshBasicMaterial color={coreColor} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0.008]} rotation={[0, 0, vertical ? 0 : Math.PI / 2]}>
        <planeGeometry args={[glowWidth, length]} />
        <meshBasicMaterial
          map={glow}
          color={NEON}
          transparent
          opacity={strength}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

/**
 * La sala: un muro de hormigón visto detrás del auto y un suelo de hormigón
 * pulido, con ranuras de luz verde empotradas y una bruma verde muy baja.
 *
 * La cámara es fija, así que todo se coloca por su posición en pantalla: un
 * rayo desde la cámara hasta el plano del muro dice dónde cae cada elemento.
 * Y la sala escala con la distancia de cámara, de modo que en móvil, donde la
 * cámara está mucho más lejos, la composición queda igual que en escritorio.
 */
export default function Showroom({ stage, narrow }: Props) {
  const gl = useThree((state) => state.gl)
  const width = useThree((state) => state.size.width)
  const height = useThree((state) => state.size.height)

  const textures = useMemo(() => {
    const wall = wallTexture()
    const floor = floorTexture()
    const glow = glowTexture()
    const gobo = goboTexture()
    const anisotropy = gl.capabilities.getMaxAnisotropy()
    wall.anisotropy = anisotropy
    floor.anisotropy = anisotropy
    return { wall, floor, glow, gobo }
  }, [gl])

  useEffect(
    () => () => {
      textures.wall.dispose()
      textures.floor.dispose()
      textures.glow.dispose()
      textures.gobo.dispose()
    },
    [textures],
  )

  const room = useMemo(() => {
    const k = Math.max(1, stage.distance / REFERENCE_DISTANCE)
    const depth = WALL_DEPTH * k

    // El muro mira a la cámara y es vertical: su normal es la dirección de
    // vista proyectada en el suelo.
    const normal = new THREE.Vector3(stage.basis.forward.x, 0, stage.basis.forward.z).normalize()
    const along = new THREE.Vector3(normal.z, 0, -normal.x) // a lo largo del muro
    const rotationY = Math.atan2(normal.x, normal.z)
    const base = normal.clone().multiplyScalar(-depth)

    const vTan = Math.tan(THREE.MathUtils.degToRad(FOV) / 2)
    const hTan = vTan * (width / height)
    const eye = stage.target.clone().addScaledVector(stage.basis.forward, stage.distance)

    /** Punto del muro que se ve en una posición de pantalla (NDC, -1..1). */
    const onWall = (x: number, y: number) => {
      const dir = stage.basis.forward
        .clone()
        .negate()
        .addScaledVector(stage.basis.right, x * hTan)
        .addScaledVector(stage.basis.up, y * vTan)
      const t = base.clone().sub(eye).dot(normal) / dir.dot(normal)
      return eye.clone().addScaledVector(dir, t)
    }

    const lift = (p: THREE.Vector3, amount: number) =>
      p.clone().addScaledVector(normal, amount).toArray() as Vec3

    const wall = { width: 70 * k, height: 26 * k }

    // Ranura vertical a la derecha, como la luz de la esquina de la referencia
    const slotFoot = onWall(0.86, 0).setY(0)
    const slotLength = 3.4 * k

    // Línea alta, casi en el borde superior del cuadro
    const topLeft = onWall(-1.25, 0.86)
    const topRight = onWall(1.25, 0.86)
    const topCenter = topLeft.clone().add(topRight).multiplyScalar(0.5)

    // Lavado de luz sobre el muro, arriba al centro
    const washSpot = onWall(0.3, 0.5)

    // Banda de luz de ventana, a la izquierda del muro
    const windowSpot = onWall(-0.55, 0.35)

    return {
      k,
      normal,
      rotationY,
      wall,
      wallCenter: [base.x, wall.height / 2, base.z] as Vec3,
      slot: {
        center: lift(slotFoot.clone().setY(slotLength / 2), 0.004),
        length: slotLength,
      },
      top: {
        center: lift(topCenter, 0.004),
        length: topLeft.distanceTo(topRight),
      },
      cove: {
        center: lift(base.clone().setY(0.022 * k), 0.004),
      },
      light: {
        slot: lift(slotFoot.clone().setY(1.7 * k), 0.12 * k),
        slotAim: [0, 0.6, 0] as Vec3,
        cove: lift(base.clone().setY(0.06 * k), 0.12 * k),
        coveAim: lift(base.clone().setY(2.2 * k), 1.4 * k),
        wash: washSpot
          .clone()
          .addScaledVector(normal, 3.4 * k)
          .addScaledVector(along, 1.1 * k)
          .setY(washSpot.y + 2.4 * k)
          .toArray() as Vec3,
        washAim: washSpot,
        window: windowSpot
          .clone()
          .addScaledVector(normal, 5 * k)
          .addScaledVector(along, 2.5 * k)
          .setY(windowSpot.y + 3.5 * k)
          .toArray() as Vec3,
        windowAim: windowSpot,
      },
    }
  }, [stage, width, height])

  // El muro se repite en teselas de 4 × 4 paneles; la proporción no depende de
  // la escala, así que basta con fijarla una vez por textura.
  useLayoutEffect(() => {
    textures.wall.repeat.set(70 / WALL_TILE.w, 26 / WALL_TILE.h)
    textures.floor.repeat.set(90 / FLOOR_TILE, 90 / FLOOR_TILE)
  }, [textures])

  // Los focos apuntan a un objeto: fuera de la escena su matriz no se
  // actualiza sola, así que se hace a mano.
  const targets = useMemo(() => {
    const aim = (point: THREE.Vector3) => {
      const target = new THREE.Object3D()
      target.position.copy(point)
      target.updateMatrixWorld()
      return target
    }
    return { wash: aim(room.light.washAim), window: aim(room.light.windowAim) }
  }, [room])

  const { k } = room

  return (
    <>
      {/* Bruma verde casi negra: el muro se aleja un poco, el auto no. */}
      <fog attach="fog" args={['#030605', stage.distance * 1.25, stage.distance * 3.4]} />

      {/* ---------- Muro ---------- */}
      <mesh position={room.wallCenter} rotation={[0, room.rotationY, 0]}>
        <planeGeometry args={[room.wall.width, room.wall.height]} />
        <meshStandardMaterial
          map={textures.wall}
          color="#a2a6a9"
          roughness={0.94}
          metalness={0}
          envMapIntensity={0.08}
        />
      </mesh>

      {/* ---------- Suelo pulido ---------- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]}>
        <planeGeometry args={[90 * k, 90 * k]} />
        <MeshReflectorMaterial
          map={textures.floor}
          color="#8d9194"
          resolution={narrow ? 256 : 512}
          blur={[420, 140]}
          mixBlur={1}
          mixStrength={narrow ? 3 : 4}
          mixContrast={1.05}
          mirror={0.18}
          depthScale={0.9}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          roughness={0.78}
          metalness={0.25}
          envMapIntensity={0.1}
        />
      </mesh>

      {/* ---------- Ranuras de luz ---------- */}
      <Slot
        center={room.slot.center}
        rotationY={room.rotationY}
        length={room.slot.length}
        thickness={0.05 * k}
        glowWidth={1.1 * k}
        vertical
        glow={textures.glow}
        strength={0.4}
        core={0.9}
      />
      <Slot
        center={room.top.center}
        rotationY={room.rotationY}
        length={room.top.length}
        thickness={0.035 * k}
        glowWidth={0.7 * k}
        vertical={false}
        glow={textures.glow}
        strength={0.18}
        core={0.45}
      />
      <Slot
        center={room.cove.center}
        rotationY={room.rotationY}
        length={room.wall.width}
        thickness={0.03 * k}
        glowWidth={0.9 * k}
        vertical={false}
        glow={textures.glow}
        strength={0.26}
        core={0.6}
      />

      {/* ---------- Luz que esas ranuras echan sobre la sala ----------
          Las luces de área no decaen con la escala si su tamaño escala con
          ella, así que no hace falta corregir su intensidad en móvil. */}
      <AreaLight
        position={room.light.slot}
        aim={room.light.slotAim}
        width={0.3 * k}
        height={3.4 * k}
        intensity={3.5}
        color={NEON}
      />
      {!narrow && (
        <AreaLight
          position={room.light.cove}
          aim={room.light.coveAim}
          width={18 * k}
          height={0.14 * k}
          intensity={1.5}
          color={NEON}
        />
      )}

      {/* Foco cenital sobre el auto, blanco y frío. Concentra la luz en el auto
          y deja la sala en penumbra; con una direccional el muro quedaba
          iluminado entero y plano. Apunta al origen, por donde pasa el auto en
          todo el recorrido. */}
      <spotLight
        position={[-4 * k, 9 * k, 5 * k]}
        color="#eef6ff"
        intensity={165 * k * k}
        angle={0.55}
        penumbra={0.85}
        decay={2}
        distance={0}
      />

      {/* Charco verde a ras de suelo, fuera de cuadro por la izquierda */}
      <pointLight
        position={[-6 * k, 0.35 * k, 3.5 * k]}
        color={NEON}
        intensity={5 * k * k}
        distance={18 * k}
        decay={2}
      />

      {/* Lavado suave sobre el hormigón. Los focos sí decaen con la distancia:
          su intensidad escala con k² para que en móvil quede igual. */}
      <spotLight
        position={room.light.wash}
        target={targets.wash}
        color={WASH}
        intensity={42 * k * k}
        angle={0.5}
        penumbra={1}
        decay={2}
        distance={0}
      />

      {/* Luz de ventana: el gobo recorta el foco en una banda diagonal sobre
          el hormigón, como en la referencia. Blanca apenas verde. */}
      <spotLight
        position={room.light.window}
        target={targets.window}
        map={textures.gobo}
        color="#dcffea"
        intensity={95 * k * k}
        angle={0.6}
        penumbra={0.3}
        decay={2}
        distance={0}
      />
    </>
  )
}
