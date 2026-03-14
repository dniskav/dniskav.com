'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { TechNode } from './TechNode'
import { TechEdge } from './TechEdge'
import { techNodes, techEdges } from '@/data/techGraph'

// Radial layout using BFS so nodes are always placed after their parent,
// regardless of definition order in the data file.
function buildPositions(nodes: typeof techNodes): Map<string, [number, number, number]> {
  const positions = new Map<string, [number, number, number]>()

  // Use a seeded-ish deterministic offset so layout is stable across re-renders
  const jitter = (seed: number, range: number) => (Math.sin(seed * 127.1) * 0.5 + 0.5) * range - range / 2

  // Root at origin
  positions.set('dniskav', [0, 0, 0])

  // Fibonacci sphere: evenly distributes N points on a unit sphere surface
  const fibSphere = (i: number, total: number, r: number): [number, number, number] => {
    const golden = Math.PI * (3 - Math.sqrt(5))
    const y = 1 - (i / Math.max(total - 1, 1)) * 2
    const rFlat = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = golden * i
    return [Math.cos(theta) * rFlat * r, y * r, Math.sin(theta) * rFlat * r]
  }

  // Place root children on a sphere around the sun
  const rootChildren = nodes.filter((n) => n.parent === 'dniskav')
  rootChildren.forEach((node, i) => {
    positions.set(node.id, fibSphere(i, rootChildren.length, 1.2))
  })

  // BFS: place remaining nodes around their parent in 3D, not just flat XZ
  const queue = nodes.filter((n) => n.parent && n.parent !== 'dniskav')
  let maxPasses = 10
  while (queue.length > 0 && maxPasses-- > 0) {
    const unresolved: typeof queue = []

    for (const node of queue) {
      const parentPos = positions.get(node.parent!)
      if (!parentPos) {
        unresolved.push(node)
        continue
      }

      const siblings = nodes.filter((n) => n.parent === node.parent)
      const idx = siblings.findIndex((n) => n.id === node.id)

      // Spread children in 3D around parent using offset fibonacci sphere
      const [dx, dy, dz] = fibSphere(idx, Math.max(siblings.length, 2), 0.68)
      const jx = jitter(node.id.charCodeAt(0) * 2.1, 0.12)
      const jy = jitter(node.id.charCodeAt(1) * 1.7, 0.12)
      const jz = jitter(node.id.charCodeAt(0) * 3.3, 0.12)

      positions.set(node.id, [
        parentPos[0] + dx + jx,
        parentPos[1] + dy + jy,
        parentPos[2] + dz + jz,
      ])
    }

    queue.length = 0
    queue.push(...unresolved)
  }

  return positions
}

export function TechGraph() {
  const groupRef = useRef<THREE.Group>(null)

  const positions = useMemo(() => buildPositions(techNodes), [])

  // Drag-to-rotate state (manual controls)
  const isDragging = useRef(false)
  const lastPos = useRef<[number, number] | null>(null)
  const velocity = useRef({ x: 0, y: 0 })
  const targetRot = useRef({ x: -0.25, y: 0.6 }) // angled view: slight downward tilt + 35° yaw to show 3D volume

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
