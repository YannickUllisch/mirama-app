import type { AppContext } from '@/server/shared/infrastructure/types'
import { InvitationEntity } from '../../domain/invitation.entity'
import { InvitationRepository } from '../../infrastructure/invitation.repo'
import { toInvitationResponse } from '../response'
import type { UpdateInvitationRequest } from './schema'

export const UpdateInvitationCommand =
  ({ db, logger }: AppContext) =>
  async (email: string, input: UpdateInvitationRequest) => {
    logger.info({ email }, 'Updating invitation')

    const repo = InvitationRepository(db)

    return toInvitationResponse(
      await repo.update(email, {
        name: input.name,
        iamRoleId: input.iamRoleId,
        ...(input.extendInvitation && {
          expiresAt: InvitationEntity.createExpiryDate(),
        }),
      }),
    )
  }
