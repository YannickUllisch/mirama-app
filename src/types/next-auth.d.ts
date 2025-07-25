import type { Role } from '@prisma/client'
import type { DefaultSession } from 'next-auth'

export type ExtendedUser = DefaultSession['user'] & {
  teamId: string
  role: Role
  refreshToken?: string
}

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser
  }
}
