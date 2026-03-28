import { createRoute } from '@/server/middleware/createRoute'
import { UpdateOrganizationCommand } from '@/server/modules/account/organizations/features/update-organization/handler'
import {
  OrganizationIdParams,
  UpdateOrganizationSchema,
} from '@/server/modules/account/organizations/features/update-organization/schema'
import { TenantRole } from '@prisma/client'

export const PUT = createRoute(
  {
    auth: { allowedTenantRoles: [TenantRole.OWNER, TenantRole.ADMIN] },
    params: OrganizationIdParams,
    body: UpdateOrganizationSchema,
    pathPattern: '/api/db/:tenantId/organization/:organizationId',
  },
  async (_req, { ctx }, { params, body }) => {
    const data = await UpdateOrganizationCommand(ctx)(
      params.organizationId,
      body,
    )

    return Response.json({ success: true, data })
  },
)
