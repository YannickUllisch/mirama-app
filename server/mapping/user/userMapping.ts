import type { User } from '@prisma/client'
import type { UserResponseType } from '@server/domain/userSchema'

const mapDefaultToApi = (input: User): UserResponseType => {
  return {
    ...input,
  }
}

export const UserMapper = {
  mapDefaultToApi,
}
