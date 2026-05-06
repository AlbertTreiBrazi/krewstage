'use client'
export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

// ─── DEMO DATA ───────────────────────────────────────────────────────────

const DEMO_PROJECTS = [
  {
    title: 'Need vocalist for dark pop track',
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&q=80',
    role: 'Vocalist', roleColor: '#f472b6', roleBg: 'rgba(244,114,182,0.18)',
    location: 'Remote', hasAudio: true,
    avSeeds: ['maya-vocalist','ethan-producer','zoe-vocalist'], extra: 2,
  },
  {
    title: 'Guitarist & drummer for alt rock band',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
    role: 'Guitarist, Drummer', roleColor: '#fb923c', roleBg: 'rgba(251,146,60,0.18)',
    location: 'Austin, TX',
    avSeeds: ['alex-guitarist','jules-producer','jamie-drummer','zoe-vocalist'], extra: 4,
  },
  {
    title: 'Producer open to collaborate',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80',
    role: 'Producer', roleColor: '#4ade80', roleBg: 'rgba(74,222,128,0.18)',
    location: 'Remote',
    avSeeds: ['jules-producer','maya-vocalist','ethan-producer'], extra: 1,
  },
]

// DiceBear avatare ilustrate — fără atribuire, gratuit, deterministic prin seed
const dicebear = (seed) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=ff6b35,f472b6,a855f7,3b82f6,22c55e,fbbf24&backgroundType=gradientLinear`

const DEMO_MESSAGES = [
  { name: 'Maya',  msg: "Hey! I love your track. Let's collab. 🎵",  time: '2m ago',  unread: true,  seed: 'maya-vocalist' },
  { name: 'Ethan', msg: "I'm interested in your project. Let's chat.", time: '10m ago', unread: true,  seed: 'ethan-producer' },
  { name: 'Jamie', msg: 'Your song is dope. I can help with drums!',  time: '1h ago',  unread: false, seed: 'jamie-drummer' },
]

const DEMO_MEMBERS = [
  { name: 'Zoe A.',   role: 'Vocalist',  genres: 'Indie Pop, Alt R&B', city: 'Los Angeles, CA', seed: 'zoe-vocalist' },
  { name: 'Jules M.', role: 'Producer',  genres: 'Hip Hop, R&B',       city: 'Brooklyn, NY',    seed: 'jules-producer' },
  { name: 'Alex R.',  role: 'Guitarist', genres: 'Alt Rock, Indie',    city: 'Austin, TX',      seed: 'alex-guitarist' },
]

const ROLE_CHIPS = ['Vocalist','Guitarist','Bassist','Drummer','Keys','Producer','Composer','Lyricist','DJ','Sound Engineer']

const FEATURES = [
  { icon: '👥', title: 'Discover Members', desc: 'Find the right people for your sound.' },
  { icon: '📁', title: 'Projects',         desc: 'Post ideas, find opportunities.' },
  { icon: '🎸', title: 'Bands',            desc: 'Build your band. Grow together.' },
  { icon: '💬', title: 'Messages',         desc: 'Chat and collaborate in real time.' },
  { icon: '👤', title: 'Profiles',         desc: 'Showcase your music, skills, and vibe.' },
  { icon: '🏛️', title: 'Venues',           desc: 'Connect with venues. Book more shows.' },
]

// ─── SOCIAL ICONS ─────────────────────────────────────────────────────────

const Icon = ({ children, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
)
const IG = () => <Icon><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" /></Icon>
const TT = () => <Icon><path d="M21 8.5a6.5 6.5 0 0 1-5-2.4V16a5 5 0 1 1-5-5" /></Icon>
const YT = () => <Icon><rect x="2" y="5" width="20" height="14" rx="3" /><path d="M10 9.5v5l4-2.5z" fill="currentColor" stroke="none" /></Icon>
const DC = () => <Icon><path d="M8 9c2.5-1 5.5-1 8 0" /><path d="M7 19c-2-1-3-3-3-6 0-3 1-6 4-7l1 2" /><path d="M17 19c2-1 3-3 3-6 0-3-1-6-4-7l-1 2" /><circle cx="9" cy="13" r="1" fill="currentColor" stroke="none" /><circle cx="15" cy="13" r="1" fill="currentColor" stroke="none" /></Icon>
const X  = () => <Icon><path d="M4 4l16 16M20 4L4 20" /></Icon>

// ─── STYLES ───────────────────────────────────────────────────────────────

const s = {
  brandLogo: { fontFamily: 'Syne, system-ui, sans-serif', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' },
  brandLogoOrange: { fontFamily: 'Syne, system-ui, sans-serif', fontWeight: 800, color: '#ff6b35', letterSpacing: '-0.5px' },
  card: { background: '#181818', border: '1px solid #232323', borderRadius: 12, overflow: 'hidden' },
  panel: { background: '#111', border: '1px solid #1e1e1e', borderRadius: 14, padding: '18px 20px' },
  pill: (active) => ({ padding: '6px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: `1px solid ${active ? '#ff6b35' : '#2a2a2a'}`, background: active ? '#ff6b35' : 'transparent', color: active ? '#fff' : '#999', transition: 'all 0.15s' }),
  sectionLabel: { fontSize: 11, fontWeight: 700, color: '#ff6b35', textTransform: 'uppercase', letterSpacing: '0.08em' },
}

// ─── PAGE ─────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const router = useRouter()
  const [activeRole, setActiveRole] = useState('Vocalist')

  return (
    <div style={{ background: '#0d0d0d', color: '#f0f0f0', minHeight: '100vh', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>

      {/* ── NAV ── */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 40px', borderBottom: '1px solid #1a1a1a', background: 'rgba(13,13,13,0.97)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(20px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: '#ff6b35', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🎤</div>
          <span style={{ fontSize: 19 }}>
            <span style={s.brandLogo}>Krew</span><span style={s.brandLogoOrange}>Stage</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: 32 }}>
          {[{l:'Explore Projects',p:'/projects'},{l:'Find Members',p:'/discover'},{l:'How It Works',p:'#how'},{l:'For Venues',p:'/venues'}].map(item => (
            <span key={item.l} onClick={() => item.p.startsWith('#') ? null : router.push(item.p)} style={{ fontSize: 14, color: '#999', cursor: 'pointer', fontWeight: 500 }}>{item.l}</span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={() => router.push('/auth')} style={{ background: 'transparent', border: 'none', padding: '8px 12px', fontSize: 14, color: '#ddd', cursor: 'pointer', fontWeight: 500 }}>Log In</button>
          <button onClick={() => router.push('/auth?mode=register')} style={{ background: '#ff6b35', border: 'none', borderRadius: 8, padding: '9px 22px', fontSize: 14, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>Sign Up</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 28, padding: '36px 40px 20px', maxWidth: 1400, margin: '0 auto', alignItems: 'stretch' }}>

        {/* Left copy */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 className="hero-h1" style={{ fontFamily: 'Syne, system-ui', fontSize: 40, fontWeight: 800, lineHeight: 1.08, letterSpacing: '-1.2px', marginBottom: 14, color: '#fff' }}>
            Find your music crew.<br />
            Build songs.<br />
            <span style={{ color: '#ff6b35' }}>Reach the stage.</span>
          </h1>
          <p style={{ fontSize: 14, color: '#888', lineHeight: 1.65, marginBottom: 22, maxWidth: 340 }}>
            KrewStage connects songwriters, musicians, producers, bands, and venues through real music projects — from demos and unfinished songs to collaborations, bands, and live opportunities.
          </p>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <button onClick={() => router.push('/auth?mode=register')} style={{ background: '#ff6b35', border: 'none', borderRadius: 8, padding: '11px 24px', fontSize: 14, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>Post a Project</button>
            <button onClick={() => router.push('/projects')} style={{ background: 'transparent', border: '1px solid #2a2a2a', borderRadius: 8, padding: '11px 24px', fontSize: 14, color: '#ddd', cursor: 'pointer', fontWeight: 500 }}>Explore Projects</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex' }}>
              {['maya-vocalist','ethan-producer','zoe-vocalist','alex-guitarist'].map((seed, i) => (
                <img key={i} src={dicebear(seed)} alt="" style={{ width: 30, height: 30, borderRadius: '50%', border: '2px solid #0d0d0d', marginLeft: i > 0 ? -9 : 0, background: '#1a1a1a' }} />
              ))}
            </div>
            <div style={{ fontSize: 12, color: '#666', lineHeight: 1.5 }}>
              Join musicians, producers, bands,<br />and venues from around the world.
            </div>
          </div>
        </div>

        {/* Right — Dashboard mockup exacta ca Image 2 */}
        
        <div className="hero-mockup" style={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: 14, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 190px', flex: 1 }}>

            {/* Sidebar */}
            <div style={{ borderRight: '1px solid #1e1e1e', padding: '14px 12px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 18 }}>
                <div style={{ width: 20, height: 20, borderRadius: 5, background: '#ff6b35', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>🎤</div>
                <span style={{ fontFamily: 'Syne,system-ui', fontWeight: 800, fontSize: 13 }}>
                  <span style={{ color: '#ff6b35' }}>Krew</span><span style={{ color: '#f0f0f0' }}>Stage</span>
                </span>
              </div>
              <div style={{ flex: 1 }}>
                {[['🏠','Dashboard',true],['📁','Projects',false],['👥','Find Members',false],['💬','Messages',false,2],['🎸','Bands',false],['👤','Profile',false]].map(([ic,lb,ac,badge]) => (
                  <div key={lb} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 7, marginBottom: 2, background: ac ? 'rgba(255,107,53,0.12)' : 'transparent', color: ac ? '#ff6b35' : '#666', fontSize: 13, fontWeight: ac ? 600 : 400, position: 'relative', cursor: 'pointer' }}>
                    <span style={{ fontSize: 13 }}>{ic}</span>{lb}
                    {badge && <span style={{ position: 'absolute', right: 8, background: '#ff6b35', color: '#fff', fontSize: 8, minWidth: 15, height: 15, borderRadius: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, padding: '0 3px' }}>{badge}</span>}
                  </div>
                ))}
              </div>
              {/* Alex Rivera bottom */}
              <div style={{ borderTop: '1px solid #1e1e1e', paddingTop: 10, marginTop: 8, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <img src={dicebear('alex-rivera-user')} alt="Alex Rivera" style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, background: '#1a1a1a' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#f0f0f0' }}>Alex Rivera</div>
                  <div style={{ fontSize: 9, color: '#ff6b35' }}>View Profile</div>
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
              </div>
            </div>

            {/* Projects — 3 coloane mari ca Image 2 */}
            <div style={{ padding: '12px 11px', borderRight: '1px solid #1e1e1e' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#f0f0f0' }}>Recommended Projects</span>
                <span onClick={() => router.push('/projects')} style={{ fontSize: 9, color: '#ff6b35', cursor: 'pointer', fontWeight: 600 }}>View all projects →</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                {DEMO_PROJECTS.map((p, i) => (
                  <div key={i} onClick={() => router.push('/projects')} style={{ background: '#1c1c1c', border: '1px solid #222', borderRadius: 10, overflow: 'hidden', cursor: 'pointer' }}>
                    {/* Image large */}
                    <div style={{ position: 'relative', height: 140, overflow: 'hidden', background: '#111' }}>
                      <img src={p.image} alt={p.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,0.6) 0%,transparent 60%)' }} />
                      {p.hasAudio && (
                        <div style={{ position: 'absolute', bottom: 6, left: 6, right: 6, background: 'rgba(0,0,0,0.75)', borderRadius: 100, padding: '2px 7px', fontSize: 8, color: '#ccc', display: 'flex', alignItems: 'center', gap: 4 }}>
                          ▶ <div style={{ flex: 1, height: 1, background: '#555' }} /> 0:45
                        </div>
                      )}
                    </div>
                    {/* Content */}
                    <div style={{ padding: '10px 12px' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.3, marginBottom: 7, color: '#eee' }}>{p.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 5 }}>
                        <span style={{ fontSize: 10, color: '#666' }}>Looking for:</span>
                        <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 100, background: p.roleBg, color: p.roleColor, fontWeight: 700 }}>{p.role}</span>
                      </div>
                      <div style={{ fontSize: 10, color: '#666', marginBottom: 10 }}>📍 {p.location}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {p.avSeeds.slice(0,3).map((seed, ai) => (
                            <img key={ai} src={dicebear(seed)} alt="" style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #1c1c1c', marginLeft: ai > 0 ? -7 : 0, background: '#1a1a1a' }} />
                          ))}
                          <span style={{ fontSize: 9, color: '#555', marginLeft: 6 }}>+{p.extra}</span>
                        </div>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div style={{ padding: '14px 13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#f0f0f0' }}>Messages</span>
                <span onClick={() => router.push('/auth?mode=register')} style={{ fontSize: 9, color: '#ff6b35', cursor: 'pointer', fontWeight: 600 }}>View all</span>
              </div>
              {DEMO_MESSAGES.map(m => (
                <div key={m.name} style={{ display: 'flex', gap: 9, marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #1e1e1e' }}>
                  <img src={dicebear(m.seed)} alt={m.name} style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: '#1a1a1a' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#f0f0f0' }}>{m.name}</span>
                      <span style={{ fontSize: 9, color: '#555' }}>{m.time}</span>
                    </div>
                    <div style={{ fontSize: 10, color: '#777', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{m.msg}</div>
                  </div>
                  {m.unread && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#ff6b35', marginTop: 4, flexShrink: 0 }} />}
                </div>
              ))}
              <div style={{ textAlign: 'center', marginTop: 6 }}>
                <span onClick={() => router.push('/auth?mode=register')} style={{ fontSize: 10, color: '#ff6b35', cursor: 'pointer', fontWeight: 600 }}>Go to Messages →</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RAND 1: How It Works | Why KrewStage | Featured Projects ── */}
      <div id="how" className="middle-grid-3" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 1.8fr', gap: 12, padding: '4px 40px 12px', maxWidth: 1400, margin: '0 auto' }}>

        {/* 1. How It Works */}
        <div style={s.panel}>
          <div style={{ ...s.sectionLabel, marginBottom: 16 }}>1. How It Works</div>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            {[
              { ic: '📝', label: 'Post or explore', desc: 'Share a demo, lyrics, beat, unfinished song, open band role, or live opportunity.' },
              { ic: '👥', label: 'Connect', desc: 'Find vocalists, producers, instrumentalists, lyricists, engineers, bands, and venues.' },
              { ic: '🎵', label: 'Create', desc: 'Collaborate and turn the project into a finished song or live-ready act.' },
              { ic: '🎤', label: 'Reach the stage', desc: 'Start bands, discover live opportunities, and connect with venues.' },
            ].map((step, i) => (
              <div key={step.ic} style={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 0 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', border: '2px solid #ff6b35', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, flexShrink: 0 }}>
                    <span style={{ fontSize: 16 }}>{step.ic}</span>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 4, textAlign: 'center' }}>{step.label}</div>
                  <div style={{ fontSize: 10, color: '#555', lineHeight: 1.4, textAlign: 'center', padding: '0 3px' }}>{step.desc}</div>
                </div>
                {i < 3 && <div style={{ color: '#2a2a2a', fontSize: 16, marginTop: 11, flexShrink: 0 }}>→</div>}
              </div>
            ))}
          </div>
        </div>

        {/* 2. Why KrewStage */}
        <div style={s.panel}>
          <div style={{ ...s.sectionLabel, marginBottom: 14 }}>2. Why KrewStage exists</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { ic: '👥', t: 'Talented musicians are isolated', d: 'Producers have beats but no vocalist. Lyricists have words but no melody. Musicians want bands but do not know how to find serious collaborators.' },
              { ic: '✕', t: 'Music projects stay unfinished', d: 'Great ideas often never become real songs because the right collaborators, structure, and communication are missing.' },
            ].map(s2 => (
              <div key={s2.t} style={{ display: 'flex', gap: 11 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>{s2.ic}</div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 4, lineHeight: 1.3 }}>{s2.t}</div>
                  <div style={{ fontSize: 10, color: '#555', lineHeight: 1.5 }}>{s2.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Featured Projects */}
        <div style={s.panel}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={s.sectionLabel}>3. Featured Projects</div>
            <span onClick={() => router.push('/projects')} style={{ fontSize: 10, color: '#ff6b35', cursor: 'pointer', fontWeight: 600 }}>View all</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 7 }}>
            {[
              { genre: 'POP',        label: 'Vocalist', title: 'Pop Ballad — Vocals Collab',       loc: 'Remote',       c: '#f472b6', img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&q=70' },
              { genre: 'FUNK',       label: 'Drummer',  title: 'Drummer Needed for Funk Project',  loc: 'Seattle, WA',  c: '#c084fc', img: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=300&q=70' },
              { genre: 'LO-FI',      label: 'Producer', title: 'Lo-Fi Producer Open to Collab',   loc: 'Remote',       c: '#4ade80', img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=300&q=70' },
              { genre: 'LIVE EVENT', label: 'Venue',    title: 'Indie Night at The Hollow',       loc: 'Brooklyn, NY', c: '#fbbf24', img: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=300&q=70' },
              { genre: 'COUNTRY',    label: 'Band',     title: 'Country Songwriter Seeking Band',  loc: 'Nashville',    c: '#fb923c', img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=70' },
            ].map(p => (
              <div key={p.title} onClick={() => router.push('/projects')} style={{ background: '#181818', border: '1px solid #222', borderRadius: 8, overflow: 'hidden', cursor: 'pointer' }}>
                <div style={{ height: 90, position: 'relative', overflow: 'hidden' }}>
                  <img src={p.img} alt={p.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,0.8),transparent 50%)' }} />
                  <div style={{ position: 'absolute', top: 4, left: 5 }}>
                    <span style={{ fontSize: 8, padding: '1px 5px', borderRadius: 3, background: 'rgba(0,0,0,0.75)', color: '#fff', fontWeight: 700, letterSpacing: '0.04em' }}>{p.genre}</span>
                  </div>
                  <div style={{ position: 'absolute', bottom: 5, left: 5 }}>
                    <span style={{ fontSize: 8, padding: '2px 6px', borderRadius: 100, background: `${p.c}35`, color: p.c, border: `1px solid ${p.c}55`, fontWeight: 700 }}>{p.label}</span>
                  </div>
                </div>
                <div style={{ padding: '7px 8px' }}>
                  <div style={{ fontSize: 9, fontWeight: 600, lineHeight: 1.3, color: '#ddd', marginBottom: 3 }}>{p.title}</div>
                  <div style={{ fontSize: 8, color: '#555' }}>📍 {p.loc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RAND 2: Find Collaborators | Features ── */}
      <div className="middle-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '0 40px 12px', maxWidth: 1400, margin: '0 auto' }}>

        {/* 4. Find collaborators */}
        <div style={s.panel}>
          <div style={{ ...s.sectionLabel, marginBottom: 12 }}>4. Find the right collaborators</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {ROLE_CHIPS.map(r => (
              <button key={r} onClick={() => router.push(`/discover?role=${r.toLowerCase()}`)} style={s.pill(activeRole === r)} onMouseEnter={() => setActiveRole(r)} onMouseLeave={() => setActiveRole('Vocalist')}>{r}</button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {DEMO_MEMBERS.map(m => (
              <div key={m.name} onClick={() => router.push('/discover')} style={{ background: '#181818', border: '1px solid #222', borderRadius: 10, padding: '14px 12px', cursor: 'pointer' }}>
                <img src={dicebear(m.seed)} alt={m.name} style={{ width: 44, height: 44, borderRadius: '50%', marginBottom: 8, background: '#1a1a1a' }} />
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{m.name}</div>
                <div style={{ fontSize: 11, color: '#ff6b35', marginBottom: 4, fontWeight: 500 }}>{m.role}</div>
                <div style={{ fontSize: 10, color: '#555', lineHeight: 1.3, marginBottom: 3 }}>{m.genres}</div>
                <div style={{ fontSize: 10, color: '#555', marginBottom: 8 }}>📍 {m.city}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e' }} />
                  <span style={{ fontSize: 10, color: '#4ade80', fontWeight: 500 }}>Open to Collab</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Features */}
        <div style={s.panel}>
          <div style={{ ...s.sectionLabel, marginBottom: 16 }}>5. Features built for musicians</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 3 }}>{f.title}</div>
                  <div style={{ fontSize: 11, color: '#555', lineHeight: 1.4 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RAND 3: Venues | CTA ── */}
      <div className="bottom-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '0 40px 32px', maxWidth: 1400, margin: '0 auto' }}>

        {/* Venues banner */}
        <div onClick={() => router.push('/venues')} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 14, padding: '28px 32px', cursor: 'pointer', position: 'relative', overflow: 'hidden', minHeight: 140 }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=60)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.25 }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8, lineHeight: 1.3, fontFamily: 'Syne,system-ui' }}>For venues and organizers</div>
            <div style={{ fontSize: 13, color: '#999', marginBottom: 20, lineHeight: 1.5 }}>Find artists, bands, and live-ready projects for your next event.</div>
            <button onClick={e => { e.stopPropagation(); router.push('/venues') }} style={{ background: '#ff6b35', border: 'none', borderRadius: 8, padding: '10px 22px', fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>Discover Artists</button>
          </div>
        </div>

        {/* CTA box */}
        <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 14, padding: '28px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 900, lineHeight: 1.2, marginBottom: 8, letterSpacing: '-0.5px', fontFamily: 'Syne,system-ui' }}>
            Your next song starts with the <span style={{ color: '#ff6b35' }}>right crew.</span>
          </div>
          <div style={{ fontSize: 13, color: '#666', marginBottom: 22, lineHeight: 1.5 }}>Join KrewStage and connect with creators, collaborators, bands, and venues worldwide.</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => router.push('/auth?mode=register')} style={{ background: '#ff6b35', border: 'none', borderRadius: 8, padding: '12px 24px', fontSize: 14, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>Post a Project</button>
            <button onClick={() => router.push('/projects')} style={{ background: 'transparent', border: '1px solid #2a2a2a', borderRadius: 8, padding: '12px 24px', fontSize: 14, color: '#ddd', cursor: 'pointer', fontWeight: 500 }}>Explore Projects</button>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{ borderTop: '1px solid #1a1a1a', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: '#ff6b35', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>🎤</div>
          <div>
            <div style={{ fontSize: 15 }}><span style={s.brandLogo}>Krew</span><span style={s.brandLogoOrange}>Stage</span></div>
            <div style={{ fontSize: 11, color: '#555', marginTop: 1 }}>Find your music crew. Build songs. <span style={{ color: '#ff6b35' }}>Reach the stage.</span></div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 18, color: '#555' }}>
          {[
            { href: 'https://instagram.com/krewstage', svg: <IG /> },
            { href: 'https://tiktok.com/@krewstage', svg: <TT /> },
            { href: 'https://youtube.com/@krewstage', svg: <YT /> },
            { href: 'https://discord.gg/krewstage', svg: <DC /> },
            { href: 'https://x.com/krewstage', svg: <X /> },
          ].map((s2, i) => (
            <a key={i} href={s2.href} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', display: 'flex' }}
              onMouseEnter={e => e.currentTarget.style.color = '#ff6b35'}
              onMouseLeave={e => e.currentTarget.style.color = '#555'}>
              {s2.svg}
            </a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {['About','Blog','Help Center','Terms','Privacy'].map(l => (
            <span key={l} onClick={() => router.push('/auth')} style={{ fontSize: 12, color: '#555', cursor: 'pointer' }}
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
