import { config } from 'dotenv'
import 'dotenv/config'
import { defineConfig, env, type PrismaConfig } from 'prisma/config'

// Load .env before defining the config
config()
export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('POSTGRES_PRISMA_URL'),
  },
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
}) satisfies PrismaConfig
