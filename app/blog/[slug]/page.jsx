'use client'
export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'

const ARTICLES = {
  'how-to-find-collaborators': {
    category: 'Tips', categoryColor: '#4ade80',
    date: 'May 2, 2026', readTime: '4 min read',
    title: 'How to Write a Project Post That Actually Gets Responses',
    emoji: '📝',
    content: [
      { type: 'intro', text: 'Most musicians post projects and hear nothing back. It\'s not because nobody\'s interested — it\'s because the post doesn\'t give people enough to say yes to. Here\'s what the successful ones do differently.' },
      { type: 'h2', text: '1. Start with a clear title' },
      { type: 'p', text: 'Your title is the first thing people see. "Need vocalist" tells people almost nothing. "Dark pop track needs female vocalist — remote, paid" gives them everything they need to decide in two seconds.' },
      { type: 'h2', text: '2. Describe the sound, not just the genre' },
      { type: 'p', text: 'Saying "rock" covers everything from Taylor Swift to Slayer. Instead, say: "Think early Arctic Monkeys meets Radiohead. The track has a driving guitar riff and needs a baritone vocalist who can do both clean and gritty." Now people can picture exactly what you need.' },
      { type: 'h2', text: '3. Be specific about what you\'re offering' },
      { type: 'p', text: 'Is this paid? Is there a revenue split? Will the collaborator get a writing credit? Ambiguity kills momentum. Even if the answer is "this is for exposure only," say it upfront — the right person will still say yes.' },
      { type: 'h2', text: '4. Include a reference or demo' },
      { type: 'p', text: 'A 30-second rough demo is worth more than 300 words of description. Upload what you have — even a voice memo with guitar. It proves the idea is real and shows people what they\'re getting into.' },
      { type: 'h2', text: '5. Say where and how you want to work' },
      { type: 'p', text: 'Remote or in-person? What city? Async or live sessions? People need to know if this is logistically possible before they invest time in applying.' },
      { type: 'callout', text: 'The best project posts read like a job description written by a human, not a form. Be specific, be honest, and show that you\'ve thought it through.' },
    ],
  },
  'remote-music-collaboration': {
    category: 'Guide', categoryColor: '#60a5fa',
    date: 'Apr 28, 2026', readTime: '6 min read',
    title: 'The Complete Guide to Remote Music Collaboration in 2026',
    emoji: '🌍',
    content: [
      { type: 'intro', text: 'The pandemic changed how musicians work together — and most of those changes stuck. Remote collaboration is now a normal part of making music. Here\'s everything you need to do it well.' },
      { type: 'h2', text: 'File sharing and stems' },
      { type: 'p', text: 'Always share stems (individual tracks), not just a mixed bounce. Use a consistent naming convention: BPM_Key_TrackName. Dropbox and Google Drive work fine for most projects. For large sessions, WeTransfer is reliable.' },
      { type: 'h2', text: 'DAW compatibility' },
      { type: 'p', text: 'Agree on file formats before you start. If you\'re on Logic and your collaborator is on Ableton, you\'ll need to exchange audio stems rather than project files. Establish this in the first message.' },
      { type: 'h2', text: 'Async vs. live sessions' },
      { type: 'p', text: 'Async (exchanging files back and forth) works well for most recording tasks. Live sessions via Sonobus or JamKazam work for real-time playing but require good internet on both ends. Use video calls for feedback and direction.' },
      { type: 'h2', text: 'Giving and receiving feedback' },
      { type: 'p', text: 'Be specific. "I love it but it needs more energy" is not actionable. "Can you try the chorus again with more breath and slightly less vibrato?" is. Timestamp your notes when possible: "At 1:23, the guitar feels a bit buried."' },
      { type: 'h2', text: 'Contracts and agreements' },
      { type: 'p', text: 'Even for casual collabs, agree in writing on: who owns the master, how credits will be listed, and what happens if one party wants to release the track independently. A simple email thread is enough for small projects.' },
      { type: 'callout', text: 'The best remote collabs feel like a conversation. Communicate often, be responsive, and celebrate small wins together even when you\'re thousands of miles apart.' },
    ],
  },
  'vocalist-tips': {
    category: 'For Vocalists', categoryColor: '#f472b6',
    date: 'Apr 20, 2026', readTime: '3 min read',
    title: '5 Things Producers Look for When Choosing a Vocalist',
    emoji: '🎤',
    content: [
      { type: 'intro', text: 'You sent your demo. They never replied. Here\'s what producers actually listen for — and how to make sure your next submission gets a yes.' },
      { type: 'h2', text: '1. Tone and character' },
      { type: 'p', text: 'Producers aren\'t necessarily looking for the technically best voice. They\'re looking for the right voice for the track. A distinctive, character-filled tone will always beat a technically perfect but generic sound.' },
      { type: 'h2', text: '2. Pitch accuracy on the demo' },
      { type: 'p', text: 'Your demo doesn\'t need to be perfect — but it needs to show you can hold pitch. Record your demo in a quiet room, don\'t over-process, and don\'t submit something you know has pitch problems and plan to "fix in the session."' },
      { type: 'h2', text: '3. Professionalism in the message' },
      { type: 'p', text: 'How you apply says as much as how you sound. Read the project description carefully. Reference something specific from it. Keep your message short. Attach or link a relevant demo — not your full discography.' },
      { type: 'h2', text: '4. Versatility shown, not claimed' },
      { type: 'p', text: 'Don\'t say you can do "any genre." Show it. Send two demos in different styles. If you\'re applying for a pop track, send a pop demo — not your metal band recording from 2019.' },
      { type: 'h2', text: '5. Fast and clear communication' },
      { type: 'p', text: 'Producers are juggling multiple things. If they respond within a day, respond the same day. If you\'re unavailable, say so upfront. Reliability is underrated and will get you more work than raw talent alone.' },
      { type: 'callout', text: 'The easiest way to stand out: listen to what they made, tell them why your voice fits, and send a relevant demo. Most people don\'t do all three.' },
    ],
  },
  'venue-booking-guide': {
    category: 'For Venues', categoryColor: '#fbbf24',
    date: 'Apr 15, 2026', readTime: '5 min read',
    title: 'How Venues Can Use KrewStage to Book Better Artists',
    emoji: '🏛️',
    content: [
      { type: 'intro', text: 'Stop scrolling Instagram hoping to stumble on the right act. Here\'s how venues are using KrewStage to post open calls, filter by genre and location, and fill their calendars with quality artists.' },
      { type: 'h2', text: 'Set up your venue profile' },
      { type: 'p', text: 'Add your venue type, capacity, location, and the genres you typically host. A complete profile gets more inbound requests from artists who are a good fit — and filters out the ones who aren\'t.' },
      { type: 'h2', text: 'Post a Live Opportunity project' },
      { type: 'p', text: 'Use the "Live Opportunity" project type to post an open call. Describe the night, the capacity, the vibe, and what you\'re paying. Include a deadline. Artists will apply directly and you can review demos and profiles in one place.' },
      { type: 'h2', text: 'Browse musicians by genre and location' },
      { type: 'p', text: 'Use the Discover page to find musicians near you. Filter by genre, role, and availability. You can message anyone directly without waiting for them to apply.' },
      { type: 'h2', text: 'Build ongoing relationships' },
      { type: 'p', text: 'Follow artists you\'ve worked with before. KrewStage lets you build a roster of go-to performers over time. When a slot opens up, you already know who to call.' },
      { type: 'callout', text: 'The venues that get the best results post specific, detailed opportunities and respond to applications within 48 hours. Artists talk to each other — your reputation on the platform matters.' },
    ],
  },
  'producer-home-studio': {
    category: 'Production', categoryColor: '#a78bfa',
    date: 'Apr 8, 2026', readTime: '7 min read',
    title: 'Home Studio Setup for Producers Who Collaborate Online',
    emoji: '🎛️',
    content: [
      { type: 'intro', text: 'Your interface, DAW, and acoustic treatment matter — but so does your workflow. Here\'s how to set up your studio for seamless remote sessions and stem sharing.' },
      { type: 'h2', text: 'The essentials' },
      { type: 'p', text: 'You don\'t need a professional studio. You need: a decent audio interface (Focusrite Scarlett 2i2 or similar), studio monitors or quality headphones, a condenser or dynamic mic if you record vocalists, and a quiet room.' },
      { type: 'h2', text: 'Acoustic treatment on a budget' },
      { type: 'p', text: 'Heavy curtains, a bookshelf full of books, and a thick rug do more than most people realize. The worst thing in home recording is a reflective, boxy room. You don\'t need foam tiles — you need mass and irregularity.' },
      { type: 'h2', text: 'DAW and file organization' },
      { type: 'p', text: 'Use a consistent project template. Keep your session organized from the start: separate tracks by type (drums, bass, synths, vocals), use the same BPM naming from the first file you share, and always export stems at the project\'s sample rate.' },
      { type: 'h2', text: 'Setting up for remote vocalists' },
      { type: 'p', text: 'If you\'re sending a track to a vocalist to record at home, send a properly mixed guide track, a click track, and a PDF with the structure (verse, pre-chorus, chorus timings). The easier you make it for them, the better the performance.' },
      { type: 'h2', text: 'Version control' },
      { type: 'p', text: 'Name your files with version numbers: Track_v1, Track_v2_withVocals, Track_final_master. Never overwrite. Use a cloud folder that both collaborators have access to. Never send files over WhatsApp.' },
      { type: 'callout', text: 'A well-organized studio session makes collaboration feel effortless. The goal is for your collaborator to receive your files and immediately know what to do with them.' },
    ],
  },
  'krewstage-launch': {
    category: 'News', categoryColor: '#ff6b35',
    date: 'Apr 1, 2026', readTime: '2 min read',
    title: 'KrewStage Is Live — Find Your Music Crew Today',
    emoji: '🚀',
    content: [
      { type: 'intro', text: 'After months of building, testing, and listening to musicians across Romania and beyond, we\'re officially open. Here\'s what you can do on KrewStage starting today.' },
      { type: 'h2', text: 'Create your musician profile' },
      { type: 'p', text: 'Sign up and build your profile in under 2 minutes. Add your roles, genres, instruments, city, and a bio. Upload an audio demo to let collaborators hear your work before they reach out.' },
      { type: 'h2', text: 'Post a project' },
      { type: 'p', text: 'Have an unfinished track? Looking for a drummer for your band? Post a project and start getting applications from the right people. Projects are searchable by genre, role, and location.' },
      { type: 'h2', text: 'Find your crew' },
      { type: 'p', text: 'Browse musicians on the Discover page. Filter by role, genre, and availability. Message anyone directly. Follow profiles you want to keep an eye on.' },
      { type: 'h2', text: 'Connect with venues' },
      { type: 'p', text: 'Venues can create profiles, post live opportunities, and contact musicians directly. If you\'re a venue, we\'d love to have you — reach out at venues@krewstage.com.' },
      { type: 'callout', text: 'We\'re just getting started. If something doesn\'t work or you have an idea, tell us. The best features on KrewStage have come directly from musician feedback.' },
    ],
  },
}

export default function BlogArticlePage({ params }) {
  const router = useRouter()
  const slug = params?.slug
  const article = ARTICLES[slug]

  if (!article) {
    return (
      <div style={{ background: '#0d0d0d', color: '#f0f0f0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
          <h1 style={{ fontFamily: 'Syne, system-ui', color: '#fff', marginBottom: 8 }}>Article not found</h1>
          <button onClick={() => router.push('/blog')} style={{ background: '#ff6b35', border: 'none', borderRadius: 8, padding: '10px 24px', color: '#fff', fontWeight: 700, cursor: 'pointer', marginTop: 16 }}>← Back to Blog</button>
        </div>
      </div>
    )
  }

  const OTHER = Object.entries(ARTICLES).filter(([s]) => s !== slug).slice(0, 3)

  return (
    <div style={{ background: '#0d0d0d', color: '#f0f0f0', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Back button */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '28px 32px 0' }}>
        <button onClick={() => router.push('/blog')}
          style={{ background: 'transparent', border: '1px solid #1e1e1e', borderRadius: 8, padding: '7px 14px', fontSize: 13, color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#ff6b35'; e.currentTarget.style.color = '#ff6b35' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e1e'; e.currentTarget.style.color = '#888' }}>
          ← Blog
        </button>
      </div>

      {/* Header */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 32px 40px' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100, background: `${article.categoryColor}22`, color: article.categoryColor, border: `1px solid ${article.categoryColor}44` }}>{article.category}</span>
          <span style={{ fontSize: 12, color: '#444' }}>{article.date}</span>
          <span style={{ fontSize: 12, color: '#444' }}>·</span>
          <span style={{ fontSize: 12, color: '#444' }}>{article.readTime}</span>
        </div>
        <div style={{ fontSize: 52, marginBottom: 20 }}>{article.emoji}</div>
        <h1 style={{ fontFamily: 'Syne, system-ui', fontWeight: 800, fontSize: 'clamp(26px, 4vw, 40px)', letterSpacing: '-1px', color: '#fff', lineHeight: 1.15, marginBottom: 0 }}>{article.title}</h1>
      </div>

      {/* Divider */}
      <div style={{ maxWidth: 760, margin: '0 auto 0', padding: '0 32px' }}>
        <div style={{ height: 1, background: 'linear-gradient(90deg, #ff6b35 0%, #1e1e1e 60%)' }} />
      </div>

      {/* Content */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 32px 64px' }}>
        {article.content.map((block, i) => {
          if (block.type === 'intro') return (
            <p key={i} style={{ fontSize: 18, color: '#bbb', lineHeight: 1.75, marginBottom: 40, fontWeight: 400 }}>{block.text}</p>
          )
          if (block.type === 'h2') return (
            <h2 key={i} style={{ fontFamily: 'Syne, system-ui', fontWeight: 700, fontSize: 22, color: '#fff', marginTop: 44, marginBottom: 14, letterSpacing: '-0.3px' }}>{block.text}</h2>
          )
          if (block.type === 'p') return (
            <p key={i} style={{ fontSize: 15, color: '#777', lineHeight: 1.85, marginBottom: 20 }}>{block.text}</p>
          )
          if (block.type === 'callout') return (
            <div key={i} style={{ margin: '40px 0', padding: '20px 24px', background: '#111', borderLeft: '3px solid #ff6b35', borderRadius: '0 12px 12px 0' }}>
              <p style={{ fontSize: 15, color: '#ccc', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>{block.text}</p>
            </div>
          )
          return null
        })}

        {/* CTA */}
        <div style={{ marginTop: 56, padding: '32px 28px', background: '#111', border: '1px solid #1e1e1e', borderRadius: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>🎸</div>
          <h3 style={{ fontFamily: 'Syne, system-ui', fontWeight: 700, fontSize: 20, color: '#fff', marginBottom: 8 }}>Ready to find your crew?</h3>
          <p style={{ color: '#555', fontSize: 14, marginBottom: 20 }}>Join musicians, producers, and venues already on KrewStage.</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => router.push('/auth?mode=register')} style={{ background: '#ff6b35', border: 'none', borderRadius: 8, padding: '11px 24px', fontSize: 14, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Join Free</button>
            <button onClick={() => router.push('/discover')} style={{ background: 'transparent', border: '1px solid #2a2a2a', borderRadius: 8, padding: '11px 24px', fontSize: 14, color: '#ccc', cursor: 'pointer' }}>Browse Musicians</button>
          </div>
        </div>

        {/* Other articles */}
        {OTHER.length > 0 && (
          <div style={{ marginTop: 56 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#ff6b35', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>More articles</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
              {OTHER.map(([s, a]) => (
                <div key={s} onClick={() => router.push(`/blog/${s}`)}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#ff6b35'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e1e'}
                  style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: '20px 18px', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{a.emoji}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100, display: 'inline-block', background: `${a.categoryColor}22`, color: a.categoryColor, border: `1px solid ${a.categoryColor}44`, marginBottom: 10 }}>{a.category}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#e0e0e0', lineHeight: 1.4 }}>{a.title}</div>
                  <div style={{ marginTop: 10, fontSize: 12, color: '#ff6b35', fontWeight: 600 }}>Read →</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
