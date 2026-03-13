'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { TechNode } from './TechNode'
import { TechEdge } from './TechEdge'
import { techNodes, techEdges } from '@/data/techGraph'

// Simple radial layout: root at center, children spread around parent
function buildPositions(nodes: typeof techNodes): Map<string, [number, number, number]> {
  const positions = new Map<string, [number, number, number]>()

  // Root
  positions.set('dniskav', [0, 0, 0])

  // First level: direct children of root spread on a circle
  const rootChildren = nodes.filter((n) => n.parent === 'dniskav')
  rootChildren.forEach((node, i) => {
    const angle = (i / rootChildren.length) * Math.PI * 2
    const r = 2.6
    positions.set(node.id, [Math.cos(angle) * r, (Math.random() - 0.5) * 1.2, Math.sin(angle) * r])
  })

  // Second level and beyond: spread around parent
  const remaining = nodes.filter((n) => n.parent && n.parent !== 'dniskav')
  remaining.forEach((node) => {
    const parentPos = positions.get(node.parent!)
    if (!parentPos) return

    const siblings = remaining.filter((n) => n.parent === node.parent)
    const idx = siblings.findIndex((n) => n.id === node.id)
    const angle = (idx / Math.max(siblings.length, 1)) * Math.PI * 2 + Math.random() * 0.4
    const r = 1.6 + Math.random() * 0.4

    positions.set(node.id, [
      parentPos[0] + Math.cos(angle) * r,
      parentPos[1] + (Math.random() - 0.5) * 1.0,
      parentPos[2] + Math.sin(angle) * r,
    ])
  })

  return positions
}

export function TechGraph() {
  const groupRef = useRef<THREE.Group>(null)

  const positions = useMemo(() => buildPositions(techNodes), [])

  // Drag-to-rotate state (manual controls)
  const isDragging = useRef(false)
  const lastPos = useRef<[number, number] | null>(null)
  const velocity = useRef({ x: 0, y: 0 })
  const targetRot = useRef({ x: -0.15, y: 0 }) // initial tilt and yaw

  // Clamp tilt so user can't flip the scene
  const minTilt = -Math.PI / 3
  const maxTilt = Math.PI / 3

  // Attach pointer handlers globally so drag starts when user begins dragging
  // anywhere on the hero (except over interactive controls). Also prevent
  // native text selection while dragging.
  const attached = useRef(false)
  useMemo(() => {
    if (attached.current) return
    attached.current = true

    function isInteractiveTarget(target: EventTarget | null) {
      if (!(target instanceof HTMLElement)) return false
      const tag = target.tagName
      if (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        tag === 'BUTTON' ||
        tag === 'A'
      )
        return true
      if (target.closest && target.closest('[data-no-drag]')) return true
      return false
    }

    function onPointerDown(e: PointerEvent) {
      if (isInteractiveTarget(e.target)) return
      // prevent text selection on drag start
      try {
        document.body.style.userSelect = 'none'
      } catch {}
      isDragging.current = true
      lastPos.current = [e.clientX, e.clientY]
    }

    function onPointerMove(e: PointerEvent) {
      if (!isDragging.current || !lastPos.current) return
      const [lx, ly] = lastPos.current
      const dx = e.clientX - lx
      const dy = e.clientY - ly
      lastPos.current = [e.clientX, e.clientY]

      // Sensitivity tuning
      const yawFactor = 0.005
      const pitchFactor = 0.004

      targetRot.current.y += -dx * yawFactor // drag right -> rotate right
      targetRot.current.x += -dy * pitchFactor // drag down -> tilt down (look from above)

      // clamp pitch
      targetRot.current.x = Math.max(minTilt, Math.min(maxTilt, targetRot.current.x))

      // velocity for inertial release
      velocity.current.x = -dx * yawFactor
      velocity.current.y = -dy * pitchFactor
    }

    function onPointerUp() {
      isDragging.current = false
      lastPos.current = null
      try {
        document.body.style.userSelect = ''
      } catch {}
    }

    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [])

  // Smoothly interpolate group rotation towards targetRot; add slight passive rotation when idle
  useFrame((state, delta) => {
    if (!groupRef.current) return

    // when not dragging, slowly decay velocity and apply inertial movement
    if (!isDragging.current) {
      // passive slow orbit
      targetRot.current.y += 0.02 * delta

      // apply small inertia from last drag
      targetRot.current.y += velocity.current.x * 0.95
      targetRot.current.x += velocity.current.y * 0.95

      // decay velocity
      velocity.current.x *= 0.92
      velocity.current.y *= 0.92
    }

    // lerp current rotation
    const curX = groupRef.current.rotation.x
    const curY = groupRef.current.rotation.y

    const nx = THREE.MathUtils.lerp(curX, targetRot.current.x, 0.08)
    const ny = THREE.MathUtils.lerp(curY, targetRot.current.y, 0.08)

    groupRef.current.rotation.x = nx
    groupRef.current.rotation.y = ny
  })

  return (
    <group ref={groupRef}>
      {/* Edges */}
      {techEdges.map((edge) => {
        const s = positions.get(edge.source)
        const t = positions.get(edge.target)
        if (!s || !t) return null
        return <TechEdge key={`${edge.source}-${edge.target}`} start={s} end={t} />
      })}

      {/* Nodes */}
      {techNodes.map((node) => {
        const pos = positions.get(node.id)
        if (!pos) return null
        return <TechNode key={node.id} node={node} position={pos} />
      })}
    </group>
  )
}
