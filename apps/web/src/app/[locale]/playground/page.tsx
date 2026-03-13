import { experiments } from '@/data/experiments'
import { getLocale, getTranslations } from 'next-intl/server'
import Link from 'next/link'

export default async function PlaygroundPage() {
  const locale = await getLocale()
  const t = await getTranslations('playground')

  return (
    <main className="mx-auto max-w-5xl px-6 py-24">
      {/* Header */}
      <p className="mb-2 font-mono text-xs tracking-[0.2em] text-[var(--accent)] uppercase">
        playground
      </p>
      <h1 className="mb-3 text-3xl font-bold md:text-4xl">{t('heading')}</h1>
      <p className="mb-16 text-sm text-[var(--muted-foreground)]">{t('subheading')}</p>

      {/* Grid */}
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {experiments.map((exp) => (
          <li key={exp.slug}>
            <Link
              href={`/${locale}/playground/${exp.slug}`}
              className="group relative flex h-48 flex-col justify-between overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 transition-all hover:border-[var(--accent)]/40 hover:shadow-lg hover:shadow-[var(--accent)]/5"
            >
              {/* Glow on hover */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: 'radial-gradient(circle at 30% 50%, rgba(59,130,246,0.06) 0%, transparent 70%)' }}
              />

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {exp.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded px-1.5 py-0.5 font-mono text-[10px] text-[var(--muted-foreground)] bg-[var(--border)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title + description */}
              <div>
                <h2 className="mb-1 text-lg font-semibold transition-colors group-hover:text-[var(--accent)]">
                  {locale === 'es' ? exp.titleEs : exp.title}
                </h2>
                <p className="text-xs leading-relaxed text-[var(--muted-foreground)] line-clamp-2">
                  {locale === 'es' ? exp.descriptionEs : exp.description}
                </p>
              </div>

              {/* Arrow */}
              <span className="absolute right-5 top-5 text-[var(--muted-foreground)] transition-all group-hover:text-[var(--accent)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                ↗
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
