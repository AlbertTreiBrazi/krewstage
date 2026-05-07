'use client'
export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'

const TEAM = [
  { name: 'Albert Treibrazi', role: 'Founder & CEO', emoji: '🎸', bio: 'Musician and developer. Built KrewStage after struggling to find collaborators for his own projects.' },
  { name: 'Mihai Ionescu', role: 'Head of Product', emoji: '🎹', bio: 'Producer and UX designer. Obsessed with making music collaboration as frictionless as possible.' },
  { name: 'Ana Vlad', role: 'Community Lead', emoji: '🎤', bio: 'DJ and community builder. Connects artists across Romania and beyond.' },
]

const VALUES = [
  { icon: '🎵', title: 'Music First', desc: 'Every decision we make starts with one question: does this help musicians make better music?' },
  { icon: '🤝', title: 'Real Connections', desc: 'No bots, no fake profiles. Every person on KrewStage is a real musician, producer, or venue.' },
  { icon: '🌍', title: 'Open to All', desc: 'From bedroom producers to seasoned session musicians — KrewStage is for every level and every genre.' },
  { icon: '🚀', title: 'Built to Grow', desc: 'We\'re a small team moving fast. Your feedback directly shapes what we build next.' },
]

export default function AboutPage() {
  const router = useRouter()

  return (
    <div style={{ background: '#0d0d0d', color: '#f0f0f0', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Hero */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '80px 32px 60px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#ff6b35', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>About KrewStage</div>
        <h1 style={{ fontFamily: 'Syne, system-ui', fontWeight: 800, fontSize: 'clamp(36px, 6vw, 64px)', lineHeight: 1.06, letterSpacing: '-2px', marginBottom: 28, color: '#fff' }}>
          We built the platform<br />
          <span style={{ color: '#ff6b35' }}>we always needed.</span>
        </h1>
        <p style={{ fontSize: 18, color: '#888', lineHeight: 1.75, maxWidth: 600, marginBottom: 0 }}>
          KrewStage started as a simple frustration — finding the right collaborators for a music project was harder than it should be. 
          Spreadsheets, Facebook groups, random DMs. There had to be a better way.
        </p>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: '#1e1e1e', maxWidth: 860, margin: '0 auto 60px', padding: '0 32px' }}>
        <div style={{ height: 1, background: 'linear-gradient(90deg, #ff6b35, transparent)' }} />
      </div>

      {/* Story */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 32px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
          <div>
            <h2 style={{ fontFamily: 'Syne, system-ui', fontWeight: 700, fontSize: 28, marginBottom: 18, color: '#fff', letterSpacing: '-0.5px' }}>The story</h2>
            <p style={{ color: '#777', lineHeight: 1.8, marginBottom: 16, fontSize: 15 }}>
              In 2024, a guitarist in Bucharest was trying to finish an EP. He had the songs, the studio time, and the vision — but no vocalist. He posted in five Facebook groups and sent dozens of cold DMs. Weeks later, still nothing.
            </p>
            <p style={{ color: '#777', lineHeight: 1.8, fontSize: 15 }}>
              That guitarist built KrewStage. Not as a business plan, but as a tool he genuinely needed. A place where musicians could find each other, post real projects, and build real things together.
            </p>
          </div>
          <div>
            <h2 style={{ fontFamily: 'Syne, system-ui', fontWeight: 700, fontSize: 28, marginBottom: 18, color: '#fff', letterSpacing: '-0.5px' }}>The mission</h2>
            <p style={{ color: '#777', lineHeight: 1.8, marginBottom: 16, fontSize: 15 }}>
              Music is inherently collaborative. The best songs, albums, and live shows are built by crews — groups of people who found each other, clicked, and created something none of them could have made alone.
            </p>
            <p style={{ color: '#777', lineHeight: 1.8, fontSize: 15 }}>
              Our mission is simple: help musicians find their crew. Whether that's a producer for a single track, a band for the long haul, or a venue for your first real gig.
            </p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div style={{ background: '#111', borderTop: '1px solid #1e1e1e', borderBottom: '1px solid #1e1e1e' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '64px 32px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#ff6b35', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 40 }}>What we believe</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32 }}>
            {VALUES.map(v => (
              <div key={v.title}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{v.icon}</div>
                <div style={{ fontFamily: 'Syne, system-ui', fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 8 }}>{v.title}</div>
                <div style={{ fontSize: 13, color: '#666', lineHeight: 1.7 }}>{v.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '64px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 64 }}>
          {[
            { n: '2024', l: 'Year founded' },
            { n: 'Romania', l: 'Where it started' },
            { n: '🌍', l: 'Open worldwide' },
          ].map(s => (
            <div key={s.l} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 14, padding: '28px 24px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Syne, system-ui', fontWeight: 800, fontSize: 32, color: '#ff6b35', marginBottom: 6 }}>{s.n}</div>
              <div style={{ fontSize: 13, color: '#555' }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Team */}
        <div style={{ fontSize: 11, fontWeight: 700, color: '#ff6b35', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 32 }}>The team</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          {TEAM.map(t => (
            <div key={t.name} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 14, padding: '28px 24px' }}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>{t.emoji}</div>
              <div style={{ fontFamily: 'Syne, system-ui', fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 4 }}>{t.name}</div>
              <div style={{ fontSize: 12, color: '#ff6b35', fontWeight: 600, marginBottom: 12 }}>{t.role}</div>
              <div style={{ fontSize: 13, color: '#666', lineHeight: 1.65 }}>{t.bio}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: '#111', borderTop: '1px solid #1e1e1e' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '64px 32px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Syne, system-ui', fontWeight: 800, fontSize: 32, color: '#fff', marginBottom: 16, letterSpacing: '-0.5px' }}>Ready to find your crew?</h2>
          <p style={{ color: '#666', marginBottom: 32, fontSize: 15 }}>Join musicians, producers, and venues already on KrewStage.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => router.push('/auth?mode=register')} style={{ background: '#ff6b35', border: 'none', borderRadius: 10, padding: '13px 32px', fontSize: 15, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Join Free</button>
            <button onClick={() => router.push('/discover')} style={{ background: 'transparent', border: '1px solid #2a2a2a', borderRadius: 10, padding: '13px 32px', fontSize: 15, color: '#ccc', cursor: 'pointer' }}>Browse Musicians</button>
          </div>
        </div>
      </div>

    </div>
  )
}
