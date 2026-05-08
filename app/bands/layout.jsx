import PublicLayout from '../../components/PublicLayout'

export const metadata = {
  title: 'Bands — Find or Form a Band | KrewStage',
  description: 'Browse bands looking for members or create your own. Connect with musicians by genre and location on KrewStage.',
  openGraph: {
    title: 'Bands — KrewStage',
    description: 'Find a band to join or create your own.',
    url: 'https://krewstage.com/bands',
    images: [{ url: 'https://krewstage.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'Bands — KrewStage' },
}

export default function Layout({ children }) {
  return <PublicLayout>{children}</PublicLayout>
}
