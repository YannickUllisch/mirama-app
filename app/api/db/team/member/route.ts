import { auth } from '@src/lib/auth'
import { db } from '@src/lib/db'
import { validateRequest } from '@src/lib/validateRequest'
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

    return Response.json(response, { status: 200 })
  } catch (err) {
    return Response.json(
      { ok: false, message: `Failed with Error ${err}` },
      { status: 500 },
    )
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
    const id = req.nextUrl.searchParams.get('id') as string

    if (!id) {
      return Response.json(
        { ok: false, message: 'User ID needs to be defined in request' },
        { status: 400 },
      )
    }

    await db.user.delete({
      where: {
        id,
        teamId: session?.user.teamId ?? 'undefined',
      },
    })

    return Response.json(
      { ok: true, message: 'User Successfully deleted' },
      { status: 200 },
    )
  } catch (err) {
    return Response.json(
      { ok: false, message: `Failed with Error ${err}` },
      { status: 500 },
    )
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
    const id = req.nextUrl.searchParams.get('id') as string

    if (!id) {
      return Response.json(
        { ok: false, message: 'User ID needs to be defined in request' },
        { status: 400 },
      )
    }

    const member = (await req.json()) as {
      role?: Role
    }

    if (!id) {
      return Response.json(
        { ok: false, message: 'User attrivutes need to be defined in request' },
        { status: 400 },
      )
    }

    await db.user.update({
      where: {
        id,
        teamId: session?.user.teamId ?? 'undefined',
      },
      data: {
        role: member.role,
      },
    })

    // Need to Update/Mutate Session here, to make role change work immediately.

    return Response.json(
      { ok: true, message: 'User Successfully Updated' },
      { status: 200 },
    )
  } catch (err) {
    return Response.json(
      { ok: false, message: `Failed with Error ${err}` },
      { status: 500 },
    )
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

    if (!user) {
      return Response.json(
        { ok: false, message: 'User attributes need to be defined in request' },
        { status: 400 },
      )
    }

    await db.user.create({
      data: {
        ...user,
        teamId: session?.user.teamId,
      },
    })

    return Response.json({ ok: true, message: 'Member Added' }, { status: 200 })
  } catch (err) {
    return Response.json(
      { ok: false, message: `Failed with Error ${err}` },
      { status: 500 },
    )
  }
})
