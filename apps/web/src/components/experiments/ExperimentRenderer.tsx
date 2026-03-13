'use client'

import dynamic from 'next/dynamic'

const experimentMap: Record<string, ReturnType<typeof dynamic>> = {
  'noise-field': dynamic(() => import('./NoiseField').then((m) => ({ default: m.NoiseField })), {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <span className="font-mono text-xs text-[var(--muted-foreground)] animate-pulse">
          loading...
        </span>
      </div>
    ),
  }),
}

interface Props {
  slug: string
}

export function ExperimentRenderer({ slug }: Props) {
  const Component = experimentMap[slug]
  if (!Component) return null
  return <Component />
}
