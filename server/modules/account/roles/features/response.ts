import type { Policy, PolicyStatement, Role } from '@/prisma/generated/client'
import type {
  PolicyResponse,
  PolicyStatementResponse,
} from '../../policies/features/response'

export type RoleResponse = {
  id: string
  name: string
  description: string | null
  tenantId: string | null
  scope: string
  policies: PolicyResponse[]
  _count: { organizationMembers: number; projectMembers: number }
}

export const toRoleResponse = (
  role: Role & {
    _count: any
    policies: (Policy & { statements: PolicyStatement[] })[]
  },
): RoleResponse => ({
  id: role.id,
  name: role.name,
  description: role.description,
  tenantId: role.tenantId,
  scope: role.scope ?? 'ORGANIZATION',
  policies: (role.policies ?? []).map(toPolicyResponse),
  _count: role._count ?? { organizationMembers: 0, projectMembers: 0 },
})

export const toPolicyResponse = (
  policy: Policy & { statements: PolicyStatement[] },
): PolicyResponse => ({
  id: policy.id,
  name: policy.name,
  description: policy.description,
  isManaged: policy.isManaged,
  tenantId: policy.tenantId,
  scope: policy.scope ?? 'ORGANIZATION',
  statements: (policy.statements ?? []).map(
    (s: PolicyStatement): PolicyStatementResponse => ({
      id: s.id,
      effect: s.effect,
      action: s.action,
      resource: s.resource,
    }),
  ),
})
