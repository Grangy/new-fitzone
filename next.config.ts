import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Оптимизация для современных браузеров
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Оптимизация сборки
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  
  // Оптимизация JavaScript для современных браузеров
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Настройки для уменьшения размера бандла
  webpack: (config, { dev, isServer }) => {
    // Оптимизация для современных браузеров
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'react/jsx-runtime.js': 'react/jsx-runtime',
        'react/jsx-dev-runtime.js': 'react/jsx-dev-runtime',
      };
    }
    
    return config;
  },
  
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
        ],
      },
    ];
  },
};

export default nextConfig;
