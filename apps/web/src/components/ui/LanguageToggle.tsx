'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

export function LanguageToggle() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function switchLocale() {
    const next = locale === 'en' ? 'es' : 'en'
    // Replace the locale prefix in the current path
    const newPath = pathname.replace(`/${locale}`, `/${next}`)
    router.push(newPath)
  }

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={switchLocale}
      className="flex h-9 items-center gap-1 rounded-lg px-2 text-xs font-medium text-[var(--muted-foreground)] transition-colors hover:bg-[var(--border)] hover:text-[var(--foreground)]"
      aria-label="Switch language"
    >
      <span className={locale === 'en' ? 'text-[var(--foreground)]' : ''}>EN</span>
      <span className="opacity-30">/</span>
      <span className={locale === 'es' ? 'text-[var(--foreground)]' : ''}>ES</span>
    </motion.button>
  )
}
