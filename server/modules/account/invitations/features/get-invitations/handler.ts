import type { AppContext } from '@/server/shared/infrastructure/types'
import { InvitationRepository } from '../../infrastructure/invitation.repo'
import { toInvitationResponse } from '../response'

export const GetInvitationsQuery =
  ({ db }: AppContext) =>
  async () => {
    const repo = InvitationRepository(db)
    const invitations = await repo.findAll()

    return invitations.map(toInvitationResponse)
  }
