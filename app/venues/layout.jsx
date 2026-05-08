import PublicLayout from '../../components/PublicLayout'

export const metadata = {
  title: 'Venues & Live Opportunities — KrewStage',
  description: 'Find venues looking for artists or live gig opportunities. Bars, clubs, festivals and events seeking musicians on KrewStage.',
  openGraph: {
    title: 'Venues & Live Opportunities — KrewStage',
    description: 'Venues and events looking for artists. Find your next live gig.',
    url: 'https://krewstage.com/venues',
    images: [{ url: 'https://krewstage.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'Venues & Live Gigs — KrewStage' },
}

export default function Layout({ children }) {
  return <PublicLayout>{children}</PublicLayout>
}
