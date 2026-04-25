import type { DefaultSession } from 'next-auth'

export type ExtendedUser = DefaultSession['user'] & {
  tenantId: string
  tenantRole: TenantRole
  organizationId?: string
  orgRole?: string
  memberId?: string
}

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser
  }
}
