
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow images from any secure domain as requested
      },
    ],
  },
  // Increase server action timeout for video generation
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb', // Default is 1mb
      serverActionsTimeout: 120, // Default is 60 seconds
    },
  },
};

export default nextConfig;
