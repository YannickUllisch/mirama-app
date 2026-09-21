import { config } from 'dotenv'
import type { PrismaConfig } from 'prisma'
import { defineConfig } from 'prisma/config'

// Load .env before defining the config
config()
export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL ?? '',
  },
  experimental: {
    extensions: true,
  },
}) satisfies PrismaConfig
