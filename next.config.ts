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
  // Optimize for production
  swcMinify: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // Improve static optimization
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default config;
