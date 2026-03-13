'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { useState } from 'react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { LanguageToggle } from '@/components/ui/LanguageToggle'

const anchorLinks = ['projects', 'about', 'experience', 'contact'] as const
const pageLinks = ['blog', 'playground'] as const
const navLinks = [...anchorLinks, ...pageLinks] as const

export function Navigation() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 20))

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-12">
        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="font-mono text-sm font-semibold tracking-widest text-[var(--accent)] hover:opacity-80 transition-opacity"
        >
          dniskav
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-6 md:flex">
          {navLinks.map((key) => (
            <li key={key}>
              <Link
                href={pageLinks.includes(key as (typeof pageLinks)[number]) ? `/${locale}/${key}` : `/${locale}#${key}`}
                className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
              >
                {t(key)}
              </Link>
            </li>
          ))}
        </ul>

        {/* Controls */}
        <div className="flex items-center gap-1">
          <LanguageToggle />
          <ThemeToggle />

          {/* Mobile hamburger */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMenuOpen((v) => !v)}
            className="ml-2 flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-[var(--border)] md:hidden"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="block h-px w-5 bg-[var(--foreground)] origin-center transition-all"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block h-px w-5 bg-[var(--foreground)]"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="block h-px w-5 bg-[var(--foreground)] origin-center transition-all"
            />
          </motion.button>
        </div>
      </nav>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={menuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        className="overflow-hidden border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-md md:hidden"
      >
        <ul className="flex flex-col px-6 py-4 gap-4">
          {navLinks.map((key) => (
            <li key={key}>
              <Link
                href={pageLinks.includes(key as (typeof pageLinks)[number]) ? `/${locale}/${key}` : `/${locale}#${key}`}
                onClick={() => setMenuOpen(false)}
                className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                {t(key)}
              </Link>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.header>
  )
}
