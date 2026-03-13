'use client'

import { useTranslations, useLocale } from 'next-intl'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Section } from '@/components/ui/Section'
import { AnimateIn } from '@/components/animations/AnimateIn'
import { staggerContainer, staggerItem, fadeInUp } from '@/animations/variants'
import { timeline, categoryColors, categoryLabels, type TimelineEntry } from '@/data/timeline'

export function Skills() {
  const t = useTranslations('skills')
  const locale = useLocale() as 'en' | 'es'

  const era1 = timeline.filter((e) => e.era === 1)
  const era2 = timeline.filter((e) => e.era === 2)

  return (
    <Section id="skills" className="overflow-hidden">
      {/* Header */}
      <AnimateIn>
        <p className="mb-2 font-mono text-xs tracking-[0.2em] text-[var(--accent)] uppercase">
          02 — skills
        </p>
        <h2 className="mb-3 text-3xl font-bold md:text-4xl">{t('heading')}</h2>
        <p className="mb-16 max-w-xl text-sm text-[var(--muted-foreground)]">{t('subheading')}</p>
      </AnimateIn>

      {/* Legend */}
      <AnimateIn delay={0.1} className="mb-12 flex flex-wrap gap-4">
        {(Object.entries(categoryColors) as [keyof typeof categoryColors, string][]).map(
          ([key, color]) => (
            <span key={key} className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
              <span className="h-2 w-2 rounded-full" style={{ background: color }} />
              {categoryLabels[key][locale]}
            </span>
          )
        )}
      </AnimateIn>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[88px] top-0 hidden h-full w-px bg-[var(--border)] md:block" />

        <div className="flex flex-col gap-0">
          {/* Era I entries */}
          {era1.map((entry, i) => (
            <TimelineRow key={entry.period} entry={entry} index={i} locale={locale} />
          ))}

          {/* Era divider */}
          <EraDivider label={t('era2_divider')} />

          {/* Era II entries */}
          {era2.map((entry, i) => (
            <TimelineRow key={entry.period} entry={entry} index={era1.length + i} locale={locale} />
          ))}
        </div>
      </div>
    </Section>
  )
}

function TimelineRow({
  entry,
  index,
  locale,
}: {
  entry: TimelineEntry
  index: number
  locale: 'en' | 'es'
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const isEra2 = entry.era === 2

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -16 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.45, delay: 0.05 * (index % 4), ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative flex gap-6 py-5 md:gap-10"
    >
      {/* Year label */}
      <div className="w-20 shrink-0 pt-0.5 text-right">
        <span
          className={`font-mono text-xs font-semibold ${
            isEra2 ? 'text-[var(--accent)]' : 'text-[var(--muted-foreground)]'
          }`}
        >
          {entry.period.split(' –')[0]}
        </span>
      </div>

      {/* Dot on the line */}
      <div className="relative hidden shrink-0 md:flex items-start justify-center w-0">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ delay: 0.1 + 0.05 * index, type: 'spring', stiffness: 300 }}
          className={`absolute -left-[4.5px] top-[3px] h-2.5 w-2.5 rounded-full border-2 ${
            isEra2
              ? 'border-[var(--accent)] bg-[var(--accent)]'
              : 'border-[var(--border)] bg-[var(--background)]'
          }`}
        />
      </div>

      {/* Content */}
      <div className="flex-1 pb-2">
        <p className="mb-3 font-mono text-[11px] text-[var(--muted-foreground)]/50">
          {entry.period}
        </p>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="flex flex-wrap gap-2"
        >
          {entry.tags.map((tag) => (
            <motion.span
              key={tag.name}
              variants={staggerItem}
              className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs transition-all hover:scale-105"
              style={{
                borderColor: `${categoryColors[tag.category]}30`,
                color: categoryColors[tag.category],
                background: `${categoryColors[tag.category]}08`,
              }}
            >
              <span
                className="h-1 w-1 rounded-full"
                style={{ background: categoryColors[tag.category] }}
              />
              {tag.name}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

function EraDivider({ label }: { label: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <AnimateIn variants={fadeInUp} className="py-4">
      <div ref={ref} className="flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--accent)]/40" />
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4 }}
          className="rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-1 font-mono text-[11px] tracking-widest text-[var(--accent)] uppercase"
        >
          {label}
        </motion.span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--accent)]/40" />
      </div>
    </AnimateIn>
  )
}
