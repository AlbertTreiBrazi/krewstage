/** @type {import('next').NextConfig} */
const nextConfig = {
  // Forteaza rendering dinamic pentru toate paginile
  // (necesar deoarece folosim Supabase client-side si hooks)
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'videodelivery.net' },
    ],
  },
}

module.exports = nextConfig
