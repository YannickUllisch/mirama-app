import { createRoute } from '@/server/middleware/createRoute'
import { CreateTagCommand } from '@/server/modules/account/tags/features/create-tag/handler'
import { CreateTagSchema } from '@/server/modules/account/tags/features/create-tag/schema'
import { GetTagsQuery } from '@/server/modules/account/tags/features/get-tags/handler'
import { P } from '@/server/shared/domain/permissions'

export const GET = createRoute(
  {
    auth: { permissions: P.tag.read },
    pathPattern: '/api/db/organization/:organizationId/tag',
  },
  async (_req, { ctx }) => {
    const data = await GetTagsQuery(ctx)()

    return Response.json({ success: true, data })
  },
)

export const POST = createRoute(
  {
    auth: { permissions: P.tag.create },
    body: CreateTagSchema,
    pathPattern: '/api/db/organization/:organizationId/tag',
  },
  async (_req, { ctx }, { body }) => {
    const data = await CreateTagCommand(ctx)(body)

    return Response.json({ success: true, data }, { status: 201 })
  },
)
