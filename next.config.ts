import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // devIndicators: true,
  images: {
    domains: ['https://zmxzgpqsrsjcemtlpcmu.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zmxzgpqsrsjcemtlpcmu.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
