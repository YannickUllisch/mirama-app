import { auth } from '@/auth'
import { db } from '@/src/lib/db'
import type { Role } from '@prisma/client'

export const GET = auth(async (req) => {
  try {
    const session = req.auth

    if (!session) {
      return Response.json(
        {},
        { status: 401, statusText: 'You need to be Logged In' },
      )
    }
    if (!session.user.role) {
      return Response.json(
        {},
        { status: 401, statusText: 'You Need to be in Team' },
      )
    }

    const response = await db.user.findMany({
      where: {
        teamId: session?.user.teamId,
      },
    })

    return new Response(JSON.stringify(response))
  } catch (err) {
    return new Response(JSON.stringify(err))
  }
})

export const DELETE = auth(async (req) => {
  try {
    const session = req.auth
    const id = req.nextUrl.searchParams.get('id') as string

    const response = await db.user.delete({
      where: {
        id,
        teamId: session?.user.teamId ?? 'undefined',
      },
    })

    return new Response(JSON.stringify(response))
  } catch (err) {
    return new Response(JSON.stringify(err))
  }
})

/**
 * If permitted, updates Team member Roles for a user with given id.
 */
export const PUT = auth(async (req) => {
  try {
    const session = req.auth
    const id = req.nextUrl.searchParams.get('id') as string

    const member = (await req.json()) as {
      role?: Role
    }

    const response = await db.user.update({
      where: {
        id,
        teamId: session?.user.teamId ?? 'undefined',
      },
      data: {
        role: member.role,
      },
    })

    // Need to Update/Mutate Session here, to make role change work immediately.

    return new Response(JSON.stringify(response))
  } catch (err) {
    return new Response(JSON.stringify(err))
  }
})
