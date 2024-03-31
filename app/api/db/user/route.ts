import type { User } from '@prisma/client'
import { db } from '@src/lib/db'
import type { NextRequest } from 'next/server'

export const POST = async (req: NextRequest) => {
  const user = (await req.json()) as Omit<User, 'id'>

  const response = await db.user.create({
    data: {
      ...user,
      id: undefined,
    },
  })

  return new Response(
    JSON.stringify({
      ok: true,
      message: 'Successfully created User',
      data: response,
    }),
  )
}

/**
 * Fetches Users from the Database, either single users or all users.
 * @param req The Request sent to this URL
 * @returns
 */
export const GET = async (_req: NextRequest) => {
  // If none of the above flags are provided, return all users.
  const response = await db.user.findMany()

  return new Response(JSON.stringify(response))
}
