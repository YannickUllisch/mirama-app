import type { AppContext } from '@/server/shared/infrastructure/types'
import { InvitationRepository } from '../../infrastructure/invitation.repo'
import { toInvitationResponse } from '../response'

export const GetInvitationsQuery =
  ({ db, logger }: AppContext) =>
  async () => {
    logger.info('Fetching all invitations for the current organization')

    const repo = InvitationRepository(db)
    const invitations = await repo.findAll()

    return invitations.map(toInvitationResponse)
  }
