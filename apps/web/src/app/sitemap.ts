import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/posts'

const BASE_URL = 'https://dniskav.com'
const LOCALES = ['en', 'es']

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()

  const staticRoutes = ['', '/blog', '/playground'].flatMap((path) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: path === '' ? 1 : 0.8,
    })),
  )

  const postRoutes = posts.flatMap((post) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  )

  return [...staticRoutes, ...postRoutes]
}
