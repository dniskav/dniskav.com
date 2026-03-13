'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Section } from '@/components/ui/Section'
import { AnimateIn } from '@/components/animations/AnimateIn'
import { staggerContainer, staggerItem } from '@/animations/variants'

const contactLinks = [
  {
    key: 'email',
    href: 'mailto:dniskav@gmail.com',
    label: 'dniskav@gmail.com',
    icon: '✉',
    color: '#3b82f6',
  },
  {
    key: 'linkedin',
    href: 'https://www.linkedin.com/in/dniskav/',
    label: 'linkedin.com/in/dniskav',
    icon: '◈',
    color: '#0077b5',
  },
  {
    key: 'github',
    href: 'https://github.com/dniskav',
    label: 'github.com/dniskav',
    icon: '⌥',
    color: '#a1a1aa',
  },
] as const

export function Contact() {
  const t = useTranslations('contact')

  return (
    <Section id="contact" className="relative overflow-hidden">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }}
      />

      <div className="mx-auto max-w-2xl text-center">
        {/* Label */}
        <AnimateIn>
          <p className="mb-4 font-mono text-xs tracking-[0.2em] text-[var(--accent)] uppercase">
            05 — contact
          </p>
        </AnimateIn>

        {/* Heading */}
        <AnimateIn delay={0.05}>
          <h2 className="mb-6 text-3xl font-bold leading-tight md:text-5xl">
            {t('heading')}
          </h2>
        </AnimateIn>

        {/* Separator */}
        <AnimateIn delay={0.1}>
          <div className="mx-auto mb-12 h-px w-16 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent" />
        </AnimateIn>

        {/* Links */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="flex flex-col items-center gap-3"
        >
          {contactLinks.map(({ key, href, label, icon, color }) => (
            <motion.a
              key={key}
              variants={staggerItem}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              whileHover={{ x: 4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group flex w-full max-w-sm items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--background)] px-5 py-4 transition-all hover:border-[var(--accent)]/40 hover:shadow-lg hover:shadow-[var(--accent)]/5"
            >
              {/* Icon */}
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base transition-transform group-hover:scale-110"
                style={{ background: `${color}15`, color }}
              >
                {icon}
              </span>

              {/* Text */}
              <div className="flex-1 text-left">
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                  {t(key as 'email' | 'linkedin' | 'github')}
                </p>
                <p className="text-sm text-[var(--foreground)]">{label}</p>
              </div>

              {/* Arrow */}
              <motion.span
                className="text-[var(--muted-foreground)] transition-colors group-hover:text-[var(--accent)]"
                animate={{ x: 0 }}
                whileHover={{ x: 3 }}
              >
                ↗
              </motion.span>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </Section>
  )
}
