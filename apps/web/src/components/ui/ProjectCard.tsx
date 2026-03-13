'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/Badge'
import type { Project } from '@/data/projects'

interface Props {
  project: Project
}

const categoryIcons: Record<string, string> = {
  game:       '🎮',
  app:        '⚡',
  experiment: '🧪',
  challenge:  '🏆',
  tool:       '🔧',
  bot:        '🤖',
}

export function ProjectCard({ project }: Props) {
  const t = useTranslations('projects')
  // Access nested translation safely with a fallback
  const name = t.rich(`items.${project.id}.name`, {}) as string ?? project.repo
  const desc = t.rich(`items.${project.id}.desc`, {}) as string ?? ''

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] p-5 transition-all duration-200 hover:border-[var(--accent)]/40 hover:shadow-lg hover:shadow-[var(--accent)]/5"
    >
      {/* Top bar */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-xl leading-none">{categoryIcons[project.category] ?? '📦'}</span>
        <div className="flex items-center gap-1.5">
          <Badge variant={project.era === 2 ? 'era2' : 'era1'}>
            {project.era === 2 ? 'Era II' : 'Era I'}
          </Badge>
          <span className="font-mono text-[10px] text-[var(--muted-foreground)]/50">
            {project.year}
          </span>
        </div>
      </div>

      {/* Name */}
      <h3 className="mb-2 text-sm font-semibold leading-snug group-hover:text-[var(--accent)] transition-colors">
        {String(name)}
      </h3>

      {/* Description */}
      <p className="mb-4 flex-1 text-xs leading-relaxed text-[var(--muted-foreground)]">
        {String(desc)}
      </p>

      {/* Tags */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {project.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="rounded px-1.5 py-0.5 font-mono text-[10px] text-[var(--muted-foreground)] bg-[var(--border)]"
          >
            {tag}
          </span>
        ))}
        {project.tags.length > 4 && (
          <span className="rounded px-1.5 py-0.5 font-mono text-[10px] text-[var(--muted-foreground)]/50">
            +{project.tags.length - 4}
          </span>
        )}
      </div>

      {/* Links */}
      <div className="flex items-center gap-3">
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 font-mono text-xs text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
        >
          {t('github')} ↗
        </a>
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-mono text-xs text-[var(--accent)] transition-opacity hover:opacity-80"
          >
            {t('demo')} ↗
          </a>
        )}
      </div>
    </motion.article>
  )
}
