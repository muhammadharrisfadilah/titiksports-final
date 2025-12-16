/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize images dari Fotmob
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.fotmob.com',
        pathname: '/image_resources/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },

  // Headers untuk security & SEO
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
        ],
      },
    ];
  },

  // Rewrites untuk API proxy (proteksi API)
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://www.fotmob.com/api/:path*',
      },
    ];
  },

  // Compression
  compress: true,

  // Optimisasi production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Power by header removal
  poweredByHeader: false,

  // React strict mode
  reactStrictMode: true,

  // SWC minify (faster than Terser)
  swcMinify: true,

  // Experimental features
  experimental: {
    optimizeCss: true,
  },
};

module.exports = nextConfig;