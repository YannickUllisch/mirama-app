import {
  AccessScope,
  type Policy,
  type PolicyStatement,
} from '@/prisma/generated/client'

export type PolicyStatementResponse = {
  id: string
  effect: string
  action: string
  resource: string
}
export type PolicyResponse = {
  id: string
  name: string
  description?: string | null
  isManaged: boolean
  tenantId: string | null
  scope: string
  statements: PolicyStatementResponse[]
}

export const toPolicyResponse = (
  policy: Policy & { statements: PolicyStatement[] },
): PolicyResponse => ({
  id: policy.id,
  name: policy.name,
  description: policy.description,
  isManaged: policy.isManaged,
  tenantId: policy.tenantId,
  scope: policy.scope ?? AccessScope.ORGANIZATION,
  statements: (policy.statements ?? []).map(
    (s: PolicyStatement): PolicyStatementResponse => ({
      id: s.id,
      effect: s.effect,
      action: s.action,
      resource: s.resource,
    }),
  ),
})
