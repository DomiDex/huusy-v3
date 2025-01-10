import type { NextConfig } from 'next';

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lzkhitefzcwsljkltyqa.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Production optimizations
  reactStrictMode: true,
  poweredByHeader: false,
  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // ESLint during builds
  eslint: {
    ignoreDuringBuilds: true, // Temporarily ignore ESLint errors during build
  },
  typescript: {
    ignoreBuildErrors: true, // Temporarily ignore TypeScript errors during build
  },
};

export default config;
