'use client'

import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props {
  start: [number, number, number]
  end: [number, number, number]
  color?: string
}

export function TechEdge({ start, end, color = '#6366f1' }: Props) {
  const { mesh, material } = useMemo(() => {
    const a = new THREE.Vector3(...start)
    const b = new THREE.Vector3(...end)

    // simple straight curve between points
    const curve = new THREE.LineCurve3(a, b)
    // tube geometry gives a thin ribbon-like volume we can emissively style
    const geometry = new THREE.TubeGeometry(curve as any, 8, 0.02, 6, false)

    const mat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const m = new THREE.Mesh(geometry, mat)
    return { mesh: m, material: mat }
  }, [start, end, color])

  // Gentle breathing pulse — stays visible at all times
  useFrame((state) => {
    material.opacity = 0.55 + Math.sin(state.clock.elapsedTime * 0.9) * 0.12
  })

  return <primitive object={mesh} />
}
