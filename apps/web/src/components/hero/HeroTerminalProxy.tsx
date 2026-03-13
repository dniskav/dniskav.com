'use client'

import dynamic from 'next/dynamic'

const HeroTerminal = dynamic(
  () =>
    import('/Users/daniel/Desktop/projects/hero-terminal/dist/hero-terminal.js').then(
      (m) => m.HeroTerminal
    ),
  { ssr: false }
)

export { HeroTerminal }
