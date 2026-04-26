// server/modules/account/invitations/features/decline-invitation/handler.ts
import db from '@db'
import type { Logger } from 'pino'

export const DeclineInvitationCommand =
  (logger: Logger) => async (invitationId: string, userEmail: string) => {
    logger.info({ invitationId, userEmail }, 'Declining invitation')

    const invitation = await db.organizationInvitation.findFirst({
      where: { id: invitationId },
    })

    if (!invitation) {
      throw new Error('Invitation not found')
    }

    if (invitation.email !== userEmail) {
      throw new Error('This invitation does not belong to you')
    }

    await db.organizationInvitation.delete({ where: { email: invitation.email } })

    logger.info({ invitationId }, 'Invitation declined')

    return { success: true }
  }
