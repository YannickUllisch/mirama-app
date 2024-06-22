import { auth } from '@/src/lib/auth'
import { db } from '@/src/lib/db'
import { validateRequest } from '@/src/lib/utils'
import { Role, type User } from '@prisma/client'
import { validate } from 'uuid'

export const GET = auth(async (req) => {
  try {
    // Checking Permissions
    const session = req.auth
    const validatedRequest = await validateRequest(session)
    if (validatedRequest) {
      return validatedRequest
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
    // Checking Permissions
    const session = req.auth
    // So far only owners can delete members. TODO: Only let Admins remove users with rank lower than themselves
    const validatedRequest = await validateRequest(session, [Role.OWNER])
    if (validatedRequest) {
      return validatedRequest
    }
    const id = new URL(req.url).searchParams.get('id') as string

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

    const validatedRequest = await validateRequest(session, [
      Role.ADMIN,
      Role.OWNER,
    ])

    if (validatedRequest) {
      return validatedRequest
    }
    const id = new URL(req.url).searchParams.get('id') as string

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

export const POST = auth(async (req) => {
  try {
    // Checking Permissions
    const session = req.auth
    const validatedRequest = await validateRequest(session, [
      Role.OWNER,
      Role.ADMIN,
    ])
    if (validatedRequest) {
      return validatedRequest
    }

    const user = (await req.json()) as Omit<User, 'id' | 'teamId'>

    await db.user.create({
      data: {
        ...user,
        teamId: session?.user.teamId,
      },
    })

    return Response.json({})
  } catch (err) {
    return new Response(JSON.stringify(err))
  }
})
