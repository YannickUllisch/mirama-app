import z from 'zod'

export const MemberPermissionsSchema = z.array(z.string())

export type MemberPermissions = z.infer<typeof MemberPermissionsSchema>

export type StatementDraft = {
  effect: 'Allow' | 'Deny'
  action: string
  resource: string
}

export type {
  AvailablePermissionsResponse,
  PermissionActionResponse,
  PermissionGroupResponse,
} from './policy/policy.types'
