import PublicLayout from '../../components/PublicLayout'

export const metadata = {
  title: 'Music Projects — Find Collaborators | KrewStage',
  description: 'Browse open music projects looking for collaborators. Find collabs, live gigs, band searches and session work on KrewStage.',
  openGraph: {
    title: 'Music Projects — KrewStage',
    description: 'Find music projects that need your skills. Apply today.',
    url: 'https://krewstage.com/projects',
    images: [{ url: 'https://krewstage.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'Music Projects — KrewStage' },
}

export default function Layout({ children }) {
  return <PublicLayout>{children}</PublicLayout>
}
