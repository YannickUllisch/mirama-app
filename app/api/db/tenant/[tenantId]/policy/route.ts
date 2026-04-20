import { TenantRole } from '@/prisma/generated/client'
import { createRoute } from '@/server/middleware/createRoute'
import { CreatePolicyCommand } from '@/server/modules/account/policies/features/create-policy/handler'
import { CreatePolicySchema } from '@/server/modules/account/policies/features/create-policy/schema'
import { GetPoliciesQuery } from '@/server/modules/account/policies/features/get-policies/handler'

export const GET = createRoute(
  {
    auth: { allowedTenantRoles: [TenantRole.OWNER, TenantRole.ADMIN] },
    pathPattern: '/api/db/tenant/:tenantId/policy',
  },
  async (_req, { ctx }) => {
    const data = await GetPoliciesQuery(ctx)()
    return Response.json({ success: true, data })
  },
)

export const POST = createRoute(
  {
    auth: { allowedTenantRoles: [TenantRole.OWNER, TenantRole.ADMIN] },
    body: CreatePolicySchema,
    pathPattern: '/api/db/tenant/:tenantId/policy',
  },
  async (_req, { ctx }, { body }) => {
    const data = await CreatePolicyCommand(ctx)(body)
    return Response.json({ success: true, data }, { status: 201 })
  },
)
