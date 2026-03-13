'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

const PARTICLE_COUNT = 8_000
const SPREAD = 20

function Particles() {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const colors = new Float32Array(PARTICLE_COUNT * 3)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = (Math.random() - 0.5) * SPREAD
      const y = (Math.random() - 0.5) * SPREAD
      const z = (Math.random() - 0.5) * SPREAD

      positions[i * 3 + 0] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      // Blue-to-cyan gradient based on y position
      const t = (y / SPREAD + 0.5)
      colors[i * 3 + 0] = 0.1 + t * 0.2        // R
      colors[i * 3 + 1] = 0.4 + t * 0.4         // G
      colors[i * 3 + 2] = 0.8 + t * 0.2         // B
    }

    return { positions, colors }
  }, [])

  const originPositions = useMemo(() => positions.slice(), [positions])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    const t = clock.getElapsedTime()
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ox = originPositions[i * 3 + 0]
      const oy = originPositions[i * 3 + 1]
      const oz = originPositions[i * 3 + 2]

      pos[i * 3 + 0] = ox + Math.sin(t * 0.3 + oy * 0.5) * 0.8
      pos[i * 3 + 1] = oy + Math.cos(t * 0.2 + ox * 0.4) * 0.8
      pos[i * 3 + 2] = oz + Math.sin(t * 0.25 + oz * 0.3) * 0.5
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
    pointsRef.current.rotation.y = t * 0.04
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
      />
    </points>
  )
}

export function NoiseField() {
  return (
    <Canvas
      camera={{ position: [0, 0, 18], fov: 55 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.5} />
      <Particles />
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={8}
        maxDistance={30}
        autoRotate
        autoRotateSpeed={0.4}
      />
    </Canvas>
  )
}
