'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { AnimateIn } from '@/components/animations/AnimateIn'
import { staggerContainer, staggerItem, slideInLeft, fadeInUp } from '@/animations/variants'

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/dniskav', icon: '⌥' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/dniskav/', icon: '◈' },
]

export function About() {
  const t = useTranslations('about')

  return (
    <Section id="about">
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-24 lg:items-center">
        {/* Left — photo placeholder */}
        <AnimateIn variants={slideInLeft}>
          <div className="relative mx-auto w-72 lg:w-full max-w-sm">
            {/* Photo frame */}
            <div className="relative overflow-hidden rounded-2xl border border-border">
              <Image
                src="/profile.png"
                alt="Daniel Silva"
                width={1696}
                height={2528}
                className="w-full h-auto block"
                priority
              />
              {/* Accent corner */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--accent)] to-purple-500" />
            </div>

            {/* Location badge */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-4 -right-4 flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 shadow-lg"
            >
              <span className="text-base">📍</span>
              <span className="font-mono text-xs text-[var(--muted-foreground)]">{t('location')}</span>
            </motion.div>
          </div>
        </AnimateIn>

        {/* Right — text content */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="flex flex-col gap-6"
        >
          {/* Heading */}
          <motion.div variants={staggerItem}>
            <p className="mb-2 font-mono text-xs tracking-[0.2em] text-[var(--accent)] uppercase">
              01 — about
            </p>
            <h2 className="text-3xl font-bold md:text-4xl">{t('heading')}</h2>
          </motion.div>

          {/* Bio */}
          <motion.p
            variants={staggerItem}
            className="text-base leading-relaxed text-[var(--muted-foreground)]"
          >
            {t('bio')}
          </motion.p>

          {/* Available badge */}
          <motion.div variants={staggerItem}>
            <span className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs text-green-400">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              {t('available')}
            </span>
          </motion.div>

          {/* Era cards */}
          <motion.div variants={staggerItem} className="grid gap-3 sm:grid-cols-2">
            <EraCard
              label={t('era1_label')}
              years={t('era1_years')}
              desc={t('era1_desc')}
              accent="#a1a1aa"
              index={1}
            />
            <EraCard
              label={t('era2_label')}
              years={t('era2_years')}
              desc={t('era2_desc')}
              accent="#3b82f6"
              index={2}
            />
          </motion.div>

          {/* Links */}
          <motion.div variants={staggerItem} className="flex flex-wrap items-center gap-3">
            <Button href="mailto:dniskav@gmail.com" variant="outline" size="sm" external>
              {t('download_cv')}
            </Button>
            {socialLinks.map(({ label, href }) => (
              <Button key={label} href={href} variant="ghost" size="sm" external>
                {label} ↗
              </Button>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </Section>
  )
}

function EraCard({
  label,
  years,
  desc,
  accent,
  index,
}: {
  label: string
  years: string
  desc: string
  accent: string
  index: number
}) {
  return (
    <AnimateIn variants={fadeInUp} delay={index * 0.1}>
      <div
        className="group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 transition-colors hover:border-[var(--accent)]/40"
        style={{ '--era-accent': accent } as React.CSSProperties}
      >
        {/* Top accent line */}
        <div
          className="absolute left-0 top-0 h-px w-full opacity-60"
          style={{ background: accent }}
        />
        <p className="mb-1 font-mono text-[10px] tracking-widest opacity-50 uppercase">{years}</p>
        <p className="mb-2 text-sm font-semibold leading-snug">{label}</p>
        <p className="text-xs leading-relaxed text-[var(--muted-foreground)]">{desc}</p>
      </div>
    </AnimateIn>
  )
}
