import { createClient } from '@supabase/supabase-js'

export default async function sitemap() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const staticPages = [
    { url: 'https://krewstage.com', changeFrequency: 'weekly', priority: 1 },
    { url: 'https://krewstage.com/discover', changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://krewstage.com/projects', changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://krewstage.com/bands', changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://krewstage.com/venues', changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://krewstage.com/about', changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://krewstage.com/blog', changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://krewstage.com/help', changeFrequency: 'monthly', priority: 0.6 },
    { url: 'https://krewstage.com/terms', changeFrequency: 'monthly', priority: 0.4 },
    { url: 'https://krewstage.com/privacy', changeFrequency: 'monthly', priority: 0.4 },
  ]

  const blogPages = [
    'how-to-find-collaborators', 'remote-music-collaboration', 'vocalist-tips',
    'venue-booking-guide', 'producer-home-studio', 'krewstage-launch',
  ].map(slug => ({ url: `https://krewstage.com/blog/${slug}`, changeFrequency: 'monthly', priority: 0.6 }))

  const { data: profiles } = await supabase
    .from('profiles').select('id, updated_at').not('full_name', 'is', null).limit(1000)
  const profilePages = (profiles || []).map(p => ({
    url: `https://krewstage.com/profile/${p.id}`,
    lastModified: p.updated_at,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const { data: projects } = await supabase
    .from('projects').select('id, updated_at').eq('status', 'open').limit(1000)
  const projectPages = (projects || []).map(p => ({
    url: `https://krewstage.com/projects/${p.id}`,
    lastModified: p.updated_at,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [...staticPages, ...blogPages, ...profilePages, ...projectPages]
}
