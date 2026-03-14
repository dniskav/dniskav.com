'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props {
  start: [number, number, number]
  end: [number, number, number]
  color?: string
}

const PULSE_COLOR = '#f0d8a8'

export function TechEdge({ start, end, color = '#6366f1' }: Props) {
  const pulseRef = useRef<THREE.Mesh>(null)
  const haloRef = useRef<THREE.Sprite>(null)

  const { tubeMesh, curve, phase, glowTexture } = useMemo(() => {
    const a = new THREE.Vector3(...start)
    const b = new THREE.Vector3(...end)

    // Unique phase per edge (0–1) so pulses travel at different times
    const phaseOffset = Math.abs(Math.sin(start[0] * 3.7 + start[1] * 1.3 + end[0] * 2.1 + end[2]))

    // Curved path: midpoint pulled toward origin
    const length = a.distanceTo(b)
    const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5)
    const pullStrength = Math.min(length * 0.22, 0.8)
    mid.add(new THREE.Vector3(0, 0, 0).sub(mid).normalize().multiplyScalar(pullStrength))

    const c = new THREE.QuadraticBezierCurve3(a, mid, b)

    // Static dim tube as the connection wire
    const geometry = new THREE.TubeGeometry(c, 20, 0.015, 6, false)
    const mat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const tube = new THREE.Mesh(geometry, mat)

    // Radial soft gradient for the halo sprite
    const sz = 64
    const canvas = document.createElement('canvas')
    canvas.width = sz
    canvas.height = sz
    const ctx = canvas.getContext('2d')!
    const grd = ctx.createRadialGradient(sz / 2, sz / 2, 0, sz / 2, sz / 2, sz / 2)
    grd.addColorStop(0, 'rgba(240, 220, 180, 1)')
    grd.addColorStop(0.4, 'rgba(220, 190, 140, 0.35)')
    grd.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, sz, sz)
    const tex = new THREE.CanvasTexture(canvas)

    return { tubeMesh: tube, curve: c, phase: phaseOffset, glowTexture: tex }
  }, [start, end, color])

  useFrame((state) => {
    if (!pulseRef.current || !haloRef.current) return

    // Raw linear progress (0→1) — más rápido (0.55 ciclos/s ≈ 1.8s por arista)
    const rawT = (state.clock.elapsedTime * 0.55 + phase) % 1.0

    // Ease-out quíntico: arranca muy rápido, frena drásticamente al llegar al nodo
    const easedT = 1 - Math.pow(1 - rawT, 5)

    const pos = curve.getPoint(easedT)
    pulseRef.current.position.copy(pos)
    haloRef.current.position.copy(pos)

    // Fade: quick ramp-in, hold, then dissolve in last 30%
    const fade =
      rawT < 0.08
        ? rawT / 0.08
        : rawT > 0.7
          ? 1 - (rawT - 0.7) / 0.3
          : 1

    ;(pulseRef.current.material as THREE.MeshBasicMaterial).opacity = fade * 0.85
    ;(haloRef.current.material as THREE.SpriteMaterial).opacity = fade * 0.3
  })

  return (
    <>
      <primitive object={tubeMesh} />

      {/* Traveling pulse dot — barely bigger than the tube */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.014, 5, 5]} />
        <meshBasicMaterial
          color={PULSE_COLOR}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Soft halo around the pulse */}
      <sprite ref={haloRef} scale={[0.055, 0.055, 1]}>
        <spriteMaterial
          map={glowTexture}
          color={PULSE_COLOR}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    </>
  )
}
