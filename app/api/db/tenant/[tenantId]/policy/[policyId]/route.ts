import { TenantRole } from '@/prisma/generated/client'
import { createRoute } from '@/server/middleware/createRoute'
import { DeletePolicyCommand } from '@/server/modules/account/policies/features/delete-policy/handler'
import { UpdatePolicyCommand } from '@/server/modules/account/policies/features/update-policy/handler'
import {
  PolicyIdParams,
  UpdatePolicySchema,
} from '@/server/modules/account/policies/features/update-policy/schema'

export const PUT = createRoute(
  {
    auth: { allowedTenantRoles: [TenantRole.OWNER, TenantRole.ADMIN] },
    params: PolicyIdParams,
    body: UpdatePolicySchema,
    pathPattern: '/api/db/tenant/:tenantId/policy/:policyId',
  },
  async (_req, { ctx }, { params, body }) => {
    const data = await UpdatePolicyCommand(ctx)(params.policyId, body)
    return Response.json({ success: true, data })
  },
)

export const DELETE = createRoute(
  {
    auth: { allowedTenantRoles: [TenantRole.OWNER, TenantRole.ADMIN] },
    params: PolicyIdParams,
    pathPattern: '/api/db/tenant/:tenantId/policy/:policyId',
  },
  async (_req, { ctx }, { params }) => {
    await DeletePolicyCommand(ctx)(params.policyId)
    return Response.json({ success: true })
  },
)
