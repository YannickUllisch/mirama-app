import type { CompanyInvitation } from '@prisma/client'
import type { InvitationResponseType } from '@server/domain/invitationSchema'

const mapDefaultToApi = (input: CompanyInvitation): InvitationResponseType => {
  return {
    ...input,
  }
}

export const InvitationMapper = {
  mapDefaultToApi,
}
