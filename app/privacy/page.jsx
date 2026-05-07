'use client'
export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'

const SECTIONS = [
  {
    title: '1. Who We Are',
    content: `KrewStage is operated by KrewStage SRL, based in Bucharest, Romania. We are the data controller for the personal information you provide when using our Platform.

Contact: privacy@krewstage.com`,
  },
  {
    title: '2. What Data We Collect',
    content: `When you create an account and use KrewStage, we collect the following types of information:

Account information: Your name, email address, and password (stored encrypted).

Profile information: Your city, country, bio, musical roles, genres, instruments, experience level, social links, and profile photo — all provided voluntarily by you.

Usage data: Pages visited, features used, and time spent on the Platform.

Communications: Messages you send to other users through the Platform, and project applications.

Audio and media: Audio demos you upload to your profile.

Technical data: IP address, browser type, and device information for security and analytics purposes.`,
  },
  {
    title: '3. How We Use Your Data',
    content: `We use your data to:

• Operate and improve the KrewStage platform
• Display your public profile to other users
• Facilitate connections between musicians and venues
• Send you notifications about messages, applications, and platform activity
• Prevent fraud, abuse, and ensure platform security
• Comply with legal obligations

We do not sell your personal data to third parties.`,
  },
  {
    title: '4. Data Sharing',
    content: `Your public profile information (name, bio, roles, genres, city, avatar) is visible to all users and visitors of KrewStage.

Your email address and private messages are never visible to other users.

We use the following third-party service providers who may process your data:
• Supabase — database and authentication infrastructure
• Vercel — hosting and deployment
• Cloudflare — content delivery and media storage

These providers process data only as necessary to operate the Platform and are bound by appropriate data processing agreements.`,
  },
  {
    title: '5. Data Storage & Security',
    content: `Your data is stored on servers within the European Union (Supabase EU region). We implement industry-standard security measures including encrypted connections (HTTPS), row-level security on our database, and encrypted password storage.

No system is 100% secure. If you believe your account has been compromised, contact us immediately at security@krewstage.com.`,
  },
  {
    title: '6. Your Rights (GDPR)',
    content: `If you are located in the European Economic Area, you have the following rights regarding your personal data:

Right of access: Request a copy of the data we hold about you.
Right to rectification: Correct inaccurate data.
Right to erasure: Request deletion of your data ("right to be forgotten").
Right to portability: Receive your data in a machine-readable format.
Right to object: Object to processing of your data.
Right to withdraw consent: Where processing is based on consent, you may withdraw it at any time.

To exercise these rights, contact us at privacy@krewstage.com. We will respond within 30 days.`,
  },
  {
    title: '7. Cookies',
    content: `KrewStage uses cookies and similar technologies to:
• Keep you logged in between sessions
• Remember your preferences
• Analyze how the Platform is used (analytics)

You can control cookies through your browser settings. Disabling cookies may affect some Platform functionality.`,
  },
  {
    title: '8. Data Retention',
    content: `We retain your personal data for as long as your account is active. If you delete your account, we will delete your personal data within 30 days, except where we are required to retain it for legal compliance purposes.

Messages sent to other users may be retained in the recipient's account history.`,
  },
  {
    title: '9. Children\'s Privacy',
    content: `KrewStage is not intended for users under 16 years of age. We do not knowingly collect personal data from children under 16. If we become aware that we have collected such data, we will delete it promptly.`,
  },
  {
    title: '10. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. We will notify you of significant changes via email or a prominent notice on the Platform. The date at the top of this page shows when the policy was last updated.`,
  },
  {
    title: '11. Contact & Complaints',
    content: `For privacy-related questions or requests, contact us at:

privacy@krewstage.com
KrewStage SRL, Bucharest, Romania

If you are unsatisfied with our response, you have the right to lodge a complaint with the Romanian Data Protection Authority (ANSPDCP) at www.dataprotection.ro.`,
  },
]

export default function PrivacyPage() {
  const router = useRouter()

  return (
    <div style={{ background: '#0d0d0d', color: '#f0f0f0', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '72px 32px 48px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#ff6b35', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Legal</div>
        <h1 style={{ fontFamily: 'Syne, system-ui', fontWeight: 800, fontSize: 'clamp(28px, 5vw, 44px)', letterSpacing: '-1px', color: '#fff', marginBottom: 16 }}>Privacy Policy</h1>
        <p style={{ color: '#555', fontSize: 14 }}>Last updated: May 1, 2026</p>
        <div style={{ marginTop: 24, padding: '16px 20px', background: '#111', border: '1px solid #1e1e1e', borderRadius: 10, borderLeft: '3px solid #4ade80' }}>
          <p style={{ color: '#888', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
            Your privacy matters to us. This policy explains what data we collect, how we use it, and what rights you have as a user. KrewStage is GDPR compliant.
          </p>
        </div>

        {/* Quick summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginTop: 24 }}>
          {[
            { icon: '🚫', text: 'We never sell your data' },
            { icon: '🇪🇺', text: 'Data stored in the EU' },
            { icon: '🔒', text: 'Encrypted & secure' },
            { icon: '✉️', text: 'GDPR compliant' },
          ].map(item => (
            <div key={item.text} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#999' }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 32px 80px' }}>
        {SECTIONS.map((section, i) => (
          <div key={i} style={{ marginBottom: 40, paddingBottom: 40, borderBottom: i < SECTIONS.length - 1 ? '1px solid #1a1a1a' : 'none' }}>
            <h2 style={{ fontFamily: 'Syne, system-ui', fontWeight: 700, fontSize: 18, color: '#fff', marginBottom: 14, letterSpacing: '-0.2px' }}>{section.title}</h2>
            <div style={{ color: '#666', fontSize: 14, lineHeight: 1.85, whiteSpace: 'pre-line' }}>{section.content}</div>
          </div>
        ))}


      </div>

    </div>
  )
}
