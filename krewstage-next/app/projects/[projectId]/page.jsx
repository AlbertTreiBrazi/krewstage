'use client'
export const dynamic = 'force-dynamic'
import { use } from 'react'
import ProjectDetailClient from '../../../components/ProjectDetailClient'

export default function ProjectPage({ params }) {
  const { projectId } = use(params)
  return <ProjectDetailClient projectId={projectId} />
}
