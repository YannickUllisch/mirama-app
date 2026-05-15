/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js'],
  output: 'standalone',
  serverExternalPackages: ['sequelize', 'pino', 'pino-pretty'],
  cacheComponents: true,
  async rewrites() {
    const backend = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:8080'
    return [
      {
        source: '/api/v1/:path*',
        destination: `${backend}/api/v1/:path*`,
      },
    ]
  },
}

export default nextConfig
