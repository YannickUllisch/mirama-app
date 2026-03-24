import type { Member } from '@prisma/client'
import type { MemberResponseType } from '@server/domain/memberSchema'

export const MemberMapper = {
  mapDefaultToApi: (input: Member): MemberResponseType => {
    return {
      email: input.email,
      id: input.id,
      name: input.name,
      organizationRole: input.role,
    }
  },
}
