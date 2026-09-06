import Redis from 'ioredis'

export const redisClient = new Redis(process.env.REDIS_URL ?? '') // Uses default options for Redis connection

redisClient.on('error', (error) => {
  console.info(error)
})
