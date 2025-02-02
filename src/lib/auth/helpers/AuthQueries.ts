import { PrismaClient } from '@prisma/client'

// Initialize a new Client to avoid REDIS caching.
const client = new PrismaClient()

export const getUserByEmail = async (email: string) => {
  try {
    const user = await client.user.findUnique({ where: { email } })

    return user
  } catch {
    return null
  }
}

export const getUserById = async (id: string) => {
  try {
    const user = await client.user.findUnique({ where: { id } })

    return user
  } catch {
    return null
  }
}
