import { Suspense, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import type { ReactNode, RefObject } from 'react'
import CarModel from './CarModel'
import Showroom from './Showroom'
import { choreographyAt } from '../../three/choreography'
import { computeStage, worldOffset, FOV } from '../../three/framing'
import type { CarFit, Stage } from '../../three/framing'

/* Verde del logo, el mismo de --neon. */
const NEON = '#12e06b'

/** Fracción de la distancia al scroll que queda tras un segundo. */
const SMOOTHING = 0.0015

// Definidos una sola vez: objetos nuevos en cada render harían que R3F los
// volviera a aplicar y deshiciera el encuadre.
const CAMERA = { fov: FOV, near: 0.1, far: 400, position: [5, 2, 6] as [number, number, number] }
/* La sala llena el cuadro entero: el lienzo puede ser opaco. */
const GL = { antialias: true, alpha: false, powerPreference: 'high-performance' as const }
const DPR: [number, number] = [1, 2]

type Props = {
  progress: RefObject<number>
}

/**
 * Mueve el auto según la posición del scroll. El valor se sigue con un
 * amortiguado ligero para que los saltos de la rueda no se vean escalonados;
 * es un seguimiento puro, así que el auto siempre acaba exactamente en la
 * posición del scroll y nunca se anima por su cuenta.
 */
function Choreography({ progress, fit, children }: {
  progress: RefObject<number>
  fit: CarFit | null
  children: ReactNode
}) {
  const group = useRef<THREE.Group>(null)
  const eased = useRef(0)
  const camera = useThree((state) => state.camera)
  const invalidate = useThree((state) => state.invalidate)
  const width = useThree((state) => state.size.width)
  const height = useThree((state) => state.size.height)
  const offset = useMemo(() => new THREE.Vector3(), [])

  const stage = useMemo<Stage | null>(() => {
    if (!fit || width === 0 || height === 0) return null
    return computeStage(fit, width, height)
  }, [fit, width, height])

  // La cámara se coloca fuera del render. El escenario se arma cuando el
  // modelo ya está medido, que puede ser después del último evento de scroll:
  // por eso se pide aquí el frame que lo muestra.
  useLayoutEffect(() => {
    if (!stage) return
    camera.position.copy(stage.target).addScaledVector(stage.basis.forward, stage.distance)
    camera.near = Math.max(0.05, stage.distance / 100)
    camera.far = stage.distance * 40
    camera.lookAt(stage.target)
    camera.updateProjectionMatrix()
    invalidate()
  }, [stage, camera, invalidate])

  useFrame((_, delta) => {
    if (!stage || !group.current) return

    const target = progress.current
    const settle = 1 - Math.pow(SMOOTHING, Math.min(delta, 0.1))
    let value = eased.current + (target - eased.current) * settle

    if (Math.abs(target - value) < 0.0002) {
      value = target
    } else {
      invalidate() // seguir pidiendo frames hasta que el auto alcance el scroll
    }

    eased.current = value

    const state = choreographyAt(value, stage.composition)
    group.current.position.copy(worldOffset(state, stage, offset))
    group.current.rotation.y = state.rotationY
    group.current.scale.setScalar(state.scale)
  })

  return (
    <>
      <group ref={group} visible={stage !== null}>
        {children}
      </group>
      {stage && <Showroom stage={stage} narrow={stage.composition < 0.5} />}
    </>
  )
}

export default function CarStage({ progress }: Props) {
  const [fit, setFit] = useState<CarFit | null>(null)
  const handleFit = useCallback((next: CarFit) => setFit(next), [])

  return (
    <Canvas
      frameloop="demand"
      dpr={DPR}
      gl={GL}
      camera={CAMERA}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 1)
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.0
        gl.outputColorSpace = THREE.SRGBColorSpace
      }}
    >
      {/* Luces que no dependen de la escala de la sala. El foco principal, el
          charco verde del suelo y las luces de las ranuras viven en Showroom,
          porque su posición e intensidad cambian con la distancia de cámara. */}
      <ambientLight intensity={0.12} />
      <directionalLight position={[7, 3.5, 3]} intensity={0.2} />
      <directionalLight position={[-8, 1.5, 3]} intensity={0.18} color={NEON} />
      <directionalLight position={[-3, 2.5, -7]} intensity={0.4} color={NEON} />

      {/* Reflejos de estudio generados en la escena (sin descargar ningún HDRI):
          el verde que se ve en paragolpes y aletas sale de aquí. */}
      <Environment resolution={256} frames={1} environmentIntensity={0.8}>
        <color attach="background" args={['#040506']} />
        <Lightformer intensity={2.1} position={[0, 6, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[9, 5, 1]} />
        {/* Panel grande y suave delante del auto: la pintura es metálica, y lo
            que la aclara es lo que refleja, no la luz directa. */}
        <Lightformer intensity={0.9} color="#e8f2ff" position={[5, 2.5, 6]} rotation={[0, Math.PI * 0.2, 0]} scale={[11, 4, 1]} />
        <Lightformer intensity={0.6} color="#d6e8ff" position={[6, 2, -2]} rotation={[0, -Math.PI / 2, 0]} scale={[6, 3, 1]} />
        <Lightformer intensity={2} color={NEON} position={[-6, 0.7, 2.5]} rotation={[0, Math.PI / 2, 0]} scale={[12, 0.5, 1]} />
        <Lightformer intensity={2} color={NEON} position={[-1.5, 3, -7]} scale={[0.35, 7, 1]} />
      </Environment>

      <Suspense fallback={null}>
        <Choreography progress={progress} fit={fit}>
          <CarModel onFit={handleFit} />
        </Choreography>
      </Suspense>
    </Canvas>
  )
}
