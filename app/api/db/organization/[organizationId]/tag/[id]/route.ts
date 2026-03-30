import { OrganizationRole } from '@prisma/client'
import { createRoute } from '@/server/middleware/createRoute'
import { DeleteTagCommand } from '@/server/modules/account/tags/features/delete-tag/handler'
import { UpdateTagCommand } from '@/server/modules/account/tags/features/update-tag/handler'
import {
  TagIdParams,
  UpdateTagSchema,
} from '@/server/modules/account/tags/features/update-tag/schema'

export const PUT = createRoute(
  {
    auth: {
      allowedOrgRoles: [OrganizationRole.OWNER, OrganizationRole.ADMIN],
    },
    params: TagIdParams,
    body: UpdateTagSchema,
    pathPattern: '/api/db/organization/:organizationId/tag/:id',
  },
  async (_req, { ctx }, { params, body }) => {
    const data = await UpdateTagCommand(ctx)(params.id, body)

    return Response.json({ success: true, data })
  },
)

export const DELETE = createRoute(
  {
    auth: {
      allowedOrgRoles: [OrganizationRole.OWNER, OrganizationRole.ADMIN],
    },
    params: TagIdParams,
    pathPattern: '/api/db/organization/:organizationId/tag/:id',
  },
  async (_req, { ctx }, { params }) => {
    await DeleteTagCommand(ctx)(params.id)

    return Response.json(
      { success: true, message: 'Tag deleted successfully' },
      { status: 200 },
    )
  },
)
