'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { HeroTerminal } from '@dniskav/hero-terminal'
import { terminalConfig } from '@/data/terminalConfig'
import { fadeInUp, staggerContainer } from '@/animations/variants'

// Lazy load the 3D scene — never block LCP
const HeroScene = dynamic(() => import('@/components/3d/HeroScene').then((m) => m.HeroScene), {
  ssr: false,
  loading: () => <HeroFallback />,
})

function HeroFallback() {
  return (
    <div className="pointer-events-none absolute inset-0 bg-background" />
  )
}

export function Hero() {
  const t = useTranslations('hero')
  const locale = useLocale()

  return (
    <section className="relative flex min-h-screen w-full items-center overflow-hidden bg-background">
      {/* 3D background — lazy loaded */}
      <div className="absolute inset-0 -z-0">
        <HeroScene />
      </div>

      {/* Gradient overlay — always dark so 3D remains visible (non-interactive) */}
      <div className="pointer-events-none absolute inset-0 -z-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />

      {/* Text content — left column */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-32 pb-24 md:max-w-[52%] md:px-12"
      >
        {/* Eyebrow */}
        <motion.p
          variants={fadeInUp}
          className="mb-4 font-mono text-xs tracking-[0.25em] text-[var(--accent)] uppercase"
        >
          dniskav.com
        </motion.p>

        {/* Name */}
        <motion.h1
          variants={fadeInUp}
          className="mb-3 text-5xl font-bold tracking-tight md:text-7xl"
        >
          {t('name')}
        </motion.h1>

        {/* Title */}
        <motion.p
          variants={fadeInUp}
          className="mb-2 text-xl font-medium text-[var(--muted-foreground)] md:text-2xl"
        >
          {t('title')}
        </motion.p>

        {/* Subtitle */}
        <motion.p variants={fadeInUp} className="mb-10 text-sm text-[var(--muted-foreground)]/70">
          {t('subtitle')}
        </motion.p>

        {/* CTAs */}
        <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
          <Button href={`/${locale}#projects`} size="lg">
            {t('cta_projects')}
          </Button>
          <Button href={`/${locale}#contact`} variant="outline" size="lg">
            {t('cta_contact')}
          </Button>
        </motion.div>

        {/* Terminal (from package) */}
        <HeroTerminal config={terminalConfig} />
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1"
      >
        <span className="font-mono text-[10px] tracking-widest text-[var(--muted-foreground)]/40 uppercase">
          scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          className="h-4 w-px bg-[var(--muted-foreground)]/20"
        />
      </motion.div>
    </section>
  )
}
