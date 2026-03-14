'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { TechGraph } from './TechGraph'
import { Particles } from './Particles'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 1, 9], fov: 52 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'default' }}
      dpr={1.5}
      style={{ position: 'absolute', inset: 0 }}
      onCreated={({ gl }) => {
        // Prevent the browser from permanently disabling the context on loss
        // (common in dev with React StrictMode double-mount)
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault()
        })
      }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 6, 4]} intensity={1.2} color="#c9a227" />
      <pointLight position={[-4, -4, -4]} intensity={0.4} color="#a07820" />

      <Particles />
      <TechGraph />

      {/* Postprocessing bloom for soft additive glow */}
      <EffectComposer multisampling={0}>
        <Bloom
          luminanceThreshold={0.08}
          luminanceSmoothing={0.7}
          intensity={1.2}
          kernelSize={2}
          height={300}
        />
      </EffectComposer>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.5}
        minPolarAngle={Math.PI * 0.25}
        maxPolarAngle={Math.PI * 0.75}
        makeDefault
      />
    </Canvas>
  )
}
