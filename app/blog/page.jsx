'use client'
export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const POSTS = [
  {
    slug: 'how-to-find-collaborators',
    category: 'Tips',
    categoryColor: '#4ade80',
    date: 'May 2, 2026',
    readTime: '4 min read',
    title: 'How to Write a Project Post That Actually Gets Responses',
    excerpt: 'Most musicians post projects and hear nothing back. Here\'s what the successful ones do differently — from title to description to role requirements.',
    emoji: '📝',
  },
  {
    slug: 'remote-music-collaboration',
    category: 'Guide',
    categoryColor: '#60a5fa',
    date: 'Apr 28, 2026',
    readTime: '6 min read',
    title: 'The Complete Guide to Remote Music Collaboration in 2026',
    excerpt: 'File sharing, remote recording, stem management, async feedback — everything you need to collaborate with musicians across the world without missing a beat.',
    emoji: '🌍',
  },
  {
    slug: 'vocalist-tips',
    category: 'For Vocalists',
    categoryColor: '#f472b6',
    date: 'Apr 20, 2026',
    readTime: '3 min read',
    title: '5 Things Producers Look for When Choosing a Vocalist',
    excerpt: 'You sent your demo. They never replied. Here\'s what producers actually listen for — and how to make sure your next submission gets a yes.',
    emoji: '🎤',
  },
  {
    slug: 'venue-booking-guide',
    category: 'For Venues',
    categoryColor: '#fbbf24',
    date: 'Apr 15, 2026',
    readTime: '5 min read',
    title: 'How Venues Can Use KrewStage to Book Better Artists',
    excerpt: 'Stop scrolling Instagram to find acts. Here\'s how venues are using KrewStage to post open calls, filter by genre and location, and fill their calendars with quality artists.',
    emoji: '🏛️',
  },
  {
    slug: 'producer-home-studio',
    category: 'Production',
    categoryColor: '#a78bfa',
    date: 'Apr 8, 2026',
    readTime: '7 min read',
    title: 'Home Studio Setup for Producers Who Collaborate Online',
    excerpt: 'Your interface, DAW, and acoustic treatment matter — but so does your workflow. Here\'s how to set up your studio for seamless remote sessions and stem sharing.',
    emoji: '🎛️',
  },
  {
    slug: 'krewstage-launch',
    category: 'News',
    categoryColor: '#ff6b35',
    date: 'Apr 1, 2026',
    readTime: '2 min read',
    title: 'KrewStage Is Live — Find Your Music Crew Today',
    excerpt: 'After months of building, testing, and listening to musicians across Romania and beyond, we\'re officially open. Here\'s what you can do on day one.',
    emoji: '🚀',
  },
]

const CATEGORIES = ['All', 'Tips', 'Guide', 'News', 'For Vocalists', 'For Venues', 'Production']

export default function BlogPage() {
  const router = useRouter()
  const [active, setActive] = useState('All')
  const filtered = active === 'All' ? POSTS : POSTS.filter(p => p.category === active)

  return (
    <div style={{ background: '#0d0d0d', color: '#f0f0f0', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '72px 32px 48px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#ff6b35', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Blog</div>
        <h1 style={{ fontFamily: 'Syne, system-ui', fontWeight: 800, fontSize: 'clamp(32px, 5vw, 52px)', letterSpacing: '-1.5px', color: '#fff', marginBottom: 16 }}>
          Tips, guides &<br /><span style={{ color: '#ff6b35' }}>music industry insights.</span>
        </h1>
        <p style={{ color: '#666', fontSize: 16, maxWidth: 500 }}>For musicians, producers, and venues navigating the modern music landscape.</p>
      </div>

      {/* Filter chips */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 32px 40px' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setActive(c)}
              style={{ padding: '7px 16px', borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: `1px solid ${active === c ? '#ff6b35' : '#2a2a2a'}`, background: active === c ? '#ff6b35' : 'transparent', color: active === c ? '#fff' : '#888', transition: 'all 0.15s' }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Posts grid */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 32px 80px' }}>

        {/* Featured post */}
        {filtered[0] && (
          <div onClick={() => router.push(`/blog/${filtered[0].slug}`)}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#ff6b35'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e1e'}
            style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 16, padding: '40px', marginBottom: 24, cursor: 'pointer', transition: 'border-color 0.2s', display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100, background: `${filtered[0].categoryColor}22`, color: filtered[0].categoryColor, border: `1px solid ${filtered[0].categoryColor}44` }}>{filtered[0].category}</span>
                <span style={{ fontSize: 11, color: '#444' }}>{filtered[0].date}</span>
                <span style={{ fontSize: 11, color: '#444' }}>·</span>
                <span style={{ fontSize: 11, color: '#444' }}>{filtered[0].readTime}</span>
              </div>
              <h2 style={{ fontFamily: 'Syne, system-ui', fontWeight: 700, fontSize: 24, color: '#fff', lineHeight: 1.3, marginBottom: 12, letterSpacing: '-0.3px' }}>{filtered[0].title}</h2>
              <p style={{ color: '#666', fontSize: 14, lineHeight: 1.7 }}>{filtered[0].excerpt}</p>
              <div style={{ marginTop: 20, fontSize: 13, color: '#ff6b35', fontWeight: 600 }}>Read article →</div>
            </div>
            <div style={{ fontSize: 64, opacity: 0.6 }}>{filtered[0].emoji}</div>
          </div>
        )}

        {/* Rest of posts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {filtered.slice(1).map(post => (
            <div key={post.slug} onClick={() => router.push(`/blog/${post.slug}`)}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#ff6b35'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e1e'}
              style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 14, padding: '28px 24px', cursor: 'pointer', transition: 'border-color 0.2s', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>{post.emoji}</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: `${post.categoryColor}22`, color: post.categoryColor, border: `1px solid ${post.categoryColor}44` }}>{post.category}</span>
                <span style={{ fontSize: 10, color: '#444' }}>{post.readTime}</span>
              </div>
              <h3 style={{ fontFamily: 'Syne, system-ui', fontWeight: 700, fontSize: 16, color: '#fff', lineHeight: 1.35, marginBottom: 10, letterSpacing: '-0.2px' }}>{post.title}</h3>
              <p style={{ color: '#555', fontSize: 13, lineHeight: 1.65, flex: 1 }}>{post.excerpt}</p>
              <div style={{ marginTop: 16, fontSize: 12, color: '#ff6b35', fontWeight: 600 }}>Read →</div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#444' }}>No posts in this category yet.</div>
        )}
      </div>

    </div>
  )
}
