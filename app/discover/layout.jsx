import PublicLayout from '../../components/PublicLayout'

export const metadata = {
  title: 'Discover Musicians — KrewStage',
  description: 'Find vocalists, guitarists, producers, drummers and more. Browse musicians by role, genre and location on KrewStage.',
  openGraph: {
    title: 'Discover Musicians — KrewStage',
    description: 'Find the right collaborator for your music project.',
    url: 'https://krewstage.com/discover',
    images: [{ url: 'https://krewstage.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'Discover Musicians — KrewStage' },
}

export default function Layout({ children }) {
  return <PublicLayout>{children}</PublicLayout>
}
