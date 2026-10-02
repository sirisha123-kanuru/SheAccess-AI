import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

function Rig() {
  const core = useRef(), shell = useRef(), pts = useRef(), a = useRef(), b = useRef()
  const pos = useMemo(() => {
    const n = 1800, arr = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const r = 2.4 + Math.random() * 1.2, t = Math.random() * 6.283, p = Math.acos(2 * Math.random() - 1)
      arr.set([r * Math.sin(p) * Math.cos(t), r * Math.sin(p) * Math.sin(t), r * Math.cos(p)], i * 3)
    }
    return arr
  }, [])
  useFrame(({ mouse, camera, clock }) => {
    const t = clock.elapsedTime
    shell.current.rotation.set(t * .15, t * .25, 0)
    core.current.scale.setScalar(1 + Math.sin(t * 2) * .05)
    pts.current.rotation.y = -t * .06; pts.current.rotation.x = mouse.y * .3
    a.current.position.set(Math.cos(t * .6) * 2.6, Math.sin(t * .9) * .8, Math.sin(t * .6) * 1.2); a.current.rotation.x = t
    b.current.position.set(-Math.cos(t * .5) * 2.2, Math.cos(t * .7) * 1, -Math.sin(t * .5) * 1.5); b.current.rotation.y = t
    camera.position.x += (mouse.x * 1.4 - camera.position.x) * .05
    camera.position.y += (mouse.y * .9 - camera.position.y) * .05
    camera.lookAt(0, 0, 0)
  })
  return (<>
    <ambientLight intensity={.4} /><pointLight position={[5, 5, 5]} intensity={40} color="#ec4899" /><pointLight position={[-5, -3, 3]} intensity={30} color="#8b5cf6" />
    <mesh ref={core}><sphereGeometry args={[1, 48, 48]} /><meshStandardMaterial color="#7c3aed" emissive="#ec4899" emissiveIntensity={.55} roughness={.3} metalness={.6} /></mesh>
    <mesh ref={shell}><icosahedronGeometry args={[1.7, 1]} /><meshBasicMaterial color="#f472b6" wireframe transparent opacity={.45} /></mesh>
    <mesh ref={a}><torusGeometry args={[.35, .12, 16, 40]} /><meshStandardMaterial color="#f9a8d4" emissive="#ec4899" emissiveIntensity={.5} /></mesh>
    <mesh ref={b}><octahedronGeometry args={[.4]} /><meshStandardMaterial color="#c4b5fd" emissive="#8b5cf6" emissiveIntensity={.6} /></mesh>
    <points ref={pts}><bufferGeometry><bufferAttribute attach="attributes-position" count={pos.length / 3} array={pos} itemSize={3} /></bufferGeometry>
      <pointsMaterial size={.035} color="#f9a8d4" transparent opacity={.85} sizeAttenuation /></points>
  </>)
}
export default function Scene() {
  return <Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 1.6]}><Rig /></Canvas>
}
