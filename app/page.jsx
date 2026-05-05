'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// ─── ÎNLOCUIEȘTE AICI cu imaginile tale generate din Hailuo AI ─────────────────
// Pune URL-ul imaginii generate între ghilimele, după semnul =
const IMG = {
  proj1: '',   // "Need vocalist for dark pop track" - imagine cu microfon, studio
  proj2: '',   // "Guitarist & drummer for alt rock band" - imagine cu trupă pe scenă
  proj3: '',   // "Producer open to collaborate" - imagine cu studio / echipament
  feat1: '',   // Featured: Pop Ballad - imagine vocalist
  feat2: '',   // Featured: Drummer Needed - imagine tobe / funk
  feat3: '',   // Featured: Lo-Fi Producer - imagine studio lofi
  feat4: '',   // Featured: Indie Night - imagine concert / venue
  feat5: '',   // Featured: Country Songwriter - imagine chitarist acustic
  venue: '',   // Secțiunea venues - imagine concert crowd
  mem1:  '',   // Sofia Martinez - avatar
  mem2:  '',   // Ethan Brooks - avatar
  mem3:  '',   // Jordan Lee - avatar
}
// ──────────────────────────────────────────────────────────────────────────────

// Gradient placeholder când imaginea lipsește
const G = {
  proj1: 'linear-gradient(135deg,#1a0820 0%,#2d1040 50%,#1a0820 100%)',
  proj2: 'linear-gradient(135deg,#0a1020 0%,#102840 50%,#0a1020 100%)',
  proj3: 'linear-gradient(135deg,#0d150d 0%,#1a2810 50%,#0d150d 100%)',
  feat1: 'linear-gradient(135deg,#1a0820,#2d1040)',
  feat2: 'linear-gradient(135deg,#0a1020,#102840)',
  feat3: 'linear-gradient(135deg,#0d150d,#1a2510)',
  feat4: 'linear-gradient(135deg,#1a0808,#2d1010)',
  feat5: 'linear-gradient(135deg,#0d100a,#1a200f)',
  venue: 'linear-gradient(135deg,#0d0d0d,#1a1010)',
}

const bg = (key) => IMG[key]
  ? { backgroundImage: `url(${IMG[key]})`, backgroundSize: 'cover', backgroundPosition: 'center' }
  : { background: G[key] || '#1a1a1a' }

const DEMO_MSGS = [
  { name: 'Maya Chen', time: '2h ago', msg: "Hey! I love your track. Let's collab. 🎵", unread: true, color: 'linear-gradient(135deg,#f472b6,#a855f7)' },
  { name: 'Jordan Miles', time: '1d ago', msg: "Your project sounds great. I'm available to produce.", unread: false, color: 'linear-gradient(135deg,#3b82f6,#06b6d4)' },
  { name: 'Jamie R.', time: '3h ago', msg: "Your song is dope. I can help with drums!", unread: false, color: 'linear-gradient(135deg,#10b981,#22c55e)' },
]

const AV_COLORS = ['#ff6b35','#a855f7','#3b82f6','#10b981']

export default function LandingPage() {
  const router = useRouter()
  const [activeRole, setActiveRole] = useState('Vocalist')

  const ROLES = ['Vocalist','Guitarist','Bassist','Drummer','Keys / Piano','Producer','Composer','Lyricist','DJ','Sound Engineer']

  return (
    <div style={{ background: '#0d0d0d', color: '#f0f0f0', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif', overflowX: 'hidden' }}>

      {/* ── NAV ── */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 40px', borderBottom: '1px solid #1a1a1a', background: 'rgba(13,13,13,0.97)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(20px)' }}>
        <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: '#ff6b35', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🎤</div>
          <span style={{ fontFamily: 'Syne, system-ui', fontWeight: 800, fontSize: 18, letterSpacing: '-0.3px' }}>
            <span style={{ color: '#ff6b35' }}>Krew</span><span style={{ color: '#f0f0f0' }}>Stage</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: 32 }}>
          {[
            { l: 'Explore Projects', p: '/projects' },
            { l: 'Find Members',     p: '/discover' },
            { l: 'How It Works',     p: '#how' },
            { l: 'For Venues',       p: '/venues' },
          ].map(item => (
            <span key={item.l} onClick={() => {
              if (item.p === '#how') document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })
              else router.push(item.p)
            }} style={{ fontSize: 14, color: '#999', cursor: 'pointer', fontWeight: 500, transition: 'color 0.15s' }}
              onMouseEnter={e => e.target.style.color = '#f0f0f0'}
              onMouseLeave={e => e.target.style.color = '#999'}>
              {item.l}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={() => router.push('/auth')} style={{ background: 'transparent', border: 'none', padding: '8px 14px', fontSize: 14, color: '#ccc', cursor: 'pointer', fontWeight: 500 }}>Log In</button>
          <button onClick={() => router.push('/auth?mode=register')} style={{ background: '#ff6b35', border: 'none', borderRadius: 8, padding: '9px 22px', fontSize: 14, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>Sign Up</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 28, padding: '44px 40px 24px', maxWidth: 1280, margin: '0 auto', alignItems: 'start' }}>

        {/* Left copy */}
        <div style={{ paddingTop: 12 }}>
          <h1 style={{ fontFamily: 'Syne, system-ui', fontSize: 46, fontWeight: 800, lineHeight: 1.06, letterSpacing: '-1.5px', marginBottom: 18, color: '#fff' }}>
            Find your music crew.<br />Build songs.<br />
            <span style={{ color: '#ff6b35' }}>Reach the stage.</span>
          </h1>
          <p style={{ fontSize: 14, color: '#888', lineHeight: 1.7, marginBottom: 26, maxWidth: 340 }}>
            KrewStage connects songwriters, musicians, producers, bands, and venues through real music projects — from demos and unfinished songs to collaborations, bands, and live opportunities.
          </p>
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <button onClick={() => router.push('/auth?mode=register')} style={{ background: '#ff6b35', border: 'none', borderRadius: 8, padding: '11px 24px', fontSize: 14, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>Post a Project</button>
            <button onClick={() => router.push('/projects')} style={{ background: 'transparent', border: '1px solid #2a2a2a', borderRadius: 8, padding: '11px 24px', fontSize: 14, color: '#ddd', cursor: 'pointer', fontWeight: 500 }}>Explore Projects</button>
          </div>
          {/* Social proof */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex' }}>
              {AV_COLORS.map((c, i) => (
                <div key={i} style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: '2px solid #0d0d0d', marginLeft: i > 0 ? -8 : 0 }} />
              ))}
            </div>
            <div style={{ fontSize: 12, color: '#666', lineHeight: 1.5 }}>
              Join musicians, producers, bands,<br />and venues from around the world.
            </div>
          </div>
        </div>

        {/* Right — Dashboard mockup */}
        <div style={{ background: '#141414', border: '1px solid #222', borderRadius: 14, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 210px' }}>

            {/* Sidebar */}
            <div style={{ borderRight: '1px solid #1e1e1e', padding: '14px 12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                <div style={{ width: 18, height: 18, borderRadius: 4, background: '#ff6b35', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9 }}>🎤</div>
                <span style={{ fontSize: 12, fontFamily: 'Syne,system-ui', fontWeight: 800, color: '#ff6b35' }}>KrewStage</span>
              </div>
              {[['🏠','Dashboard',true],['📁','Projects',false],['👥','Find Members',false],['💬','Messages',false],['🎸','Bands',false],['👤','Profile',false]].map(([ic, lb, ac]) => (
                <div key={lb} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 9px', borderRadius: 6, marginBottom: 2, background: ac ? 'rgba(255,107,53,0.12)' : 'transparent', color: ac ? '#ff6b35' : '#555', fontSize: 11, fontWeight: ac ? 600 : 400, position: 'relative', cursor: 'pointer' }}>
                  <span style={{ fontSize: 12 }}>{ic}</span>{lb}
                  {lb === 'Messages' && <span style={{ position: 'absolute', right: 7, background: '#ff6b35', color: '#fff', fontSize: 8, width: 14, height: 14, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>3</span>}
                </div>
              ))}
            </div>

            {/* Projects — 3 horizontal cards */}
            <div style={{ padding: '14px 12px', borderRight: '1px solid #1e1e1e' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 700 }}>Recommended Projects</span>
                <span onClick={() => router.push('/projects')} style={{ fontSize: 9, color: '#ff6b35', cursor: 'pointer', fontWeight: 600 }}>View all projects →</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                {[
                  { key: 'proj1', title: 'Need vocalist for dark pop track', role: 'Vocalist', roleColor: '#f472b6', roleBg: 'rgba(244,114,182,0.2)', location: 'Remote', hasAudio: true, avs: ['#ff6b35','#a855f7','#3b82f6'] },
                  { key: 'proj2', title: 'Guitarist & drummer for alt rock band', role: 'Guitarist, Drummer', roleColor: '#fb923c', roleBg: 'rgba(251,146,60,0.2)', location: 'Austin, TX', avs: ['#10b981','#f472b6','#3b82f6'] },
                  { key: 'proj3', title: 'Producer open to collaborate', role: 'Producer', roleColor: '#4ade80', roleBg: 'rgba(74,222,128,0.2)', location: 'Remote', avs: ['#a855f7','#ff6b35'] },
                ].map(p => (
                  <div key={p.key} style={{ background: '#1a1a1a', border: '1px solid #222', borderRadius: 10, overflow: 'hidden', cursor: 'pointer' }}
                    onClick={() => router.push('/projects')}>
                    <div style={{ position: 'relative', height: 72, ...bg(p.key) }}>
                      {p.hasAudio && (
                        <div style={{ position: 'absolute', bottom: 6, left: 6, right: 6, background: 'rgba(0,0,0,0.7)', borderRadius: 100, padding: '2px 7px', fontSize: 8, color: '#ccc', display: 'flex', alignItems: 'center', gap: 4 }}>
                          ▶ <div style={{ flex: 1, height: 1, background: '#555' }} /> 0:45
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '7px 8px' }}>
                      <div style={{ fontSize: 10, fontWeight: 700, lineHeight: 1.3, marginBottom: 5, color: '#eee' }}>{p.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                        <span style={{ fontSize: 9, color: '#888' }}>Looking for:</span>
                        <span style={{ fontSize: 8, padding: '1px 6px', borderRadius: 100, background: p.roleBg, color: p.roleColor, fontWeight: 600 }}>{p.role}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex' }}>
                          {p.avs.map((c, i) => (
                            <div key={i} style={{ width: 14, height: 14, borderRadius: '50%', background: c, border: '1.5px solid #1a1a1a', marginLeft: i > 0 ? -4 : 0 }} />
                          ))}
                          <span style={{ fontSize: 8, color: '#555', marginLeft: 4 }}>+{p.avs.length > 2 ? p.avs.length - 2 : 1}</span>
                        </div>
                        <span style={{ fontSize: 8, color: '#555' }}>📍 {p.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div style={{ padding: '14px 12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 700 }}>Messages</span>
                <span onClick={() => router.push('/auth?mode=register')} style={{ fontSize: 9, color: '#ff6b35', cursor: 'pointer', fontWeight: 600 }}>View all</span>
              </div>
              {DEMO_MSGS.map(m => (
                <div key={m.name} style={{ display: 'flex', gap: 8, marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #1e1e1e' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#fff', flexShrink: 0 }}>{m.name[0]}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                      <span style={{ fontSize: 10, fontWeight: 700 }}>{m.name}</span>
                      <span style={{ fontSize: 8, color: '#444' }}>{m.time}</span>
                    </div>
                    <div style={{ fontSize: 9, color: '#777', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{m.msg}</div>
                  </div>
                  {m.unread && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff6b35', marginTop: 4, flexShrink: 0 }} />}
                </div>
              ))}
              <div style={{ textAlign: 'center', marginTop: 4 }}>
                <span onClick={() => router.push('/auth?mode=register')} style={{ fontSize: 9, color: '#ff6b35', cursor: 'pointer', fontWeight: 600 }}>Go to Messages →</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MIDDLE 4 PANELS ── */}
      <div id="how" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.8fr 1.5fr', gap: 12, padding: '0 40px 18px', maxWidth: 1280, margin: '0 auto' }}>

        {/* 1. How It Works */}
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#ff6b35', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>How It Works</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { ic: '📝', t: 'Post or explore', d: 'Share a project or search for opportunities' },
              { ic: '👥', t: 'Connect', d: 'Find the right musicians for your sound' },
              { ic: '🎵', t: 'Create', d: 'Collaborate and finish songs together' },
              { ic: '🎤', t: 'Reach the stage', d: 'Perform live, book venues, grow your fanbase' },
            ].map(s => (
              <div key={s.t} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: '#1a1a1a', border: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>{s.ic}</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{s.t}</div>
                  <div style={{ fontSize: 11, color: '#555', lineHeight: 1.4 }}>{s.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Why KrewStage */}
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#ff6b35', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Why KrewStage Exists</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { ic: '👥', t: 'Talented musicians are isolated', d: "It's hard to find the right people." },
              { ic: '🎵', t: 'Music projects stay unfinished', d: 'Great ideas never reach their potential.' },
            ].map(s => (
              <div key={s.t} style={{ display: 'flex', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{s.ic}</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4, lineHeight: 1.3 }}>{s.t}</div>
                  <div style={{ fontSize: 11, color: '#555', lineHeight: 1.5 }}>{s.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Featured Projects */}
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#ff6b35', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Featured Projects</div>
            <span onClick={() => router.push('/projects')} style={{ fontSize: 9, color: '#ff6b35', cursor: 'pointer', fontWeight: 600 }}>View all</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 7 }}>
            {[
              { key: 'feat1', label: 'POP',        type: 'Vocalist',  title: 'Pop Ballad — Vocals Collab',       loc: 'Remote',       c: '#f472b6' },
              { key: 'feat2', label: 'FUNK',       type: 'Drummer',   title: 'Drummer Needed for Funk Project',  loc: 'Seattle, WA',  c: '#c084fc' },
              { key: 'feat3', label: 'LO-FI',      type: 'Producer',  title: 'Lo-Fi Producer Open to Collab',   loc: 'Remote',       c: '#4ade80' },
              { key: 'feat4', label: 'LIVE EVENT', type: 'Venue',     title: 'Indie Night at The Hollow',       loc: 'Brooklyn, NY', c: '#fbbf24' },
              { key: 'feat5', label: 'COUNTRY',    type: 'Band',      title: 'Country Songwriter Seeking Band', loc: 'Nashville, TN', c: '#fb923c' },
            ].map(p => (
              <div key={p.key} onClick={() => router.push('/projects')}
                style={{ background: '#1a1a1a', border: '1px solid #222', borderRadius: 8, overflow: 'hidden', cursor: 'pointer' }}>
                <div style={{ height: 64, position: 'relative', ...bg(p.key) }}>
                  <div style={{ position: 'absolute', top: 4, left: 4, background: 'rgba(0,0,0,0.7)', padding: '1px 5px', borderRadius: 3, fontSize: 7, fontWeight: 700, color: '#fff', letterSpacing: '0.05em' }}>{p.label}</div>
                </div>
                <div style={{ padding: '6px 7px' }}>
                  <span style={{ fontSize: 8, padding: '1px 5px', borderRadius: 100, background: p.c + '25', color: p.c, border: `1px solid ${p.c}44`, fontWeight: 700, display: 'inline-block', marginBottom: 3 }}>{p.type}</span>
                  <div style={{ fontSize: 9, fontWeight: 600, lineHeight: 1.3, color: '#ddd', marginBottom: 3 }}>{p.title}</div>
                  <div style={{ fontSize: 8, color: '#555' }}>📍 {p.loc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Find Collaborators */}
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#ff6b35', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Find the right collaborators</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
            {ROLES.map(r => (
              <button key={r} onClick={() => router.push(`/discover?role=${r.toLowerCase().replace(' / ','_')}`)}
                onMouseEnter={() => setActiveRole(r)} onMouseLeave={() => setActiveRole('Vocalist')}
                style={{ padding: '4px 10px', borderRadius: 100, fontSize: 10, fontWeight: 600, cursor: 'pointer', border: `1px solid ${activeRole === r ? '#ff6b35' : '#2a2a2a'}`, background: activeRole === r ? '#ff6b35' : 'transparent', color: activeRole === r ? '#fff' : '#888', transition: 'all 0.15s' }}>
                {r}
              </button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 7 }}>
            {[
              { key: 'mem1', name: 'Sofia M.', role: 'Vocalist',  genres: 'Indie Pop, Alt R&B', city: 'Los Angeles, CA', grad: 'linear-gradient(135deg,#f472b6,#a855f7)' },
              { key: 'mem2', name: 'Jules M.',  role: 'Producer',  genres: 'Hip Hop, R&B',       city: 'Brooklyn, NY',   grad: 'linear-gradient(135deg,#ff6b35,#f7931e)' },
              { key: 'mem3', name: 'Alex R.',  role: 'Guitarist', genres: 'Alt Rock, Indie',    city: 'Austin, TX',     grad: 'linear-gradient(135deg,#3b82f6,#06b6d4)' },
            ].map(m => (
              <div key={m.key} onClick={() => router.push('/discover')}
                style={{ background: '#181818', border: '1px solid #222', borderRadius: 8, padding: '9px 8px', cursor: 'pointer' }}>
                {IMG[m.key]
                  ? <img src={IMG[m.key]} alt={m.name} style={{ width: 30, height: 30, borderRadius: '50%', marginBottom: 6, objectFit: 'cover' }} />
                  : <div style={{ width: 30, height: 30, borderRadius: '50%', background: m.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff', marginBottom: 6 }}>{m.name[0]}</div>
                }
                <div style={{ fontSize: 10, fontWeight: 700, marginBottom: 1 }}>{m.name}</div>
                <div style={{ fontSize: 9, color: '#ff6b35', marginBottom: 3 }}>{m.role}</div>
                <div style={{ fontSize: 8, color: '#555', lineHeight: 1.3, marginBottom: 3 }}>{m.genres}</div>
                <div style={{ fontSize: 8, color: '#555', marginBottom: 5 }}>📍 {m.city}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e' }} />
                  <span style={{ fontSize: 8, color: '#4ade80' }}>Open to Collab</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM: Features + Venues + CTA ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 12, padding: '0 40px 32px', maxWidth: 1280, margin: '0 auto' }}>

        {/* Features */}
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: '16px 20px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#ff6b35', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>5. Features built for musicians</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 10 }}>
            {[
              { ic: '👥', t: 'Discover Members', d: 'Find the right people for your sound.' },
              { ic: '📁', t: 'Projects',         d: 'Post ideas, find opportunities.' },
              { ic: '🎸', t: 'Bands',            d: 'Build your band. Grow together.' },
              { ic: '💬', t: 'Messages',         d: 'Chat and collaborate in real time.' },
              { ic: '👤', t: 'Profiles',         d: 'Showcase your music, skills, and vibe.' },
              { ic: '🏛️', t: 'Venues',           d: 'Connect with venues. Book more shows.' },
            ].map(f => (
              <div key={f.t} style={{ textAlign: 'center' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, margin: '0 auto 7px' }}>{f.ic}</div>
                <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 3 }}>{f.t}</div>
                <div style={{ fontSize: 10, color: '#555', lineHeight: 1.4 }}>{f.d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Venues banner */}
        <div onClick={() => router.push('/venues')} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: '18px 20px', cursor: 'pointer', minWidth: 220, position: 'relative', overflow: 'hidden' }}>
          {IMG.venue && <img src={IMG.venue} alt="venue" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }} />}
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 6, fontFamily: 'Syne,system-ui' }}>For venues and organizers</div>
            <div style={{ fontSize: 11, color: '#888', marginBottom: 14, lineHeight: 1.5 }}>Find artists, bands, and live-ready projects for your next event.</div>
            <button onClick={e => { e.stopPropagation(); router.push('/venues') }} style={{ background: '#ff6b35', border: 'none', borderRadius: 7, padding: '7px 16px', fontSize: 11, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Discover Artists</button>
          </div>
        </div>

        {/* CTA box */}
        <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 12, padding: '20px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 260 }}>
          <div style={{ fontFamily: 'Syne,system-ui', fontSize: 17, fontWeight: 900, lineHeight: 1.25, marginBottom: 14 }}>
            Your next song starts<br />with the <span style={{ color: '#ff6b35' }}>right crew.</span>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={() => router.push('/auth?mode=register')} style={{ background: '#ff6b35', border: 'none', borderRadius: 7, padding: '8px 16px', fontSize: 12, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Post a Project</button>
            <button onClick={() => router.push('/projects')} style={{ background: 'transparent', border: '1px solid #2a2a2a', borderRadius: 7, padding: '8px 16px', fontSize: 12, color: '#ccc', cursor: 'pointer' }}>Explore Projects</button>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{ borderTop: '1px solid #1a1a1a', padding: '18px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 20, height: 20, borderRadius: 5, background: '#ff6b35', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>🎤</div>
          <div>
            <span style={{ fontFamily: 'Syne,system-ui', fontWeight: 800, fontSize: 14, color: '#ff6b35' }}>Krew</span><span style={{ fontFamily: 'Syne,system-ui', fontWeight: 800, fontSize: 14, color: '#f0f0f0' }}>Stage</span>
            <div style={{ fontSize: 10, color: '#444', marginTop: 1 }}>Find your music crew. Build songs. <span style={{ color: '#ff6b35' }}>Reach the stage.</span></div>
          </div>
        </div>
        {/* Social icons */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {[
            { href: 'https://instagram.com/krewstage', label: 'Instagram', svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> },
            { href: 'https://tiktok.com/@krewstage', label: 'TikTok', svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.77a4.85 4.85 0 01-1.01-.08z"/></svg> },
            { href: 'https://youtube.com/@krewstage', label: 'YouTube', svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg> },
            { href: 'https://discord.gg/krewstage', label: 'Discord', svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/></svg> },
            { href: 'https://x.com/krewstage', label: 'X', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
          ].map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{ color: '#555', display: 'flex', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#ff6b35'}
              onMouseLeave={e => e.currentTarget.style.color = '#555'}>
              {s.svg}
            </a>
          ))}
        </div>
        {/* Footer links */}
        <div style={{ display: 'flex', gap: 20 }}>
          {['About', 'Blog', 'Help Center', 'Terms', 'Privacy'].map(l => (
            <span key={l} onClick={() => router.push('/auth')} style={{ fontSize: 12, color: '#555', cursor: 'pointer', transition: 'color 0.15s' }}
              onMouseEnter={e => e.target.style.color = '#f0f0f0'}
              onMouseLeave={e => e.target.style.color = '#555'}>
              {l}
            </span>
          ))}
        </div>
      </div>

    </div>
  )
}
