import { getAllPosts } from '@/lib/posts'
import { getLocale, getTranslations } from 'next-intl/server'
import Link from 'next/link'

export default async function BlogPage() {
  const posts = getAllPosts()
  const locale = await getLocale()
  const t = await getTranslations('blog')

  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      {/* Header */}
      <p className="mb-2 font-mono text-xs tracking-[0.2em] text-[var(--accent)] uppercase">
        blog
      </p>
      <h1 className="mb-3 text-3xl font-bold md:text-4xl">{t('heading')}</h1>
      <p className="mb-16 text-sm text-[var(--muted-foreground)]">{t('subheading')}</p>

      {/* Post list */}
      <ul className="flex flex-col gap-6">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/${locale}/blog/${post.slug}`}
              className="group block rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 transition-colors hover:border-[var(--accent)]/40"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <time className="font-mono text-[10px] text-[var(--muted-foreground)]">
                  {new Date(post.date).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-GB', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded px-1.5 py-0.5 font-mono text-[10px] text-[var(--muted-foreground)] bg-[var(--border)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h2 className="mb-2 text-lg font-semibold transition-colors group-hover:text-[var(--accent)]">
                {locale === 'es' ? post.titleEs : post.title}
              </h2>
              <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                {locale === 'es' ? post.summaryEs : post.summary}
              </p>

              <span className="mt-4 inline-flex items-center gap-1 font-mono text-xs text-[var(--accent)]">
                {t('read_more')} →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
