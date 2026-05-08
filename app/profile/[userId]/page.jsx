import ProfilePageClient from '../../../components/ProfilePageClient'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function generateMetadata({ params }) {
  const { data: p } = await supabase
    .from('profiles')
    .select('full_name, bio, city, country, roles, avatar_url')
    .eq('id', params.userId)
    .single()

  if (!p) return { title: 'Musician — KrewStage' }

  const roles = (p.roles || []).join(', ')
  const location = [p.city, p.country].filter(Boolean).join(', ')
  const title = `${p.full_name} — ${roles || 'Musician'} | KrewStage`
  const description = p.bio
    ? p.bio.slice(0, 155)
    : `${p.full_name} is a ${roles || 'musician'}${location ? ' from ' + location : ''} on KrewStage.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://krewstage.com/profile/${params.userId}`,
      images: p.avatar_url
        ? [{ url: p.avatar_url }]
        : [{ url: 'https://krewstage.com/og-image.png' }],
    },
    twitter: { card: 'summary', title, description },
  }
}

export const dynamic = 'force-dynamic'

export default function ProfilePage({ params }) {
  return <ProfilePageClient userId={params?.userId || null} />
}
