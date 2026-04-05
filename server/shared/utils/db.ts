import { PrismaClient } from '@/prisma/generated/client'
import { PrismaPg } from '@prisma/adapter-pg'
import Redis from 'ioredis'
import SuperJSON from 'superjson'
import { RedisAdapter } from './redis/Adapters/redis-adapter'
import createPrismaRedisCache from './redis/index'

export const redisClient = new Redis(process.env.REDIS_URL ?? '') // Uses default options for Redis connection

redisClient.on('error', (error) => {
  console.info(error)
})

const prismaClientSingleton = () => {
  const adapter = new PrismaPg({
    connectionString: process.env.POSTGRES_PRISMA_URL,
  })
  const prismaClient = new PrismaClient({ adapter })

  const redisAdapter = new RedisAdapter({
    client: redisClient,
    cacheTime: 300,
    transformer: {
      serialize: (value) => SuperJSON.serialize(value),
      deserialize: (value) => SuperJSON.deserialize(value),
    },
  })

  const cacheMiddleware = createPrismaRedisCache({
    models: [
      {
        model: 'Task',
        cacheTime: 60,
      },
      {
        model: 'Project',
        cacheTime: 60 * 5, // 15 mins
      },
      {
        model: 'Team',
        cacheTime: 60 * 60, // 1 hour, it is very uncommon for this to change. It is however queried quite often.
      },
      {
        model: 'Milestone',
        cacheTime: 60 * 15, // 15 minutes
      },
      {
        model: 'Tag',
        cacheTime: 60 * 60, // 1 hour
      },
      {
        model: 'OrganizationInvitation',
        cacheTime: 60 * 60, // 1 hour
      },
      {
        model: 'Expense',
        cacheTime: 60 * 15, // 15 minutes
      },
    ],
    adapter: redisAdapter,
    excludeModels: ['Notification', 'VerificationToken', 'Account'],
    prefix: `${process.env.NEXT_PUBLIC_ENV}~`, // Prefix with the environment because the redis is shared between
  })
  return prismaClient.$extends(cacheMiddleware)
}

let db: ReturnType<typeof prismaClientSingleton>

// If we are in development mode (Next.js hot-reloading), reuse the Prisma client to avoid multiple instances
if (process.env.NODE_ENV === 'development') {
  if (!(global as unknown as any).prisma) {
    ;(global as unknown as any).prisma = prismaClientSingleton()
  }
  db = (global as unknown as any).prisma
} else {
  db = prismaClientSingleton()
}

export default db
