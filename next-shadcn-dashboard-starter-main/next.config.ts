import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,

  typescript: {
    ignoreBuildErrors: true
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
        ]
      }
    ];
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img.clerk.com', port: '' }
    ]
  },

  transpilePackages: ['geist'],

  compiler: {
    // Remove console.log in production for smaller bundle
    removeConsole: process.env.NODE_ENV === 'production'
  },

  // Turbopack-compatible cache
  experimental: {
    // Optimize server component rendering cache
    staleTimes: {
      dynamic: 30,  // 30s dynamic route cache
      static: 180   // 3min static route cache
    }
  }
};

export default nextConfig;
