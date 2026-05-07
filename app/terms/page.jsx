'use client'
export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing or using KrewStage ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform.

KrewStage is operated by KrewStage SRL, registered in Romania. These terms apply to all users of the Platform, including musicians, producers, venues, and visitors.`,
  },
  {
    title: '2. Eligibility',
    content: `You must be at least 16 years old to create an account on KrewStage. By creating an account, you represent that you meet this age requirement.

You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.`,
  },
  {
    title: '3. User Content',
    content: `You retain ownership of all content you post on KrewStage, including profile information, project descriptions, audio demos, and messages.

By posting content on KrewStage, you grant us a non-exclusive, royalty-free license to display and distribute that content within the Platform for the purpose of operating the service.

You are solely responsible for the content you post. You agree not to post content that is illegal, harmful, defamatory, or that infringes the intellectual property rights of others.`,
  },
  {
    title: '4. Prohibited Conduct',
    content: `You agree not to:
• Create fake or misleading profiles
• Spam other users with unsolicited messages
• Use the Platform to harass, threaten, or harm other users
• Post copyrighted material without permission
• Attempt to access other users' accounts
• Use automated scripts or bots to interact with the Platform
• Use the Platform for any illegal purpose`,
  },
  {
    title: '5. Music Collaboration',
    content: `KrewStage is a platform for discovery and connection only. We do not mediate or manage agreements between collaborators. Any contracts, revenue splits, or creative arrangements made between users are solely between those users.

We strongly recommend that collaborators agree on terms in writing before beginning a project, particularly regarding ownership, credits, and revenue sharing.`,
  },
  {
    title: '6. Intellectual Property',
    content: `The KrewStage platform, logo, design, and code are owned by KrewStage SRL and protected by applicable intellectual property laws.

User-generated content remains the property of the respective users. KrewStage does not claim ownership over music, audio demos, or creative work uploaded to the Platform.`,
  },
  {
    title: '7. Termination',
    content: `We reserve the right to suspend or terminate your account at any time if we determine you have violated these Terms of Service. You may also delete your account at any time by contacting us at support@krewstage.com.

Upon termination, your public profile and content will be removed from the Platform.`,
  },
  {
    title: '8. Disclaimers & Limitation of Liability',
    content: `KrewStage is provided "as is" without warranties of any kind. We do not guarantee that the Platform will be uninterrupted, error-free, or secure.

To the maximum extent permitted by law, KrewStage SRL shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Platform.`,
  },
  {
    title: '9. Governing Law',
    content: `These Terms are governed by the laws of Romania. Any disputes arising from these terms shall be resolved in the courts of Bucharest, Romania.`,
  },
  {
    title: '10. Changes to Terms',
    content: `We may update these Terms from time to time. If we make significant changes, we will notify users via email or a prominent notice on the Platform. Continued use of the Platform after changes constitutes acceptance of the new terms.`,
  },
  {
    title: '11. Contact',
    content: `If you have questions about these Terms, please contact us at:

KrewStage SRL
Bucharest, Romania
Email: legal@krewstage.com`,
  },
]

export default function TermsPage() {
  const router = useRouter()

  return (
    <div style={{ background: '#0d0d0d', color: '#f0f0f0', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '72px 32px 48px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#ff6b35', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Legal</div>
        <h1 style={{ fontFamily: 'Syne, system-ui', fontWeight: 800, fontSize: 'clamp(28px, 5vw, 44px)', letterSpacing: '-1px', color: '#fff', marginBottom: 16 }}>Terms of Service</h1>
        <p style={{ color: '#555', fontSize: 14 }}>Last updated: May 1, 2026</p>
        <div style={{ marginTop: 24, padding: '16px 20px', background: '#111', border: '1px solid #1e1e1e', borderRadius: 10, borderLeft: '3px solid #ff6b35' }}>
          <p style={{ color: '#888', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
            Please read these terms carefully before using KrewStage. By using our platform, you agree to these terms. If you have any questions, contact us at <a href="mailto:legal@krewstage.com" style={{ color: '#ff6b35' }}>legal@krewstage.com</a>.
          </p>
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
