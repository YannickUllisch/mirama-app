// server/modules/account/invitations/features/accept-invitation/handler.ts
import db from '@db'
import type { Logger } from 'pino'

export const AcceptInvitationCommand =
  (logger: Logger) =>
  async (invitationId: string, userEmail: string, userId: string) => {
    logger.info({ invitationId, userEmail }, 'Accepting invitation')

    const invitation = await db.organizationInvitation.findFirst({
      where: { id: invitationId },
    })

    if (!invitation) {
      throw new Error('Invitation not found')
    }

    if (invitation.email !== userEmail) {
      throw new Error('This invitation does not belong to you')
    }

    if (invitation.expiresAt < new Date()) {
      throw new Error('This invitation has expired')
    }

    const existingMember = await db.member.findFirst({
      where: { email: userEmail, organizationId: invitation.organizationId },
    })

    if (!existingMember) {
      await db.member.create({
        data: {
          name: invitation.name,
          email: invitation.email,
          organizationId: invitation.organizationId,
          iamRoleId: invitation.iamRoleId,
          userId,
        },
      })
    }

    await db.organizationInvitation.delete({ where: { email: invitation.email } })

    logger.info(
      { invitationId, organizationId: invitation.organizationId },
      'Invitation accepted',
    )

    return { success: true, organizationId: invitation.organizationId }
  }
