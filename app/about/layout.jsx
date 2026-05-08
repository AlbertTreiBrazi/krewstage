import PublicLayout from '../../components/PublicLayout'

export const metadata = {
  title: 'About — KrewStage',
  description: 'KrewStage is the platform for musicians to find collaborators, form bands, and reach the stage. Learn about our mission and team.',
  openGraph: {
    title: 'About KrewStage',
    description: 'We built the platform we always needed. Find your music crew.',
    url: 'https://krewstage.com/about',
    images: [{ url: 'https://krewstage.com/og-image.png', width: 1200, height: 630 }],
  },
}

export default function Layout({ children }) {
  return <PublicLayout>{children}</PublicLayout>
}
