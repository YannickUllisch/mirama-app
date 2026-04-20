import { TenantRole } from '@/prisma/generated/client'
import { createRoute } from '@/server/middleware/createRoute'
import { CreateRoleCommand } from '@/server/modules/account/roles/features/create-role/handler'
import { CreateRoleSchema } from '@/server/modules/account/roles/features/create-role/schema'
import { GetRolesQuery } from '@/server/modules/account/roles/features/get-roles/handler'

export const GET = createRoute(
  {
    auth: { allowedTenantRoles: [TenantRole.OWNER, TenantRole.ADMIN] },
    pathPattern: '/api/db/tenant/:tenantId/role',
  },
  async (_req, { ctx }) => {
    const data = await GetRolesQuery(ctx)()
    return Response.json({ success: true, data })
  },
)

export const POST = createRoute(
  {
    auth: { allowedTenantRoles: [TenantRole.OWNER, TenantRole.ADMIN] },
    body: CreateRoleSchema,
    pathPattern: '/api/db/tenant/:tenantId/role',
  },
  async (_req, { ctx }, { body }) => {
    const data = await CreateRoleCommand(ctx)(body)
    return Response.json({ success: true, data }, { status: 201 })
  },
)
