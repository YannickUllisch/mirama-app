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
export const GET = async (req: NextRequest) => {
  const id = req.nextUrl.searchParams.get('id') as string
  const email = req.nextUrl.searchParams.get('email') as string

  // If Email is given in query, find user with specific email
  if (email) {
    const response = db.user.findFirst({
      where: {
        email,
      },
    })
    return new Response(JSON.stringify(response))
  }
  // If ID is given in query, find user with specific ID
  if (id) {
    const response = db.user.findFirst({
      where: {
        id,
      },
    })
    return new Response(JSON.stringify(response))
  }

  // If none of the above flags are provided, return all users.
  const response = await db.user.findMany()

  return new Response(JSON.stringify(response))
}
