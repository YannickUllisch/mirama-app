import db from '@db'
import { DateTime } from 'luxon'
import type { Session } from 'next-auth'

export const fetchAllCompanyInvitations = async ({
  session,
}: { session: Session | null }) => {
  try {
    const invitations = await db.companyInvitation.findMany({
      where: {
        teamId: session?.user.teamId ?? 'undef',
      },
    })

    return invitations
  } catch {
    return null
  }
}

export const getValidCompanyInvitation = async ({
  email,
}: { email: string }) => {
  try {
    const invitation = await db.companyInvitation.findUnique({
      where: {
        email,
      },
    })

    // Validation of invitation
    if (!invitation) {
      return null
    }
    const expiresAt = DateTime.fromJSDate(invitation?.expiresAt)

    if (expiresAt < DateTime.now()) {
      // Invitation has expired, so remove it from the database
      await db.companyInvitation.delete({
        where: {
          email: invitation.email,
        },
      })
      return null
    }

    return invitation
  } catch {
    return null
  }
}
