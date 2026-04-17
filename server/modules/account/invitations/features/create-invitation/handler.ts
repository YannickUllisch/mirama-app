import type { AppContext } from '@/server/shared/infrastructure/types'
import { InvitationEntity } from '../../domain/invitation.entity'
import { InvitationRepository } from '../../infrastructure/invitation.repo'
import { toInvitationResponse } from '../response'
import type { CreateInvitationRequest } from './schema'

export const CreateInvitationCommand =
  ({ db }: AppContext) =>
  async (inviterId: string, input: CreateInvitationRequest) => {
    const repo = InvitationRepository(db)
    const existing = await repo.findByEmail(input.email)

    if (existing) {
      throw new Error('An invitation for this email already exists')
    }

    const expiresAt = InvitationEntity.createExpiryDate()

    // TODO: Send invitation email through event/SNS topic

    const invitation = await repo.create({
      email: input.email,
      name: input.name,
      inviterId,
      expiresAt,
      iamRoleId: input.iamRoleId,
    })

    return toInvitationResponse(invitation)
  }
