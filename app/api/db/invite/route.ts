import { auth } from '@auth'
import { db } from '@db'
import { Role } from '@prisma/client'
import { sendCompanyInvitationEmail } from '@src/email/mailer'
import type { InvitationSchema } from '@src/lib/schemas'
import { isRoleHigher } from '@src/lib/utils'
import { validateRequest } from '@src/lib/validateRequest'
import { DateTime } from 'luxon'
import type { z } from 'zod'

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

      await sendCompanyInvitationEmail({
        identifier: invitation.email, // temporary since I cannot send mails without a domain
        url: process.env.BASE_URL ?? '',
        inviterName: session?.user.name ?? 'REDACTED',
        teamName: invitationTeam.name,
      })

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
