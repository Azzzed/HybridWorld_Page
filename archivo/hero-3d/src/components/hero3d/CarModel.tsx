import { useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { CarFit } from '../../three/framing'

const MODEL_PATH = '/models/camry.glb'

/** Dimensión más larga del auto, en unidades de mundo, tras normalizar. */
const TARGET_SIZE = 4

/** Tope de vértices que muestrea el encuadre de cámara. */
const MAX_FRAMING_POINTS = 50000

/**
 * Faros y pilotos encendidos, como en una toma nocturna. Las guías de luz del
 * modelo ya son emisivas (a 0,6); aquí solo se suben y se tiñen.
 */
const HEADLIGHT = { color: '#e4f3ff', intensity: 6 }
const TAILLIGHT = { color: '#ff2b2b', intensity: 3.5 }

/**
 * Faro y piloto comparten un único material, así que cada malla recibe su
 * propia copia: tocar el original teñiría los dos igual.
 */
function lightsOn(mesh: THREE.Mesh) {
  const material = mesh.material as THREE.MeshStandardMaterial
  if (mesh.userData.lit || !material || material.name !== 'Decal_Light') return

  const glow = mesh.name.includes('HEADLIGHT')
    ? HEADLIGHT
    : mesh.name.includes('TAILLIGHT')
      ? TAILLIGHT
      : null
  if (!glow) return

  const lit = material.clone()
  lit.emissive = new THREE.Color(glow.color)
  lit.emissiveIntensity = glow.intensity
  mesh.material = lit
  mesh.userData.lit = true
}

type Props = {
  onFit: (fit: CarFit) => void
}

/**
 * Carga el GLB y lo apoya en el suelo.
 *
 * El modelo se usa tal cual viene: geometría, normales, UVs y texturas no se
 * tocan, y el archivo tampoco. El centrado y el escalado ocurren en el <group>
 * padre, así que conserva sus proporciones. En las mallas solo se fijan las
 * banderas de sombra y se encienden las guías de luz de faros y pilotos.
 *
 * `onFit` devuelve las medidas a la escena, que las usa para encuadrar la
 * cámara sola.
 */
export default function CarModel({ onFit }: Props) {
  const { scene } = useGLTF(MODEL_PATH)

  const fit = useMemo<CarFit>(() => {
    scene.updateWorldMatrix(true, true)

    // Todo se mide en el espacio del propio modelo, así que volver a
    // ejecutarlo cuando ya cuelga del <group> da el mismo resultado.
    const toModelSpace = new THREE.Matrix4().copy(scene.matrixWorld).invert()
    const meshMatrix = new THREE.Matrix4()
    const vertex = new THREE.Vector3()
    const box = new THREE.Box3()
    const sampled: number[] = []

    // Un solo paso para todo el auto: el modelo viene partido en cientos de
    // mallas, y un tope por malla muestrearía muchísimos más vértices.
    let total = 0
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        total += (child as THREE.Mesh).geometry.attributes.position.count
      }
    })
    const stride = Math.max(1, Math.ceil(total / MAX_FRAMING_POINTS))
    let seen = 0

    scene.traverse((child) => {
      const mesh = child as THREE.Mesh
      if (!mesh.isMesh) return

      mesh.castShadow = true
      mesh.receiveShadow = true
      lightsOn(mesh)

      meshMatrix.multiplyMatrices(toModelSpace, mesh.matrixWorld)
      const position = mesh.geometry.attributes.position

      for (let i = 0; i < position.count; i += 1, seen += 1) {
        vertex.fromBufferAttribute(position, i).applyMatrix4(meshMatrix)
        box.expandByPoint(vertex)
        if (seen % stride === 0) sampled.push(vertex.x, vertex.y, vertex.z)
      }
    })

    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const longest = Math.max(size.x, size.y, size.z) || 1
    const scale = TARGET_SIZE / longest

    // Centrado en X/Z y con su punto más bajo apoyado en y = 0.
    const offset = new THREE.Vector3(-center.x * scale, -box.min.y * scale, -center.z * scale)

    // La misma transformación aplicada a los vértices muestreados: la cámara
    // los usa para encuadrar la silueta real y no la caja envolvente.
    const points = new Float32Array(sampled)
    for (let i = 0; i < points.length; i += 3) {
      points[i] = points[i] * scale + offset.x
      points[i + 1] = points[i + 1] * scale + offset.y
      points[i + 2] = points[i + 2] * scale + offset.z
    }

    return {
      scale,
      position: offset.toArray() as [number, number, number],
      size: size.multiplyScalar(scale),
      points,
    }
  }, [scene])

  useEffect(() => {
    onFit(fit)
  }, [fit, onFit])

  return (
    <group position={fit.position} scale={fit.scale}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload(MODEL_PATH)
