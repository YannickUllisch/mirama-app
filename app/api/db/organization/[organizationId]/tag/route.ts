import { OrganizationRole } from '@prisma/client'
import { createRoute } from '@/server/middleware/createRoute'
import { CreateTagCommand } from '@/server/modules/account/tags/features/create-tag/handler'
import { CreateTagSchema } from '@/server/modules/account/tags/features/create-tag/schema'
import { GetTagsQuery } from '@/server/modules/account/tags/features/get-tags/handler'

export const GET = createRoute(
  {
    auth: { allowedOrgRoles: 'ANY' },
    pathPattern: '/api/db/organization/:organizationId/tag',
  },
  async (_req, { ctx }) => {
    const data = await GetTagsQuery(ctx)()

    return Response.json({ success: true, data })
  },
)

export const POST = createRoute(
  {
    auth: {
      allowedOrgRoles: [OrganizationRole.OWNER, OrganizationRole.ADMIN],
    },
    body: CreateTagSchema,
    pathPattern: '/api/db/organization/:organizationId/tag',
  },
  async (_req, { ctx }, { body }) => {
    const data = await CreateTagCommand(ctx)(body)

    return Response.json({ success: true, data }, { status: 201 })
  },
)
