'use client'
export default function LoadingScreen() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', gap: 20 }}>
      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 28, color: 'var(--brand)' }}>
        Krew<span style={{ color: 'var(--text2)', fontWeight: 400 }}>Stage</span>
      </div>
      <div style={{ display: 'flex', gap: 7 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--brand)', animation: `ks-bounce 1.1s ease-in-out ${i * 0.18}s infinite` }} />
        ))}
      </div>
      <style>{`@keyframes ks-bounce { 0%,80%,100%{transform:scale(0.5);opacity:0.35} 40%{transform:scale(1);opacity:1} }`}</style>
    </div>
  )
}
