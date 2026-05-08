import PublicLayout from '../../components/PublicLayout'

export const metadata = {
  title: 'Blog — Music Tips & Guides | KrewStage',
  description: 'Tips, guides and insights for musicians, producers and venues. Learn how to collaborate, find gigs and grow your music career.',
  openGraph: {
    title: 'KrewStage Blog',
    description: 'Music collaboration tips, production guides and industry insights.',
    url: 'https://krewstage.com/blog',
    images: [{ url: 'https://krewstage.com/og-image.png', width: 1200, height: 630 }],
  },
}

export default function Layout({ children }) {
  return <PublicLayout>{children}</PublicLayout>
}
