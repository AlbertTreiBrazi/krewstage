import ProjectDetailClient from '../../../components/ProjectDetailClient'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Accepta atat UUID cat si slug
async function getProject(projectId) {
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-/.test(projectId)
  const { data } = await supabase
    .from('projects')
    .select('id, title, description, genre, image_url, slug, owner:profiles!projects_owner_id_fkey(full_name)')
    .eq(isUUID ? 'id' : 'slug', projectId)
    .single()
  return data
}

export async function generateMetadata({ params }) {
  const p = await getProject(params.projectId)

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

export default async function ProjectPage({ params }) {
  // Daca e slug, rezolva la UUID
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-/.test(params.projectId)
  let projectId = params.projectId
  if (!isUUID) {
    const p = await getProject(params.projectId)
    projectId = p?.id || params.projectId
  }
  return <ProjectDetailClient projectId={projectId} />
}
