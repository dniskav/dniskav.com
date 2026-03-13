'use client'

import { useRef, useState, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text, Billboard } from '@react-three/drei'
import * as THREE from 'three'
import { TextureLoader } from 'three'
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

  // Portal so Html mounts inside the canvas container, not document.body
  const { gl } = useThree()
  const portal = useRef(gl.domElement.parentElement as HTMLElement)

  const size = node.size ?? 0.6
  const color = node.color ?? '#a1a1aa'
  const isRoot = node.type === 'root'
  const radius = size * 0.18
  const logoSize = Math.round(radius * 96)
  const hasLogo = Boolean(node.logo)

  // load texture for icon if present
  const texture = useMemo(() => {
    if (!node.logo) return null
    try {
      return new TextureLoader().load(node.logo)
    } catch {
      return null
    }
  }, [node.logo])

  // a soft radial sprite texture for glow (created once)
  const glowTexture = useMemo(() => {
    const size = 128
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!

    const grd = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.2, 'rgba(255,200,120,0.9)')
    grd.addColorStop(0.45, 'rgba(255,120,40,0.4)')
    grd.addColorStop(1, 'rgba(0,0,0,0)')

    ctx.fillStyle = grd
    ctx.fillRect(0, 0, size, size)

    return new THREE.CanvasTexture(canvas)
  }, [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime

    meshRef.current.position.y = Math.sin(t * 0.5 + position[0] * 1.3) * 0.1
    // Only rotate the mesh for spherical nodes. Icon planes should always face the camera
    if (!hasLogo) {
      meshRef.current.rotation.y = t * 0.2
    } else {
      // ensure plane stays unrotated so Billboard can control facing
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
  })

  return (
    <group position={position}>
      {hasLogo ? (
        // Icon plane (faces camera via Billboard)
        <Billboard>
          <mesh
            ref={meshRef}
            onPointerOver={(e) => {
              e.stopPropagation()
              setHovered(true)
            }}
            onPointerOut={() => setHovered(false)}
            onClick={() => console.log(node.label ?? node.id)}
          >
            <planeGeometry args={[radius * 2.2, radius * 2.2]} />
            <meshBasicMaterial
              map={texture ?? null}
              transparent={true}
              opacity={hovered ? 1 : 0.95}
            />
          </mesh>

          {/* Soft additive halo behind icon using a sprite for stronger glow */}
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
            onPointerOver={(e) => {
              e.stopPropagation()
              setHovered(true)
            }}
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

          {/* Outer soft sprite halo for spheres */}
          <sprite ref={glowRef} scale={[radius * (hovered ? 4.0 : 3.0), radius * (hovered ? 4.0 : 3.0), 1]}>
            <spriteMaterial
              map={glowTexture}
              color={color}
              transparent
              opacity={hovered ? 0.45 : 0.18}
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
