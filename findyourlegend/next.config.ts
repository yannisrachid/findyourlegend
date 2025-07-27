import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Completely disable ESLint during builds
    ignoreDuringBuilds: true,
    dirs: [], // Don't lint any directories
  },
  typescript: {
    // Disable TypeScript errors during builds
    ignoreBuildErrors: true,
  },
  // Prevent static generation of dynamic API routes during build
  trailingSlash: false,
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'commons.wikimedia.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.wikipedia.org',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
