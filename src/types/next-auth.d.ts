import type { TenantRole } from '@server/auth/types'
import type { DefaultSession } from 'next-auth'

export type ExtendedUser = DefaultSession['user'] & {
  tenantId: string
  tenantRole?: TenantRole
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
