import { auth } from '@src/lib/auth'
import { db } from '@src/lib/db'
import { validateRequest } from '@src/lib/validateRequest'
import { Role, type User } from '@prisma/client'
import { isRoleHigher } from '@src/lib/utils'

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
      orderBy: {
        role: 'asc',
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
    // We let both Owners and Admins remove users.
    const validatedRequest = await validateRequest(session, [
      Role.OWNER,
      Role.ADMIN,
    ])
    if (validatedRequest) {
      return validatedRequest
    }

    const ids = (await req.json()) as string[]

    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return Response.json(
        { ok: false, message: 'Invalid request body' },
        { status: 400 },
      )
    }

    const usersToDelete = await db.user.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    })

    for (const user of usersToDelete) {
      // For each user to delete we check if their role is higher than the one requesting deletion.
      // If not we forbid the entire request. If Session is not defined we assume the lowest role for the request maker.
      if (isRoleHigher(user.role, session?.user.role ?? Role.USER)) {
        return Response.json(
          { ok: false, message: 'Missing permission' },
          { status: 403 },
        )
      }
    }

    await db.user.deleteMany({
      where: {
        id: {
          in: ids,
        },
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
 * If permitted, updates team member
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

    // Doing Permission Checks. Admins should not be able to Update Owner Information
    const userToUpdate = await db.user.findFirst({
      where: {
        id,
      },
    })

    if (!userToUpdate) {
      return Response.json(
        { ok: false, message: 'User to change cannot be found.' },
        { status: 400 },
      )
    }

    // If the user to update has higher role han the requestee, deny request.
    if (isRoleHigher(userToUpdate.role, session?.user.role ?? Role.USER)) {
      return Response.json(
        { ok: false, message: 'Request denied, missing permission' },
        { status: 403 },
      )
    }

    const member = (await req.json()) as Partial<Omit<User, 'id'>>

    // If no update data has been sent, deny request.
    if (!member) {
      return Response.json(
        { ok: false, message: 'User attributes need to be defined in request' },
        { status: 400 },
      )
    }

    // Users should not be able to assign a higher rank than their own.
    if (
      member.role &&
      isRoleHigher(member.role, session?.user.role ?? Role.USER)
    ) {
      return Response.json(
        { ok: false, message: 'Request denied, missing permission' },
        { status: 403 },
      )
    }

    await db.user.update({
      where: {
        id,
        teamId: session?.user.teamId ?? 'undefined',
      },
      data: {
        ...member,
      },
    })

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

    // Users should not be able to assign a higher rank than their own.
    if (user.role && isRoleHigher(user.role, session?.user.role ?? Role.USER)) {
      return Response.json(
        { ok: false, message: 'Request denied, missing permission' },
        { status: 403 },
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
