import { createRoute } from '@/server/middleware/createRoute'
import { DeleteRoleCommand } from '@/server/modules/account/roles/features/delete-role/handler'
import {
  AttachPolicyCommand,
  DetachPolicyCommand,
  UpdateRoleCommand,
} from '@/server/modules/account/roles/features/update-role/handler'
import {
  AttachPolicySchema,
  RoleIdParams,
  UpdateRoleSchema,
} from '@/server/modules/account/roles/features/update-role/schema'
import { TenantRole } from '@prisma/client'

export const PUT = createRoute(
  {
    auth: { allowedTenantRoles: [TenantRole.OWNER, TenantRole.ADMIN] },
    params: RoleIdParams,
    body: UpdateRoleSchema,
    pathPattern: '/api/db/tenant/:tenantId/role/:roleId',
  },
  async (_req, { ctx }, { params, body }) => {
    const data = await UpdateRoleCommand(ctx)(params.roleId, body)
    return Response.json({ success: true, data })
  },
)

export const DELETE = createRoute(
  {
    auth: { allowedTenantRoles: [TenantRole.OWNER, TenantRole.ADMIN] },
    params: RoleIdParams,
    pathPattern: '/api/db/tenant/:tenantId/role/:roleId',
  },
  async (_req, { ctx }, { params }) => {
    await DeleteRoleCommand(ctx)(params.roleId)
    return Response.json({ success: true })
  },
)

export const PATCH = createRoute(
  {
    auth: { allowedTenantRoles: [TenantRole.OWNER, TenantRole.ADMIN] },
    params: RoleIdParams,
    body: AttachPolicySchema,
    pathPattern: '/api/db/tenant/:tenantId/role/:roleId',
  },
  async (req, { ctx }, { params, body }) => {
    const action = req.headers.get('x-action')
    if (action === 'detach') {
      const data = await DetachPolicyCommand(ctx)(params.roleId, body.policyId)
      return Response.json({ success: true, data })
    }
    const data = await AttachPolicyCommand(ctx)(params.roleId, body.policyId)
    return Response.json({ success: true, data })
  },
)
