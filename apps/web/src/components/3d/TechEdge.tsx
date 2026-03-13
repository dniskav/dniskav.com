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
  const { obj, material } = useMemo(() => {
    const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)]
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.55 })
    return { obj: new THREE.Line(geometry, mat), material: mat }
  }, [start, end, color])

  // Gentle breathing pulse — stays visible at all times
  useFrame((state) => {
    material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 0.6) * 0.12
  })

  return <primitive object={obj} />
}
