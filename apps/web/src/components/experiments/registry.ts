import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'

// Each experiment is lazy-loaded — no WebGL on the listing page
export const experimentComponents: Record<string, ComponentType> = {
  'noise-field': dynamic(() => import('./NoiseField').then((m) => ({ default: m.NoiseField })), {
    ssr: false,
    loading: () => null,
  }),
  'tech-constellation': dynamic(() => import('./TechConstellation').then((m) => ({ default: m.TechConstellation })), {
    ssr: false,
    loading: () => null,
  }),
}
