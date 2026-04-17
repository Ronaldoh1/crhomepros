/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'crhomepros.web.app',
      },
    ],
  },
  async rewrites() {
    return [
      // Proxy /images/logo.png → Firebase Storage site/logo.png
      {
        source: '/images/logo.png',
        destination: 'https://firebasestorage.googleapis.com/v0/b/crhomepros.firebasestorage.app/o/site%2Flogo.png?alt=media',
      },
      {
        source: '/images/og-image.jpg',
        destination: 'https://firebasestorage.googleapis.com/v0/b/crhomepros.firebasestorage.app/o/site%2Flogo.png?alt=media',
      },
      // Proxy /images/team-* → Firebase Storage team/*
      {
        source: '/images/team-:slug*',
        destination: 'https://firebasestorage.googleapis.com/v0/b/crhomepros.firebasestorage.app/o/team%2Fteam-:slug*?alt=media',
      },
      // Proxy /images/blog/* → Firebase Storage blog/*
      {
        source: '/images/blog/:path*',
        destination: 'https://firebasestorage.googleapis.com/v0/b/crhomepros.firebasestorage.app/o/blog%2F:path*?alt=media',
      },
    ]
  },
}

module.exports = nextConfig
