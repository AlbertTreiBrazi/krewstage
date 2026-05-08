import PublicLayout from '../../../components/PublicLayout'

const ARTICLES = {
  'how-to-find-collaborators': {
    title: 'How to Write a Project Post That Gets Responses — KrewStage',
    description: 'Most musicians post projects and hear nothing back. Here\'s what the successful ones do differently.',
  },
  'remote-music-collaboration': {
    title: 'Complete Guide to Remote Music Collaboration in 2026 — KrewStage',
    description: 'File sharing, remote recording, stem management — everything you need to collaborate remotely.',
  },
  'vocalist-tips': {
    title: '5 Things Producers Look for When Choosing a Vocalist — KrewStage',
    description: 'You sent your demo. They never replied. Here\'s what producers actually listen for.',
  },
  'venue-booking-guide': {
    title: 'How Venues Can Use KrewStage to Book Better Artists — KrewStage',
    description: 'Stop scrolling Instagram to find acts. Post open calls and fill your calendar with quality artists.',
  },
  'producer-home-studio': {
    title: 'Home Studio Setup for Online Music Collaboration — KrewStage',
    description: 'Set up your studio for seamless remote sessions and stem sharing.',
  },
  'krewstage-launch': {
    title: 'KrewStage Is Live — Find Your Music Crew Today',
    description: 'After months of building, we\'re officially open. Here\'s what you can do on day one.',
  },
}

export async function generateMetadata({ params }) {
  const meta = ARTICLES[params.slug]
  if (!meta) return { title: 'Blog — KrewStage' }
  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://krewstage.com/blog/${params.slug}`,
      images: [{ url: 'https://krewstage.com/og-image.png', width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title: meta.title },
  }
}

export default function Layout({ children }) {
  return <PublicLayout>{children}</PublicLayout>
}
