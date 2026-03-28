import type { AppContext } from '@/server/shared/infrastructure/types'
import type { OrganizationRole } from '@prisma/client'
import { InvitationEntity } from '../../domain/invitation.entity'
import { InvitationRepository } from '../../infrastructure/invitation.repo'
import { toInvitationResponse } from '../response'
import type { CreateInvitationRequest } from './schema'

export const CreateInvitationCommand =
  ({ db, logger }: AppContext) =>
  async (
    inviterId: string,
    sessionRole: OrganizationRole,
    input: CreateInvitationRequest,
  ) => {
    logger.info({ email: input.email }, 'Creating invitation')

    InvitationEntity.assertCanInviteRole(input.role, sessionRole)

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
      role: input.role,
      inviterId,
      expiresAt,
    })

    return toInvitationResponse(invitation)
  }
