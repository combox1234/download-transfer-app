import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['date-fns'],
  typescript: {
    ignoreBuildErrors: false,
  },
}

export default nextConfig
