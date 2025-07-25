import { auth } from '@auth'
import db from '@db'
import { Role } from '@prisma/client'
import { inviteUserCognito } from '@src/lib/auth/inviteUser'
import type { InvitationSchema } from '@src/lib/schemas'
import { isRoleHigher } from '@src/lib/utils'
import { validateRequest } from '@src/lib/validateRequest'
import { DateTime } from 'luxon'
import type { z } from 'zod'

export const GET = auth(async (req) => {
  try {
    // Checking Permissions
    const session = req.auth
    const validatedRequest = await validateRequest(session, [
      Role.ADMIN,
      Role.OWNER,
    ])
    if (validatedRequest) {
      return validatedRequest
    }

    const response = await db.companyInvitation.findMany({
      where: {
        teamId: session?.user.teamId ?? 'undef',
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

export const POST = async (req: Request) => {
  try {
    // Checking Permissions
    const session = await auth()
    const validatedRequest = await validateRequest(session, [
      Role.OWNER,
      Role.ADMIN,
    ])
    if (validatedRequest) {
      return validatedRequest
    }

    const invitation = (await req.json()) as z.infer<typeof InvitationSchema>

    // Users should not be able to assign a higher rank than their own.
    if (
      invitation.role &&
      isRoleHigher(invitation.role, session?.user.role ?? Role.USER)
    ) {
      return Response.json(
        { ok: false, message: 'Request denied, missing permission' },
        { status: 403 },
      )
    }

    const invitationTeam = await db.team.findFirst({
      where: {
        id: session?.user.teamId,
      },
    })

    if (!invitationTeam) {
      return Response.json(
        { success: true, message: 'Team the user is invited to is invalid' },
        { status: 404 },
      )
    }

    // We want invitation to last for 1 day - could be shortened in the future for security reasons
    const expiresAt = DateTime.now().plus({ day: 1 }).toJSDate()

    try {
      await db.companyInvitation.create({
        data: {
          ...invitation,
          teamId: session?.user.teamId ?? 'undef',
          expiresAt,
        },
      })

      await inviteUserCognito({ email: invitation.email })

      return Response.json(
        { success: true, message: 'Invitation has been sent' },
        { status: 200 },
      )
    } catch (err) {
      return Response.json(
        { ok: false, message: `Failed with Error ${err}` },
        { status: 500 },
      )
    }
  } catch (err) {
    return Response.json(
      { ok: false, message: `Failed with Error ${err}` },
      { status: 500 },
    )
  }
}

export const DELETE = async (req: Request) => {
  try {
    // Checking Permissions
    const session = await auth()
    const validatedRequest = await validateRequest(session, [
      Role.OWNER,
      Role.ADMIN,
    ])
    if (validatedRequest) {
      return validatedRequest
    }

    const emailArray = (await req.json()) as string[]

    if (!emailArray) {
      return Response.json(
        { ok: false, message: 'Email is required to remove an invitation' },
        { status: 404 },
      )
    }

    await db.companyInvitation.deleteMany({
      where: {
        email: {
          in: emailArray,
        },
      },
    })

    return Response.json(
      { ok: true, message: 'Invitation has been removed' },
      { status: 200 },
    )
  } catch (err) {
    return Response.json(
      { ok: false, message: `Failed with Error ${err}` },
      { status: 500 },
    )
  }
}

export const PUT = async (req: Request) => {
  try {
    // Checking Permissions
    const session = await auth()
    const validatedRequest = await validateRequest(session, [
      Role.OWNER,
      Role.ADMIN,
    ])
    if (validatedRequest) {
      return validatedRequest
    }

    const invitation = (await req.json()) as Partial<
      z.infer<typeof InvitationSchema>
    > & { extendInvitation: boolean }

    if (!invitation) {
      return Response.json(
        { ok: false, message: 'Invalid request body' },
        { status: 404 },
      )
    }

    await db.companyInvitation.update({
      where: {
        email: invitation.email,
      },
      data: {
        email: invitation.email,
        name: invitation.name,
        role: invitation.role,
        expiresAt: invitation.extendInvitation
          ? DateTime.now().plus({ days: 1 }).toJSDate()
          : undefined,
      },
    })

    return Response.json(
      { ok: true, message: 'Invitation has been removed' },
      { status: 200 },
    )
  } catch (err) {
    return Response.json(
      { ok: false, message: `Failed with Error ${err}` },
      { status: 500 },
    )
  }
}
