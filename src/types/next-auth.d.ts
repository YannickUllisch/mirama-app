import type { Role } from '@prisma/client'
import NextAuth, { type DefaultSession } from 'next-auth'

export type ExtendedUser = DefaultSession['user'] & {
  teamId: string
  role: Role
  provider: string
}

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser
  }
}
