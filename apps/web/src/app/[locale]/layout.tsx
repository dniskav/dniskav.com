import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Providers } from '@/components/layout/Providers'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { AiChat } from '@/components/ui/AiChat'
import { ParticlesBackground } from '@/components/3d/ParticlesBackground'
import '../globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const BASE_URL = 'https://dniskav.com'

const metaByLocale: Record<string, { title: string; description: string; ogLocale: string }> = {
  en: {
    title: 'Daniel Silva — Senior Fullstack Engineer',
    description:
      '14+ years building performant web apps at scale. React, Angular, TypeScript, Node.js, custom frameworks, and AI-powered tools. Based in Tarragona, Spain.',
    ogLocale: 'en_US',
  },
  es: {
    title: 'Daniel Silva — Senior Fullstack Engineer',
    description:
      'Más de 14 años construyendo aplicaciones web de alto rendimiento. React, Angular, TypeScript, Node.js, frameworks propios y herramientas potenciadas con IA. Tarragona, España.',
    ogLocale: 'es_ES',
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const meta = metaByLocale[locale] ?? metaByLocale.en

  return {
    title: {
      default: meta.title,
      template: `%s — Daniel Silva`,
    },
    description: meta.description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: `/${locale}`,
      languages: { en: '/en', es: '/es' },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${BASE_URL}/${locale}`,
      siteName: 'dniskav.com',
      locale: meta.ogLocale,
      type: 'website',
      images: [
        {
          url: `/api/og?locale=${locale}`,
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [`/api/og?locale=${locale}`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
  }
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'en' | 'es')) {
    notFound()
  }

  const messages = await getMessages()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Daniel Silva',
    url: BASE_URL,
    jobTitle: 'Senior Fullstack Engineer',
    description:
      locale === 'es'
        ? 'Senior Fullstack Engineer con más de 14 años de experiencia entre Colombia y España.'
        : 'Senior Fullstack Engineer with 14+ years of experience across Colombia and Spain.',
    address: { '@type': 'PostalAddress', addressLocality: 'Tarragona', addressCountry: 'ES' },
    sameAs: [
      'https://github.com/dniskav',
      'https://www.linkedin.com/in/dniskav/',
      'mailto:dniskav@gmail.com',
    ],
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <Providers>
          <NextIntlClientProvider messages={messages}>
            <ParticlesBackground />
            <CustomCursor />
            <Navigation />
            <main>{children}</main>
            <Footer />
            <AiChat />
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  )
}
