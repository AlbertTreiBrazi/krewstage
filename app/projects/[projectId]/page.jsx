import ProjectDetailClient from '../../../components/ProjectDetailClient'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function generateMetadata({ params }) {
  const { data: p } = await supabase
    .from('projects')
    .select('title, description, genre, image_url, owner:profiles!projects_owner_id_fkey(full_name)')
    .eq('id', params.projectId)
    .single()

  if (!p) return { title: 'Project — KrewStage' }

  const title = `${p.title} | KrewStage`
  const description = p.description
    ? p.description.slice(0, 155)
    : `${p.genre || 'Music'} project by ${p.owner?.full_name || 'a musician'} on KrewStage.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://krewstage.com/projects/${params.projectId}`,
      images: p.image_url
        ? [{ url: p.image_url }]
        : [{ url: 'https://krewstage.com/og-image.png' }],
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export const dynamic = 'force-dynamic'

export default function ProjectPage({ params }) {
  return <ProjectDetailClient projectId={params?.projectId || null} />
}
