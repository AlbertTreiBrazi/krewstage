'use client'
export const dynamic = 'force-dynamic'
import ProjectDetailClient from '../../../components/ProjectDetailClient'

export default function ProjectPage({ params }) {
  const projectId = params?.projectId || null
  return <ProjectDetailClient projectId={projectId} />
}
