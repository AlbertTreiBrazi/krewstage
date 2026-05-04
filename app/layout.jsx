import { Syne, Inter } from 'next/font/google'
import '../styles/globals.css'
import Providers from '../components/Providers'

// Force all pages to be dynamic (SSR) — they depend on Supabase auth state
// which is unavailable at build time. Without this, Next attempts to
// statically prerender client pages and fails during the export step.
export const dynamic = 'force-dynamic'

const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  title: 'KrewStage — Find collaborators. Finish songs. Start bands.',
  description: 'KrewStage connects musicians, producers, composers, lyricists and engineers. Post projects, find collaborators, finish songs together.',
  keywords: 'music collaboration, find musicians, music producers, songwriting, band members, vocalists, beats',
  openGraph: {
    title: 'KrewStage — Find collaborators. Finish songs.',
    description: 'The platform where musicians meet, collaborate and create music together. Free to join.',
    url: 'https://krewstage.com',
    siteName: 'KrewStage',
    images: [{ url: 'https://krewstage.com/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KrewStage — Find collaborators. Finish songs.',
    description: 'The platform where musicians meet, collaborate and create music together.',
    images: ['https://krewstage.com/og-image.png'],
  },
  metadataBase: new URL('https://krewstage.com'),
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${syne.variable} ${inter.variable}`}>
      <body style={{ fontFamily: 'var(--font-inter, Inter), system-ui, -apple-system, sans-serif' }}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
