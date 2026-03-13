import { useTranslations } from 'next-intl'

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/dniskav' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/dniskav/' },
  { label: 'Email', href: 'mailto:dniskav@gmail.com' },
]

export function Footer() {
  const t = useTranslations('footer')
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-[var(--border)] px-6 py-10 md:px-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
        <span className="font-mono text-xs text-[var(--muted-foreground)]">
          © {year} Daniel Silva — {t('rights')}
        </span>

        <ul className="flex items-center gap-6">
          {socialLinks.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="text-xs text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
