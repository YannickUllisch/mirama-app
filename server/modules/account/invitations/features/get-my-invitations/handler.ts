// server/modules/account/invitations/features/get-my-invitations/handler.ts
import db from '@db'
import type { Logger } from 'pino'
import { toInvitationResponse } from '../response'

export const GetMyInvitationsQuery =
  (logger: Logger) => async (email: string) => {
    logger.info({ email }, 'Fetching invitations for user')

    const invitations = await db.organizationInvitation.findMany({
      where: { email },
      include: { organization: { select: { name: true } } },
      orderBy: { expiresAt: 'asc' },
    })

    return invitations.map(toInvitationResponse)
  }
