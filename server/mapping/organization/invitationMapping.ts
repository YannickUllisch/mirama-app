import type { OrganizationInvitation } from '@prisma/client'
import type { InvitationResponseType } from '@server/domain/invitationSchema'

export const InvitationMapper = {
  mapDefaultToApi: (input: OrganizationInvitation): InvitationResponseType => {
    return {
      email: input.email,
      expiresAt: input.expiresAt,
      id: input.id,
      name: input.name,
      organizationRole: input.role,
      organizationId: input.organizationId,
    }
  },
}
