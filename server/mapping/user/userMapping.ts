import type { User } from '@prisma/client'
import type { UserResponseType } from '@server/domain/userSchema'

export const UserMapper = {
  mapDefaultToApi: (input: User): UserResponseType => {
    return {
      email: input.email,
      id: input.id,
      name: input.name,
      preferredDateType: input.preferredDateType,
      role: input.role,
      teamId: input.teamId,
    }
  },
}
