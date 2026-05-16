import type { DefaultSession } from 'next-auth'

export type ExtendedUser = DefaultSession['user'] & {
  tenantId: string
  organizationId?: string
  roleId?: string
  memberId?: string
  isOnboarded?: boolean
}

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser
  }
}
