'use client'
export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const FAQS = [
  {
    category: 'Getting Started',
    icon: '🚀',
    items: [
      { q: 'How do I create an account?', a: 'Click "Sign Up" in the top right corner. Enter your email and password, then complete your profile with your roles, genres, and location. It takes less than 2 minutes.' },
      { q: 'Is KrewStage free to use?', a: 'Yes — the core features are completely free. You can create a profile, browse musicians, post projects, and message collaborators at no cost. We may introduce a Pro tier in the future with advanced features.' },
      { q: 'What is KrewStage for?', a: 'KrewStage is a platform for musicians to find collaborators, form bands, post projects, and connect with venues. Whether you need a vocalist for your EP or a drummer for live gigs, KrewStage helps you find the right person.' },
    ],
  },
  {
    category: 'Profile & Settings',
    icon: '👤',
    items: [
      { q: 'How do I edit my profile?', a: 'Log in and click your avatar in the top right, then select "Edit Profile". You can update your bio, roles, genres, instruments, social links, and profile picture.' },
      { q: 'Can I be both a musician and a venue?', a: 'Yes. In Edit Profile, you can toggle "I represent a venue" to add venue details while keeping your musician profile. Both will be visible on your public profile.' },
      { q: 'How do I upload a profile photo?', a: 'In Edit Profile, click on your avatar to upload a photo. We accept JPG, PNG, and WebP files. If you don\'t upload one, a unique illustrated avatar is generated for you automatically.' },
      { q: 'How do I add audio demos to my profile?', a: 'In Edit Profile, scroll to the Audio section and upload your audio files. MP3 and WAV formats are supported. These appear on your public profile so collaborators can hear your work.' },
    ],
  },
  {
    category: 'Projects',
    icon: '🎵',
    items: [
      { q: 'How do I post a project?', a: 'Log in and click "+ New Project" from the Projects page. Fill in the title, description, genre, what roles you need, and whether it\'s remote or local. Your project will be visible to all users immediately.' },
      { q: 'How do I apply to a project?', a: 'Open any project and click the "Apply" tab. Select the role you\'re applying for, write a message, and optionally add a demo URL. The project owner will be notified and can accept or decline.' },
      { q: 'Can I delete or close my project?', a: 'Yes. Open your project and change the status to "Closed" or "Completed". Closed projects are hidden from search but remain in your profile.' },
      { q: 'What\'s the difference between project types?', a: '"Collaboration" is for working together on a song or recording. "Live Opportunity" is for venues or events looking for artists. "Band Search" is for forming a long-term band. "Session Work" is for one-off recording sessions.' },
    ],
  },
  {
    category: 'Messaging & Connections',
    icon: '💬',
    items: [
      { q: 'How do I message someone?', a: 'Open any musician\'s profile and click "Message". If you\'re not logged in, you\'ll be asked to create an account first. All messages are in the Messages section of your dashboard.' },
      { q: 'Can venues contact musicians directly?', a: 'Yes. Venues can message any musician from their profile, or post a Live Opportunity project and wait for musicians to apply.' },
      { q: 'How do I follow a musician or venue?', a: 'Click the "Follow" button on their profile. You\'ll see their activity and projects in the future. They\'ll be notified that you followed them.' },
    ],
  },
  {
    category: 'Bands',
    icon: '🎸',
    items: [
      { q: 'How do I create a band?', a: 'Go to the Bands page and click "+ Create Band". Add a name, genre, description, and city. Then invite members by searching for their username or name.' },
      { q: 'How do I join a band?', a: 'Open a band\'s page and click "Request to Join". The band owner will receive a notification and can accept or decline your request.' },
      { q: 'Can I be in multiple bands?', a: 'Yes, there is no limit to how many bands you can join or create.' },
    ],
  },
]

export default function HelpPage() {
  const router = useRouter()
  const [openItem, setOpenItem] = useState(null)

  return (
    <div style={{ background: '#0d0d0d', color: '#f0f0f0', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '72px 32px 48px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#ff6b35', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Help Center</div>
        <h1 style={{ fontFamily: 'Syne, system-ui', fontWeight: 800, fontSize: 'clamp(32px, 5vw, 48px)', letterSpacing: '-1.5px', color: '#fff', marginBottom: 16 }}>
          How can we help?
        </h1>
        <p style={{ color: '#666', fontSize: 16 }}>Find answers to common questions about KrewStage.</p>
      </div>

      {/* Quick links */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 32px 56px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
          {FAQS.map(section => (
            <button key={section.category}
              onClick={() => document.getElementById(section.category)?.scrollIntoView({ behavior: 'smooth' })}
              style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: '16px 12px', cursor: 'pointer', textAlign: 'center', transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#ff6b35'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e1e'}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{section.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#ccc' }}>{section.category}</div>
            </button>
          ))}
        </div>
      </div>

      {/* FAQ sections */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 32px 80px' }}>
        {FAQS.map(section => (
          <div key={section.category} id={section.category} style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <span style={{ fontSize: 20 }}>{section.icon}</span>
              <h2 style={{ fontFamily: 'Syne, system-ui', fontWeight: 700, fontSize: 20, color: '#fff' }}>{section.category}</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {section.items.map((item, i) => {
                const key = `${section.category}-${i}`
                const isOpen = openItem === key
                return (
                  <div key={i}
                    style={{ background: '#111', border: `1px solid ${isOpen ? '#ff6b35' : '#1e1e1e'}`, borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.2s' }}>
                    <button onClick={() => setOpenItem(isOpen ? null : key)}
                      style={{ width: '100%', padding: '18px 20px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, textAlign: 'left' }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#e0e0e0' }}>{item.q}</span>
                      <span style={{ fontSize: 18, color: '#ff6b35', flexShrink: 0, transition: 'transform 0.2s', transform: isOpen ? 'rotate(45deg)' : 'rotate(0)' }}>+</span>
                    </button>
                    {isOpen && (
                      <div style={{ padding: '0 20px 18px' }}>
                        <p style={{ fontSize: 14, color: '#666', lineHeight: 1.75, margin: 0 }}>{item.a}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* Contact */}
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 16, padding: '36px 32px', textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>💬</div>
          <h3 style={{ fontFamily: 'Syne, system-ui', fontWeight: 700, fontSize: 20, color: '#fff', marginBottom: 8 }}>Still need help?</h3>
          <p style={{ color: '#555', fontSize: 14, marginBottom: 20 }}>Can't find what you're looking for? Send us a message.</p>
          <a href="mailto:support@krewstage.com"
            style={{ display: 'inline-block', background: '#ff6b35', border: 'none', borderRadius: 10, padding: '12px 28px', fontSize: 14, fontWeight: 700, color: '#fff', textDecoration: 'none', cursor: 'pointer' }}>
            Contact Support
          </a>
        </div>
      </div>

    </div>
  )
}
