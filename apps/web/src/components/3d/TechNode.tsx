'use client'

import { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text, Billboard } from '@react-three/drei'
import * as THREE from 'three'
import type { TechNode as TechNodeData } from '@/data/techGraph'

interface Props {
  node: TechNodeData
  position: [number, number, number]
}

export function TechNode({ node, position }: Props) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const scaleRef = useRef(1)
  const [hovered, setHovered] = useState(false)
  const [texture, setTexture] = useState<THREE.Texture | null>(null)

  const { gl } = useThree()
  // kept in case we need portal later
  void gl

  const size = node.size ?? 0.6
  const color = node.color ?? '#a1a1aa'
  const isRoot = node.type === 'root'
  const radius = size * 0.18
  const hasLogo = Boolean(node.logo)

  // Rasterize SVG (or any image) via canvas before creating the texture.
  // Direct TextureLoader fails silently for SVGs in WebGL — canvas intermediate fixes it.
  useEffect(() => {
    if (!node.logo) return
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 256
      canvas.height = 256
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, 256, 256)
      const tex = new THREE.CanvasTexture(canvas)
      tex.colorSpace = THREE.SRGBColorSpace
      setTexture(tex)
    }
    img.src = node.logo
  }, [node.logo])

  // a soft radial sprite texture for glow (created once)
  const glowTexture = useMemo(() => {
    const sz = 128
    const canvas = document.createElement('canvas')
    canvas.width = sz
    canvas.height = sz
    const ctx = canvas.getContext('2d')!

    const grd = ctx.createRadialGradient(sz / 2, sz / 2, 0, sz / 2, sz / 2, sz / 2)
    grd.addColorStop(0, 'rgba(255,248,200,1)')
    grd.addColorStop(0.2, 'rgba(220,170,40,0.9)')
    grd.addColorStop(0.45, 'rgba(160,120,10,0.4)')
    grd.addColorStop(1, 'rgba(0,0,0,0)')

    ctx.fillStyle = grd
    ctx.fillRect(0, 0, sz, sz)

    return new THREE.CanvasTexture(canvas)
  }, [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime

    meshRef.current.position.y = Math.sin(t * 0.5 + position[0] * 1.3) * 0.1
    if (!hasLogo) {
      meshRef.current.rotation.y = t * 0.2
    } else {
      meshRef.current.rotation.x = 0
      meshRef.current.rotation.y = 0
      meshRef.current.rotation.z = 0
    }

    const target = hovered ? 1.25 : 1
    scaleRef.current += (target - scaleRef.current) * 0.1
    meshRef.current.scale.setScalar(scaleRef.current)

    if (glowRef.current) {
      glowRef.current.position.y = meshRef.current.position.y
      glowRef.current.scale.setScalar(scaleRef.current * (hovered ? 1.45 : 1.25))
    }

    // Root node pulses emissive + corona in sync with edge breathing (same 0.9 freq)
    if (isRoot) {
      const pulse = Math.sin(t * 0.9)
      if (!hasLogo) {
        const mat = meshRef.current.material as THREE.MeshStandardMaterial
        mat.emissiveIntensity = 1.1 + pulse * 0.6
      }
      if (glowRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(glowRef.current as any).material.opacity = 0.28 + pulse * 0.18
      }
    }
  })

  return (
    <group position={position}>
      {hasLogo ? (
        <Billboard>
          {/* Only render the icon mesh once the texture is fully loaded — no flicker */}
          {texture && (
            <mesh
              ref={meshRef}
              onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
              onPointerOut={() => setHovered(false)}
              onClick={() => console.log(node.label ?? node.id)}
            >
              <planeGeometry args={[radius * 2.2, radius * 2.2]} />
              <meshBasicMaterial
                map={texture}
                transparent
                opacity={hovered ? 1 : 0.95}
                depthWrite={false}
              />
            </mesh>
          )}

          {/* Soft additive halo behind icon */}
          <sprite ref={glowRef} scale={[radius * (hovered ? 3.4 : 2.8), radius * (hovered ? 3.4 : 2.8), 1]}>
            <spriteMaterial
              map={glowTexture}
              color={color}
              transparent
              opacity={hovered ? 0.45 : 0.22}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </sprite>
        </Billboard>
      ) : (
        <>
          {/* Sphere */}
          <mesh
            ref={meshRef}
            onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
            onPointerOut={() => setHovered(false)}
            onClick={() => console.log(node.label ?? node.id)}
          >
            <sphereGeometry args={[radius, 28, 28]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={hovered ? 1.8 : isRoot ? 0.9 : 0.45}
              roughness={0.15}
              metalness={0.05}
              transparent
              opacity={hovered ? 1 : 0.88}
            />
          </mesh>

          {/* "DS" initials on root sphere, always facing camera */}
          {isRoot && (
            <Billboard>
              <Text
                position={[0, 0, radius + 0.02]}
                fontSize={radius * 0.82}
                color="#fff8e0"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.003}
                outlineColor="#c9a227"
                outlineOpacity={0.6}
              >
                DS
              </Text>
            </Billboard>
          )}

          {/* Outer soft sprite halo / corona (bigger for root) */}
          <sprite ref={glowRef} scale={[radius * (isRoot ? 6.0 : hovered ? 4.0 : 3.0), radius * (isRoot ? 6.0 : hovered ? 4.0 : 3.0), 1]}>
            <spriteMaterial
              map={glowTexture}
              color={color}
              transparent
              opacity={isRoot ? 0.28 : hovered ? 0.45 : 0.18}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </sprite>
        </>
      )}

      {/* Label */}
      <Billboard>
        <Text
          position={[0, radius + 0.22, 0]}
          fontSize={isRoot ? 0.14 : 0.1}
          color={hovered ? '#ffffff' : '#d1d5db'}
          anchorX="center"
          anchorY="bottom"
          fillOpacity={hovered ? 1 : 0.75}
          outlineWidth={0.008}
          outlineColor="#000000"
          outlineOpacity={0.4}
        >
          {node.label ?? node.id}
        </Text>
      </Billboard>
    </group>
  )
}
