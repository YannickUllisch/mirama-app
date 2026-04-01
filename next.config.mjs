/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js'],
  output: 'standalone',
  serverExternalPackages: ['sequelize', 'pino', 'pino-pretty'],
}

export default nextConfig
