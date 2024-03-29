import type { User } from '@prisma/client'
import { db } from '@src/lib/db'

export const POST = async (req: Request) => {
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

export const GET = async (_req: Request) => {
  const response = await db.user.findMany()

  return new Response(JSON.stringify(response))
}
