'use client'

import { useTranslations } from 'next-intl'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Section } from '@/components/ui/Section'
import { AnimateIn } from '@/components/animations/AnimateIn'
import { Badge } from '@/components/ui/Badge'
import { experience, type ExperienceEntry } from '@/data/experience'

export function Experience() {
  const t = useTranslations('experience')

  return (
    <Section id="experience" className="overflow-hidden">
      {/* Header */}
      <AnimateIn>
        <p className="mb-2 font-mono text-xs tracking-[0.2em] text-[var(--accent)] uppercase">
          04 — experience
        </p>
        <h2 className="mb-3 text-3xl font-bold md:text-4xl">{t('heading')}</h2>
        <p className="mb-16 max-w-xl text-sm text-[var(--muted-foreground)]">{t('subheading')}</p>
      </AnimateIn>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-0 top-2 hidden h-full w-px bg-gradient-to-b from-[var(--accent)]/40 via-[var(--border)] to-transparent md:block" />

        <div className="flex flex-col gap-0 md:pl-8">
          {experience.map((entry, i) => (
            <ExperienceRow key={entry.id} entry={entry} index={i} t={t} />
          ))}
        </div>
      </div>
    </Section>
  )
}

function ExperienceRow({
  entry,
  index,
  t,
}: {
  entry: ExperienceEntry
  index: number
  t: ReturnType<typeof useTranslations<'experience'>>
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  const role = t(`roles.${entry.roleKey}`)
  const isFirst = index === 0

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.45, delay: 0.04 * (index % 6), ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative pb-10 last:pb-0"
    >
      {/* Dot */}
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ delay: 0.06 * index, type: 'spring', stiffness: 300 }}
        className={`absolute -left-[1.28rem] top-1.5 hidden h-2.5 w-2.5 rounded-full border-2 md:block ${
          isFirst
            ? 'border-[var(--accent)] bg-[var(--accent)]'
            : 'border-[var(--border)] bg-[var(--background)] group-hover:border-[var(--accent)]/60'
        } transition-colors`}
      />

      {/* Card */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-5 transition-colors hover:border-[var(--accent)]/30">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          {/* Left */}
          <div className="flex-1">
            {/* Company + client */}
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold">{entry.company}</h3>
              {entry.client && (
                <>
                  <span className="text-[var(--muted-foreground)]/40">→</span>
                  <span className="text-sm text-[var(--accent)]">{entry.client}</span>
                </>
              )}
            </div>

            {/* Role */}
            <p className="mb-2 text-xs text-[var(--muted-foreground)]">{role}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded px-1.5 py-0.5 font-mono text-[10px] text-[var(--muted-foreground)] bg-[var(--border)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right — period + location */}
          <div className="flex flex-col items-start gap-1 sm:items-end sm:text-right">
            <span className="font-mono text-xs text-[var(--muted-foreground)]">{entry.period}</span>
            <span className="flex items-center gap-1 text-[10px] text-[var(--muted-foreground)]/50">
              📍 {entry.location}
            </span>
            <Badge variant={isFirst ? 'accent' : 'default'} className="mt-1">
              {isFirst ? '✓ Most recent' : entry.startYear.toString()}
            </Badge>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
