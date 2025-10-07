import type { CompanyInvitation } from '@prisma/client'
import type { InvitationResponseType } from '@server/domain/invitationSchema'

const mapDefaultToApi = (input: CompanyInvitation): InvitationResponseType => {
  return {
    email: input.email,
    expiresAt: input.expiresAt,
    id: input.id,
    name: input.name,
    role: input.role,
    teamId: input.teamId,
  }
}

export const InvitationMapper = {
  mapDefaultToApi,
}
