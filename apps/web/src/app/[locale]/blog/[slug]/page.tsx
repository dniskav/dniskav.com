import { getPostBySlug, getAllPosts } from '@/lib/posts'
import { getLocale } from 'next-intl/server'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import rehypePrettyCode from 'rehype-pretty-code'
import type { Options as PrettyCodeOptions } from 'rehype-pretty-code'

interface Props {
  params: Promise<{ slug: string; locale: string }>
}

const prettyCodeOptions: PrettyCodeOptions = {
  theme: 'github-dark',
  keepBackground: true,
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  const locales = ['en', 'es']
  return locales.flatMap((locale) => posts.map((p) => ({ locale, slug: p.slug })))
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const locale = await getLocale()
  const post = getPostBySlug(slug)

  if (!post) notFound()

  const title = locale === 'es' ? post.titleEs : post.title
  const summary = locale === 'es' ? post.summaryEs : post.summary

  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      {/* Back */}
      <Link
        href={`/${locale}/blog`}
        className="mb-12 inline-flex items-center gap-1 font-mono text-xs text-[var(--muted-foreground)] transition-colors hover:text-[var(--accent)]"
      >
        ← blog
      </Link>

      {/* Meta */}
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

      <h1 className="mb-4 text-3xl font-bold leading-tight md:text-4xl">{title}</h1>
      <p className="mb-12 text-base leading-relaxed text-[var(--muted-foreground)]">{summary}</p>

      <div className="h-px w-16 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent mb-12" />

      {/* MDX Content */}
      <article className="prose-blog">
        <MDXRemote
          source={post.content}
          options={{
            mdxOptions: {
              rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
            },
          }}
        />
      </article>
    </main>
  )
}
