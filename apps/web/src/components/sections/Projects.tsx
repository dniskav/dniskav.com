'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { Section } from '@/components/ui/Section'
import { AnimateIn } from '@/components/animations/AnimateIn'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { Button } from '@/components/ui/Button'
import { allProjects, era2Projects, gamesProjects } from '@/data/projects'

type Filter = 'all' | 'era2' | 'era1' | 'games'

const FILTERS: Filter[] = ['all', 'era2', 'era1', 'games']

function getFiltered(filter: Filter) {
  switch (filter) {
    case 'era2':  return era2Projects
    case 'games': return gamesProjects
    case 'era1':  return allProjects.filter((p) => p.era === 1 && p.category !== 'game' && p.category !== 'experiment')
    default:      return allProjects
  }
}

export function Projects() {
  const t = useTranslations('projects')
  const [active, setActive] = useState<Filter>('all')

  const filtered = getFiltered(active)

  const filterLabels: Record<Filter, string> = {
    all:    t('filter_all'),
    era2:   t('filter_era2'),
    era1:   t('filter_era1'),
    games:  t('filter_games'),
  }

  return (
    <Section id="projects">
      {/* Header */}
      <AnimateIn>
        <p className="mb-2 font-mono text-xs tracking-[0.2em] text-[var(--accent)] uppercase">
          03 — projects
        </p>
        <h2 className="mb-3 text-3xl font-bold md:text-4xl">{t('heading')}</h2>
        <p className="mb-10 max-w-xl text-sm text-[var(--muted-foreground)]">{t('subheading')}</p>
      </AnimateIn>

      {/* Filter tabs */}
      <AnimateIn delay={0.1} className="mb-10 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <motion.button
            key={f}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActive(f)}
            className={`rounded-lg px-4 py-2 text-xs font-medium transition-all ${
              active === f
                ? 'bg-[var(--accent)] text-white'
                : 'border border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--accent)]/40 hover:text-[var(--foreground)]'
            }`}
          >
            {filterLabels[f]}
            <span className="ml-2 font-mono opacity-60">
              {getFiltered(f).length}
            </span>
          </motion.button>
        ))}
      </AnimateIn>

      {/* Grid */}
      <motion.div
        layout
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* GitHub CTA */}
      <AnimateIn delay={0.2} className="mt-12 flex justify-center">
        <Button
          href="https://github.com/dniskav"
          variant="outline"
          size="md"
          external
        >
          {t('view_all_github')} ↗
        </Button>
      </AnimateIn>
    </Section>
  )
}
