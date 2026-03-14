'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

// ── Constants ─────────────────────────────────────────────────────────────────
const COUNT       = 160
const BURST_COUNT = 12

const TECH_LOGOS = [
  { id: 'React',       logo: '/tech/react.svg',      color: '#61dafb' },
  { id: 'TypeScript',  logo: '/tech/typescript.svg', color: '#3178c6' },
  { id: 'JavaScript',  logo: '/tech/javascript.svg', color: '#f59e0b' },
  { id: 'Next.js',     logo: '/tech/nextjs.svg',     color: '#ffffff' },
  { id: 'Angular',     logo: '/tech/angular.svg',    color: '#dd1b16' },
  { id: 'Python',      logo: '/tech/python.svg',     color: '#fbbf24' },
  { id: 'Node.js',     logo: '/tech/nodejs.svg',     color: '#6db33f' },
  { id: 'Three.js',    logo: '/tech/threejs.svg',    color: '#ff6b6b' },
  { id: 'Tailwind',    logo: '/tech/tailwind.svg',   color: '#38bdf8' },
  { id: 'FastAPI',     logo: '/tech/fastapi.svg',    color: '#009688' },
  { id: 'Backbone.js', logo: '/tech/backbonejs.svg', color: '#8fa3b1' },
  { id: 'Webpack',     logo: '/tech/webpack.svg',    color: '#8dd6f9' },
  { id: 'Git',         logo: '/tech/git.svg',        color: '#f05032' },
  { id: 'HTML',        logo: '/tech/html.svg',       color: '#e34f26' },
  { id: 'CSS',         logo: '/tech/css.svg',        color: '#38bdf8' },
]

// ── Shaders ───────────────────────────────────────────────────────────────────
const vertexShader = `
  attribute float aSize;
  attribute float aAlpha;
  varying float vAlpha;
  void main() {
    vAlpha = aAlpha;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (300.0 / -mv.z);
    gl_Position  = projectionMatrix * mv;
  }
`
const fragmentShader = `
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float soft = 1.0 - smoothstep(0.2, 0.5, d);
    gl_FragColor = vec4(0.976, 0.451, 0.086, vAlpha * soft);
  }
`

// ── Phase state machine ───────────────────────────────────────────────────────
type Phase = 'waiting' | 'bursting' | 'logo-in' | 'logo-hold' | 'logo-out'

// ── Burst + Logo ──────────────────────────────────────────────────────────────
function BurstAndLogo() {
  const { gl } = useThree()
  const portalRef = useRef<HTMLElement | null>(null)
  useEffect(() => { portalRef.current = gl.domElement.parentElement }, [gl])

  const phase    = useRef<Phase>('waiting')
  const phaseAge = useRef(0)
  const waitTime = useRef(0.5 + Math.random() * 1)

  const cx = useRef(0); const cy = useRef(0); const cz = useRef(0)
  const vx = useRef(new Float32Array(BURST_COUNT))
  const vy = useRef(new Float32Array(BURST_COUNT))
  const vz = useRef(new Float32Array(BURST_COUNT))
  const burstDuration = useRef(1.4)

  // useState triggers re-render so <Html> mounts/unmounts
  const [logo, setLogo] = useState<{ visible: boolean; index: number; x: number; y: number; z: number }>(
    { visible: false, index: 0, x: 0, y: 0, z: 0 }
  )

  const positions = useMemo(() => new Float32Array(BURST_COUNT * 3), [])
  const sizes     = useMemo(() => new Float32Array(BURST_COUNT), [])
  const alphas    = useMemo(() => new Float32Array(BURST_COUNT), [])
  const geoRef    = useRef<THREE.BufferGeometry>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  function spawnBurst() {
    cz.current = (Math.random() - 0.5) * 6
    const dist = 8 - cz.current
    const halfAngle = 26 * Math.PI / 180
    const maxY = Math.tan(halfAngle) * dist * 0.9
    const maxX = maxY * (16 / 9)
    cx.current = Math.max(-maxX, Math.min(maxX, (Math.random() - 0.5) * 18))
    cy.current = Math.max(-maxY, Math.min(maxY, (Math.random() - 0.5) * 10))
    burstDuration.current = 1.2 + Math.random() * 0.6
    for (let i = 0; i < BURST_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.random() * Math.PI
      const speed = 0.4 + Math.random() * 0.6
      vx.current[i] = Math.sin(phi) * Math.cos(theta) * speed
      vy.current[i] = Math.sin(phi) * Math.sin(theta) * speed
      vz.current[i] = Math.cos(phi) * speed
    }
  }

  useFrame((_, delta) => {
    phaseAge.current += delta

    switch (phase.current) {
      case 'waiting':
        waitTime.current -= delta
        for (let i = 0; i < BURST_COUNT; i++) alphas[i] = 0
        if (waitTime.current <= 0) {
          spawnBurst()
          phase.current    = 'bursting'
          phaseAge.current = 0
        }
        break

      case 'bursting': {
        const t    = Math.min(1, phaseAge.current / burstDuration.current)
        const fade = t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8
        for (let i = 0; i < BURST_COUNT; i++) {
          positions[i * 3]     = cx.current + vx.current[i] * t * 2
          positions[i * 3 + 1] = cy.current + vy.current[i] * t * 2
          positions[i * 3 + 2] = cz.current + vz.current[i] * t * 2
          sizes[i]  = 0.06 + (1 - t) * 0.1
          alphas[i] = Math.max(0, fade)
        }
        if (t >= 1) {
          setLogo({ visible: true, index: Math.floor(Math.random() * TECH_LOGOS.length), x: cx.current, y: cy.current, z: cz.current })
          phase.current    = 'logo-in'
          phaseAge.current = 0
        }
        break
      }

      case 'logo-in':
        if (overlayRef.current) overlayRef.current.style.opacity = String(Math.min(1, phaseAge.current / 0.5))
        for (let i = 0; i < BURST_COUNT; i++) alphas[i] = 0
        if (phaseAge.current >= 0.5) { phase.current = 'logo-hold'; phaseAge.current = 0 }
        break

      case 'logo-hold':
        if (overlayRef.current) overlayRef.current.style.opacity = '1'
        if (phaseAge.current >= 2.5) { phase.current = 'logo-out'; phaseAge.current = 0 }
        break

      case 'logo-out':
        if (overlayRef.current) overlayRef.current.style.opacity = String(Math.max(0, 1 - phaseAge.current / 0.6))
        if (phaseAge.current >= 0.6) {
          setLogo(s => ({ ...s, visible: false }))
          phase.current    = 'waiting'
          phaseAge.current = 0
          waitTime.current = 0.5 + Math.random() * 1
        }
        break
    }

    if (geoRef.current) {
      geoRef.current.attributes.position.needsUpdate = true
      geoRef.current.attributes.aSize.needsUpdate    = true
      geoRef.current.attributes.aAlpha.needsUpdate   = true
    }
  })

  const tech = TECH_LOGOS[logo.index]

  return (
    <>
      <points>
        <bufferGeometry ref={geoRef}>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aSize"    args={[sizes,     1]} />
          <bufferAttribute attach="attributes-aAlpha"   args={[alphas,    1]} />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {logo.visible && portalRef.current && (
        <Html
          position={[logo.x, logo.y, logo.z]}
          center
          portal={portalRef as React.RefObject<HTMLElement>}
          style={{ pointerEvents: 'none' }}
        >
          <div
            ref={overlayRef}
            style={{ opacity: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
          >
            <img
              src={tech.logo}
              alt={tech.id}
              width={32}
              height={32}
              style={{ filter: `drop-shadow(0 0 6px ${tech.color}88)` }}
            />
            <span style={{
              fontFamily: 'monospace',
              fontSize: '9px',
              color: tech.color,
              letterSpacing: '0.1em',
              textShadow: `0 0 8px ${tech.color}`,
              whiteSpace: 'nowrap',
            }}>
              {tech.id}
            </span>
          </div>
        </Html>
      )}
    </>
  )
}

// ── Background drift particles ────────────────────────────────────────────────
function ParticlesMesh() {
  const ref            = useRef<THREE.Points>(null)
  const mouse          = useRef({ x: 0, y: 0 })
  const smoothed       = useRef({ x: 0, y: 0 })
  const scroll         = useRef(0)
  const scrollSmoothed = useRef(0)

  useEffect(() => {
    const onMove   = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    const onScroll = () => { scroll.current = window.scrollY }
    window.addEventListener('mousemove', onMove,  { passive: true })
    window.addEventListener('scroll',   onScroll, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll',   onScroll)
    }
  }, [])

  const { positions, speeds } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3)
    const spd = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 22
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10
      spd[i] = 0.02 + Math.random() * 0.04
    }
    return { positions: pos, speeds: spd }
  }, [])

  useFrame(() => {
    if (!ref.current) return
    smoothed.current.x += (mouse.current.x * 0.5 - smoothed.current.x) * 0.04
    smoothed.current.y += (mouse.current.y * 0.35 - smoothed.current.y) * 0.04
    scrollSmoothed.current += (scroll.current * 0.0008 - scrollSmoothed.current) * 0.05
    ref.current.position.x = smoothed.current.x
    ref.current.position.y = smoothed.current.y + scrollSmoothed.current
    const pos = ref.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3 + 1] += speeds[i] * 0.015
      if (pos[i * 3 + 1] > 7) pos[i * 3 + 1] = -7
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#f97316" transparent opacity={0.7} sizeAttenuation />
    </points>
  )
}

// ── AI Brands ────────────────────────────────────────────────────────────────
const AI_BRANDS = [
  { id: 'ChatGPT',  logo: 'openai.svg',    color: '#10a37f', glow: '#10a37f' },
  { id: 'Claude',   logo: 'anthropic.svg', color: '#cc785c', glow: '#cc785c' },
  { id: 'Gemini',   logo: 'gemini.svg',    color: '#4285f4', glow: '#a8c7fa' },
  { id: 'Grok',     logo: 'xai.svg',       color: '#e0e0e0', glow: '#ffffff' },
  { id: 'Deepseek', logo: 'deepseek.svg',  color: '#5b7cf7', glow: '#8ba4ff' },
]

// Comet uses same vertex/fragment shaders — color baked in, per-comet via uniform override
const TRAIL = 28

function AiComets() {
  const { gl } = useThree()
  const portalRef = useRef<HTMLElement | null>(null)

  // Mount Html immediately at startup — overlayRef will be ready before first comet
  const [ready, setReady] = useState(false)
  useEffect(() => {
    portalRef.current = gl.domElement.parentElement
    setReady(true)
  }, [gl])

  const active    = useRef(false)
  const age       = useRef(0)
  const maxAge    = useRef(2.5)
  const headX     = useRef(-14)
  const headY     = useRef(0)
  const headZ     = useRef(0)
  const velX      = useRef(0)
  const velY      = useRef(0)
  const nextSpawn = useRef(5 + Math.random() * 8)

  // Circular history buffer for trail
  const history  = useRef(Array.from({ length: TRAIL }, (): [number, number, number] => [-99, 0, 0]))
  const histHead = useRef(0)

  // Label phase machine
  const labelPhase = useRef<'none' | 'in' | 'hold' | 'out'>('none')
  const labelAge   = useRef(0)
  const labelShown = useRef(false)

  // Label position/brand — updated when label triggers (re-render moves Html to new spot)
  const [labelPos, setLabelPos] = useState<{ brandIdx: number; x: number; y: number; z: number }>(
    { brandIdx: 0, x: 0, y: 0, z: 0 }
  )
  // overlayRef is set as soon as Html mounts (at ready=true), long before first comet
  const overlayRef = useRef<HTMLDivElement>(null)

  const positions = useMemo(() => new Float32Array(TRAIL * 3), [])
  const sizes     = useMemo(() => new Float32Array(TRAIL), [])
  const alphas    = useMemo(() => new Float32Array(TRAIL), [])
  const geoRef    = useRef<THREE.BufferGeometry>(null)
  const matRef    = useRef<THREE.ShaderMaterial>(null)

  const cometVert = `
    attribute float aSize;
    attribute float aAlpha;
    varying float vAlpha;
    void main() {
      vAlpha = aAlpha;
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = aSize * (300.0 / -mv.z);
      gl_Position  = projectionMatrix * mv;
    }
  `
  const cometFrag = `
    uniform vec3 uColor;
    varying float vAlpha;
    void main() {
      float d = length(gl_PointCoord - vec2(0.5));
      if (d > 0.5) discard;
      float soft = 1.0 - smoothstep(0.1, 0.5, d);
      gl_FragColor = vec4(uColor, vAlpha * soft);
    }
  `

  const brandIdxRef = useRef(0)

  function spawnComet() {
    const fromLeft = Math.random() > 0.5
    const startX   = fromLeft ? -14 : 14
    const startY   = (Math.random() - 0.5) * 9
    const endY     = (Math.random() - 0.5) * 9
    const dur      = 2.2 + Math.random() * 1.4

    headX.current  = startX
    headY.current  = startY
    headZ.current  = (Math.random() - 0.5) * 3
    velX.current   = (fromLeft ? 28 : -28) / dur
    velY.current   = (endY - startY) / dur
    maxAge.current = dur
    age.current    = 0
    active.current = true
    labelShown.current  = false
    brandIdxRef.current = Math.floor(Math.random() * AI_BRANDS.length)

    for (let i = 0; i < TRAIL; i++) {
      history.current[i] = [startX, startY, headZ.current]
    }
    histHead.current = 0

    if (matRef.current) {
      matRef.current.uniforms.uColor.value = new THREE.Color(AI_BRANDS[brandIdxRef.current].color)
    }
  }

  useFrame((_, delta) => {
    // ── Comet movement ────────────────────────────────────────────────────────
    if (!active.current) {
      nextSpawn.current -= delta
      if (nextSpawn.current <= 0) spawnComet()
      for (let i = 0; i < TRAIL; i++) alphas[i] = 0
    } else {
      age.current += delta
      const t = age.current / maxAge.current

      if (t >= 1) {
        active.current    = false
        nextSpawn.current = 5 + Math.random() * 8
        for (let i = 0; i < TRAIL; i++) alphas[i] = 0
      } else {
        headX.current += velX.current * delta
        headY.current += velY.current * delta

        histHead.current = (histHead.current + 1) % TRAIL
        history.current[histHead.current] = [headX.current, headY.current, headZ.current]

        for (let i = 0; i < TRAIL; i++) {
          const idx = (histHead.current - i + TRAIL) % TRAIL
          const [px, py, pz] = history.current[idx]
          positions[i * 3]     = px
          positions[i * 3 + 1] = py
          positions[i * 3 + 2] = pz
          const trailT = i / TRAIL
          alphas[i] = Math.max(0, (1 - trailT * trailT) * 0.9)
          sizes[i]  = Math.max(0.01, (1 - trailT) * 0.14)
        }

        // At 40% of journey: comet is near center (X≈±2.8), well within viewport
        if (t >= 0.4 && !labelShown.current) {
          labelShown.current = true
          labelPhase.current = 'in'
          labelAge.current   = 0
          // overlayRef.current is already set (Html mounted at startup)
          if (overlayRef.current) overlayRef.current.style.opacity = '0'
          // Update Html 3D position to current comet head
          setLabelPos({ brandIdx: brandIdxRef.current, x: headX.current, y: headY.current, z: headZ.current })
        }
      }
    }

    // ── Label phase machine ───────────────────────────────────────────────────
    if (labelPhase.current !== 'none') {
      labelAge.current += delta
      switch (labelPhase.current) {
        case 'in':
          if (overlayRef.current) overlayRef.current.style.opacity = String(Math.min(1, labelAge.current / 0.4))
          if (labelAge.current >= 0.4) { labelPhase.current = 'hold'; labelAge.current = 0 }
          break
        case 'hold':
          if (overlayRef.current) overlayRef.current.style.opacity = '1'
          if (labelAge.current >= 2.0) { labelPhase.current = 'out'; labelAge.current = 0 }
          break
        case 'out':
          if (overlayRef.current) overlayRef.current.style.opacity = String(Math.max(0, 1 - labelAge.current / 0.5))
          if (labelAge.current >= 0.5) {
            labelPhase.current = 'none'
            if (overlayRef.current) overlayRef.current.style.opacity = '0'
          }
          break
      }
    }

    if (geoRef.current) {
      geoRef.current.attributes.position.needsUpdate = true
      geoRef.current.attributes.aSize.needsUpdate    = true
      geoRef.current.attributes.aAlpha.needsUpdate   = true
    }
  })

  const brand = AI_BRANDS[labelPos.brandIdx]

  return (
    <>
      <points>
        <bufferGeometry ref={geoRef}>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aSize"    args={[sizes,     1]} />
          <bufferAttribute attach="attributes-aAlpha"   args={[alphas,    1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={matRef}
          vertexShader={cometVert}
          fragmentShader={cometFrag}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={{ uColor: { value: new THREE.Color(AI_BRANDS[0].color) } }}
        />
      </points>

      {/* Html always mounted at startup so overlayRef.current is ready immediately.
          Position updates via setLabelPos when comet passes 20% mark. */}
      {ready && portalRef.current && (
        <Html
          position={[labelPos.x, labelPos.y, labelPos.z]}
          center
          portal={portalRef as React.RefObject<HTMLElement>}
          style={{ pointerEvents: 'none' }}
        >
          <div
            ref={overlayRef}
            style={{
              opacity: 0,
              display: 'flex',
              alignItems: 'center',
              padding: '6px',
              borderRadius: '50%',
              border: `1px solid ${brand.color}88`,
              background: `${brand.color}18`,
              backdropFilter: 'blur(6px)',
              whiteSpace: 'nowrap',
              boxShadow: `0 0 12px ${brand.glow}44`,
            }}
          >
            <img
              src={`/ai/${brand.logo}`}
              alt={brand.id}
              width={16}
              height={16}
              style={{
                filter: `drop-shadow(0 0 4px ${brand.glow}) brightness(10)`,
                flexShrink: 0,
              }}
            />
          </div>
        </Html>
      )}
    </>
  )
}

// ── Export ────────────────────────────────────────────────────────────────────
export function ParticlesBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 52 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'default' }}
        dpr={1}
        style={{ position: 'absolute', inset: 0 }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', (e) => e.preventDefault())
        }}
      >
        <ParticlesMesh />
        <BurstAndLogo />
        <AiComets />
      </Canvas>
    </div>
  )
}
