'use client'
export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const DEMO_PROJECTS = [
  {
    title: 'Need vocalist for dark pop track',
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&q=75',
    role: 'Vocalist', roleColor: '#f472b6', roleBg: 'rgba(244,114,182,0.18)',
    location: 'Remote', hasAudio: true,
  },
  {
    title: 'Guitarist & drummer for alt rock band',
    image: 'https://images.unsplash.com/photo-1501386761578-eaa54b45c3ca?w=400&q=75',
    role: 'Guitarist, Drummer', roleColor: '#fb923c', roleBg: 'rgba(251,146,60,0.18)',
    location: 'Austin',
  },
  {
    title: 'Producer open to collaborate',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&q=75',
    role: 'Producer', roleColor: '#fb923c', roleBg: 'rgba(251,146,60,0.18)',
    location: 'Remote',
  },
]

const DEMO_MEMBERS = [
  { initials: 'ZA', name: 'Zoe A.', role: 'Vocalist', genres: 'Indie Pop, Alt R&B', city: 'Los Angeles, CA', grad: 'linear-gradient(135deg,#f472b6,#a855f7)' },
  { initials: 'JM', name: 'Jules M.', role: 'Producer', genres: 'Hip Hop, R&B', city: 'Brooklyn, NY', grad: 'linear-gradient(135deg,#ff6b35,#f7931e)' },
  { initials: 'AR', name: 'Alex R.', role: 'Guitarist', genres: 'Alt Rock, Indie', city: 'Austin, TX', grad: 'linear-gradient(135deg,#3b82f6,#06b6d4)' },
]

const ROLE_CHIPS = ['Vocalist','Guitarist','Bassist','Drummer','Keys','Producer','Composer','Lyricist','DJ','Sound Engineer']

const FEATURES = [
  { icon: '👥', title: 'Discover Members', desc: 'Find the right people for your sound.' },
  { icon: '📁', title: 'Projects', desc: 'Post ideas, find opportunities.' },
  { icon: '🎸', title: 'Bands', desc: 'Build your band. Grow together.' },
  { icon: '💬', title: 'Messages', desc: 'Chat and collaborate in real time.' },
  { icon: '👤', title: 'Profiles', desc: 'Showcase your music, skills, and vibe.' },
  { icon: '🏛️', title: 'Venues', desc: 'Connect with venues. Book more shows.' },
]

const s = {
  brand: { fontFamily: 'Syne,system-ui,sans-serif', fontWeight: 900, color: '#ff6b35', letterSpacing: '-0.3px', cursor: 'pointer' },
  card: { background: '#181818', border: '1px solid #222', borderRadius: 12, overflow: 'hidden' },
  pill: (active) => ({ padding: '5px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: `1px solid ${active ? '#ff6b35' : '#2a2a2a'}`, background: active ? '#ff6b35' : 'transparent', color: active ? '#fff' : '#888' }),
}

export default function LandingPage() {
  const router = useRouter()
  const [activeRole, setActiveRole] = useState('Vocalist')

  return (
    <div style={{ background: '#0d0d0d', color: '#f0f0f0', minHeight: '100vh', fontFamily: 'DM Sans,system-ui,sans-serif' }}>

      {/* ── NAV ── */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 32px', borderBottom: '1px solid #1a1a1a', background: 'rgba(13,13,13,0.97)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(20px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: '#ff6b35', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🎤</div>
          <span style={{ ...s.brand, fontSize: 18 }}>KrewStage</span>
        </div>
        <div style={{ display: 'flex', gap: 28 }}>
          {['Explore Projects','Find Members','How It Works','For Venues'].map(l => (
            <span key={l} style={{ fontSize: 13, color: '#888', cursor: 'pointer' }}>{l}</span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => router.push('/auth')} style={{ background: 'transparent', border: '1px solid #2a2a2a', borderRadius: 8, padding: '7px 18px', fontSize: 13, color: '#ccc', cursor: 'pointer' }}>Log In</button>
          <button onClick={() => router.push('/auth?mode=register')} style={{ background: '#ff6b35', border: 'none', borderRadius: 8, padding: '7px 18px', fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Sign Up</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 24, padding: '36px 32px 24px', maxWidth: 1240, margin: '0 auto', alignItems: 'start' }}>

        {/* Left copy */}
        <div>
          <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: 42, fontWeight: 900, lineHeight: 1.06, letterSpacing: '-1.5px', marginBottom: 16 }}>
            Find your<br />music crew.<br />Build songs.<br />
            <span style={{ color: '#ff6b35' }}>Reach the stage.</span>
          </h1>
          <p style={{ fontSize: 14, color: '#777', lineHeight: 1.7, marginBottom: 24 }}>
            Turn music ideas into real projects — find collaborators, finish songs, start bands, and connect with venues.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => router.push('/auth?mode=register')} style={{ background: '#ff6b35', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Post a Project</button>
            <button onClick={() => router.push('/auth')} style={{ background: 'transparent', border: '1px solid #2a2a2a', borderRadius: 8, padding: '10px 24px', fontSize: 14, color: '#ccc', cursor: 'pointer' }}>Explore Projects</button>
          </div>
        </div>

        {/* Right — Dashboard mockup */}
        <div style={{ ...s.card, borderRadius: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 200px', minHeight: 280 }}>

            {/* Sidebar */}
            <div style={{ borderRight: '1px solid #222', padding: '14px 12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 16 }}>
                <div style={{ width: 20, height: 20, borderRadius: 5, background: '#ff6b35', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>🎤</div>
                <span style={{ ...s.brand, fontSize: 13 }}>KrewStage</span>
              </div>
              {[['🏠','Dashboard',true],['📁','Projects',false],['👥','Find Members',false],['💬','Messages',false],['🎸','Bands',false],['👤','Profile',false]].map(([ic,lb,ac]) => (
                <div key={lb} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 7, marginBottom: 2, background: ac ? 'rgba(255,107,53,0.12)' : 'transparent', color: ac ? '#ff6b35' : '#555', fontSize: 12, fontWeight: ac ? 600 : 400, position: 'relative' }}>
                  <span style={{ fontSize: 13 }}>{ic}</span>{lb}
                  {lb === 'Messages' && <span style={{ position: 'absolute', right: 8, background: '#ff6b35', color: '#fff', fontSize: 8, width: 14, height: 14, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>}
                </div>
              ))}
            </div>

            {/* Projects */}
            <div style={{ padding: '14px 12px', borderRight: '1px solid #222' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 700 }}>Recommended Projects</span>
                <span style={{ fontSize: 10, color: '#ff6b35', cursor: 'pointer' }}>View all</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {DEMO_PROJECTS.map((p, i) => (
                  <div key={i} style={{ ...s.card, borderRadius: 10 }}>
                    <div style={{ position: 'relative', height: 60, overflow: 'hidden' }}>
                      <img src={p.image} alt={p.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right,rgba(0,0,0,0.55) 0%,transparent 60%)' }} />
                      {p.hasAudio && (
                        <div style={{ position: 'absolute', bottom: 6, left: 8, background: 'rgba(0,0,0,0.7)', borderRadius: 100, padding: '2px 8px', fontSize: 8, color: '#ccc', display: 'flex', alignItems: 'center', gap: 4 }}>
                          ▶ ────────── 0:45
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '8px 10px' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, lineHeight: 1.3, marginBottom: 5 }}>{p.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 9, color: '#555' }}>🎤</span>
                        <span style={{ fontSize: 9, padding: '1px 7px', borderRadius: 100, background: p.roleBg, color: p.roleColor, fontWeight: 600 }}>{p.role}</span>
                      </div>
                      <div style={{ fontSize: 9, color: '#555', marginTop: 4 }}>📍 {p.location}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div style={{ padding: '14px 12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 700 }}>Messages</span>
                <span style={{ fontSize: 10, color: '#ff6b35', cursor: 'pointer' }}>View all</span>
              </div>
              {[
                { init: 'M', name: 'Maya', msg: "Hey! I love your track. Let's collab. 🎵", time: '2m ago', grad: 'linear-gradient(135deg,#f472b6,#a855f7)', unread: true },
                { init: 'E', name: 'Ethan', msg: "I'm interested in your project. Let's chat.", time: '10m ago', grad: 'linear-gradient(135deg,#ff6b35,#f7931e)', unread: true },
                { init: 'J', name: 'Jamie', msg: 'Your song is dope. I can help with drums!', time: '1h ago', grad: 'linear-gradient(135deg,#3b82f6,#06b6d4)', unread: false },
              ].map(m => (
                <div key={m.name} style={{ display: 'flex', gap: 8, marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #1e1e1e' }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: m.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#fff', flexShrink: 0 }}>{m.init}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 11, fontWeight: 700 }}>{m.name}</span>
                      <span style={{ fontSize: 9, color: '#444' }}>{m.time}</span>
                    </div>
                    <div style={{ fontSize: 10, color: '#777', marginTop: 2, lineHeight: 1.4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.msg}</div>
                  </div>
                  {m.unread && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff6b35', marginTop: 4, flexShrink: 0 }} />}
                </div>
              ))}
              <div style={{ textAlign: 'center', marginTop: 4 }}>
                <span style={{ fontSize: 10, color: '#ff6b35', cursor: 'pointer' }}>Go to Messages →</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MIDDLE GRID: 4 panels ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.6fr 1.4fr', gap: 12, padding: '0 32px 20px', maxWidth: 1240, margin: '0 auto' }}>

        {/* 1. How It Works */}
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#ff6b35', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>1. How It Works</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            {[['📝','Post or explore'],['👥','Connect'],['🎵','Create'],['🎤','Reach the stage']].map(([ic, lb], i) => (
              <div key={lb} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#1e1e1e', border: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, margin: '0 auto 4px' }}>{ic}</div>
                  <div style={{ fontSize: 9, color: '#888', lineHeight: 1.3, maxWidth: 42, textAlign: 'center' }}>{lb}</div>
                </div>
                {i < 3 && <div style={{ color: '#333', fontSize: 14, marginBottom: 12 }}>→</div>}
              </div>
            ))}
          </div>
        </div>

        {/* 2. Why KrewStage */}
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#ff6b35', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>2. Why KrewStage exists</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>👥</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 2 }}>Talented musicians are isolated</div>
                <div style={{ fontSize: 10, color: '#555', lineHeight: 1.4 }}>It's hard to find the right people.</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>🎵</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 2 }}>Music projects stay unfinished</div>
                <div style={{ fontSize: 10, color: '#555', lineHeight: 1.4 }}>Great ideas never reach their potential.</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Featured Projects */}
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#ff6b35', textTransform: 'uppercase', letterSpacing: '0.08em' }}>3. Featured Projects</div>
            <span style={{ fontSize: 10, color: '#ff6b35', cursor: 'pointer' }}>View all</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 6 }}>
            {[
              { label: 'Vocalist', role: 'Vocalist', title: 'Need vocalist for indie pop track', loc: 'Remote', ic: '🎤', c: '#f472b6' },
              { label: 'Drummer', role: 'Drummer', title: 'Drummer wanted for funk project', loc: 'Los Angeles', ic: '🥁', c: '#c084fc' },
              { label: 'Producer', role: 'Producer', title: 'Producer for hip hop EP', loc: 'Remote', ic: '🎛️', c: '#4ade80' },
              { label: 'Venue', role: 'Venue', title: 'Small venue looking for bands', loc: 'Chicago', ic: '🏛️', c: '#fbbf24' },
              { label: 'Band', role: 'Band', title: 'Forming alt rock band', loc: 'Seattle', ic: '🎸', c: '#fb923c' },
            ].map(p => (
              <div key={p.title} style={{ background: '#181818', border: '1px solid #222', borderRadius: 8, padding: '8px 7px', textAlign: 'center' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: p.c + '22', border: `1px solid ${p.c}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, margin: '0 auto 5px' }}>{p.ic}</div>
                <div style={{ fontSize: 8, padding: '1px 5px', borderRadius: 100, background: p.c + '20', color: p.c, border: `1px solid ${p.c}40`, marginBottom: 4, display: 'inline-block', fontWeight: 700 }}>{p.label}</div>
                <div style={{ fontSize: 9, fontWeight: 600, lineHeight: 1.3, color: '#ddd', marginBottom: 4 }}>{p.title}</div>
                <div style={{ fontSize: 8, color: '#555' }}>📍 {p.loc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Find collaborators */}
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#ff6b35', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>4. Find the right collaborators</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
            {ROLE_CHIPS.map(r => (
              <button key={r} onClick={() => setActiveRole(r)} style={s.pill(activeRole === r)}>{r}</button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 7 }}>
            {DEMO_MEMBERS.map(m => (
              <div key={m.name} style={{ background: '#181818', border: '1px solid #222', borderRadius: 9, padding: '10px 9px' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: m.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: '#fff', marginBottom: 6 }}>{m.initials}</div>
                <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 1 }}>{m.name}</div>
                <div style={{ fontSize: 10, color: '#ff6b35', marginBottom: 3 }}>{m.role}</div>
                <div style={{ fontSize: 9, color: '#555', lineHeight: 1.3, marginBottom: 3 }}>{m.genres}</div>
                <div style={{ fontSize: 9, color: '#555' }}>📍 {m.city}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e' }} />
                  <span style={{ fontSize: 9, color: '#4ade80' }}>Open to Collab</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM: Features + CTA ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, padding: '0 32px 32px', maxWidth: 1240, margin: '0 auto' }}>

        {/* Features */}
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: '16px 20px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#ff6b35', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>5. Features built for musicians</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 10 }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ textAlign: 'center' }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, margin: '0 auto 7px' }}>{f.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 3 }}>{f.title}</div>
                <div style={{ fontSize: 10, color: '#555', lineHeight: 1.4 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA box */}
        <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 12, padding: '24px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 280 }}>
          <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 18, fontWeight: 900, lineHeight: 1.2, marginBottom: 10 }}>
            Your next song<br />starts with the<br /><span style={{ color: '#ff6b35' }}>right crew.</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button onClick={() => router.push('/auth?mode=register')} style={{ background: '#ff6b35', border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: 12, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Post a Project</button>
            <button style={{ background: 'transparent', border: '1px solid #2a2a2a', borderRadius: 8, padding: '9px 16px', fontSize: 12, color: '#ccc', cursor: 'pointer' }}>Explore Projects</button>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{ borderTop: '1px solid #1a1a1a', padding: '18px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
            <div style={{ width: 20, height: 20, borderRadius: 5, background: '#ff6b35', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>🎤</div>
            <span style={{ ...s.brand, fontSize: 15 }}>KrewStage</span>
          </div>
          <div style={{ fontSize: 11, color: '#444' }}>Find your music crew. Build songs. <span style={{ color: '#ff6b35' }}>Reach the stage.</span></div>
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          {['Instagram','TikTok','YouTube','Discord','Twitter'].map(s => (
            <span key={s} style={{ fontSize: 12, color: '#444', cursor: 'pointer' }}>{s[0]}</span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {['About','Blog','Help Center','Terms','Privacy'].map(l => (
            <span key={l} style={{ fontSize: 12, color: '#444', cursor: 'pointer' }}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
