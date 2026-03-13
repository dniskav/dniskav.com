'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const COUNT = 120

export function Particles() {
  const ref = useRef<THREE.Points>(null)

  const { positions, speeds } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3)
    const spd = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10
      spd[i] = 0.02 + Math.random() * 0.04
    }
    return { positions: pos, speeds: spd }
  }, [])

  useFrame(() => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3 + 1] += speeds[i] * 0.015
      if (pos[i * 3 + 1] > 5) pos[i * 3 + 1] = -5
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#3b82f6"
        transparent
        opacity={0.35}
        sizeAttenuation
      />
    </points>
  )
}
