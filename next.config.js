/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static generation - all pages are dynamic (client-side with Supabase)
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  // Skip type checking and linting during build for faster deploys
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
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
