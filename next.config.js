/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Previne clickjacking
          { key: 'X-Frame-Options', value: 'DENY' },
          // Previne MIME sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Referrer policy
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // XSS protection
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          // Permissions policy
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'videodelivery.net' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
    ],
  },
}

module.exports = nextConfig
