export type PolicyStatementResponse = {
  id: string
  effect: string
  action: string
  resource: string
}

export type PolicyResponse = {
  id: string
  name: string
  description: string | null
  isManaged: boolean
  tenantId: string | null
  statements: PolicyStatementResponse[]
}

export type RoleResponse = {
  id: string
  name: string
  description: string | null
  tenantId: string | null
  policies: PolicyResponse[]
  _count: { organizationMembers: number }
}

export const toRoleResponse = (role: any): RoleResponse => ({
  id: role.id,
  name: role.name,
  description: role.description,
  tenantId: role.tenantId,
  policies: (role.policies ?? []).map(toPolicyResponse),
  _count: role._count ?? { organizationMembers: 0 },
})

export const toPolicyResponse = (policy: any): PolicyResponse => ({
  id: policy.id,
  name: policy.name,
  description: policy.description,
  isManaged: policy.isManaged,
  tenantId: policy.tenantId,
  statements: (policy.statements ?? []).map(
    (s: any): PolicyStatementResponse => ({
      id: s.id,
      effect: s.effect,
      action: s.action,
      resource: s.resource,
    }),
  ),
})
