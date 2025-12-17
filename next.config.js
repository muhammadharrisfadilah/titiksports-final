/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ OPTIMIZE images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.fotmob.com',
        pathname: '/image_resources/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  // ✅ ADD THIS: Copy service worker to public
  async rewrites() {
    return [
      // Your existing rewrites...
    ];
  },

  // ✅ SECURITY & SEO headers
  async headers() {
    return [
        {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, immutable',
          },
        ],
      },
      // ✅ Cache static assets aggressively
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // ✅ NO MORE REWRITES - Client calls Fotmob API directly!
  // This saves serverless function costs

  // ✅ Compression
  compress: true,

  // ✅ Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // ✅ Power by header removal
  poweredByHeader: false,

  // ✅ React strict mode
  reactStrictMode: true,

  // ✅ SWC minify (faster than Terser)
  swcMinify: true,

  // ✅ Experimental features
  experimental: {
    // ✅ Disable optimizeCss to avoid critters error
    optimizeCss: false,
    
    // ✅ Enable optimizePackageImports for tree shaking
    optimizePackageImports: ['date-fns', 'axios', '@tanstack/react-query'],
  },

  // ✅ TypeScript and ESLint
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;