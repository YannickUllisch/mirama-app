import { createRoute } from '@/server/middleware/createRoute'
import { CreateProjectCommand } from '@/server/modules/project/features/create-project/handler'
import { CreateProjectSchema } from '@/server/modules/project/features/create-project/schema'
import { GetProjectsQuery } from '@/server/modules/project/features/get-projects/handler'
import { P } from '@/server/shared/domain/permissions'

export const GET = createRoute(
  {
    auth: { permissions: P.project.read },
    pathPattern: '/api/db/organization/:organizationId/project',
  },
  async (req, { session, ctx }) => {
    const archived = req.nextUrl.searchParams.get('archived') === 'true'
    ctx.logger.info(session.user.email)
    ctx.logger.info(archived)

    const data = await GetProjectsQuery(ctx)(session.user.email ?? '', archived)

    return Response.json({ success: true, data })
  },
)

export const POST = createRoute(
  {
    auth: { permissions: P.project.create },
    body: CreateProjectSchema,
    pathPattern: '/api/db/organization/:organizationId/project',
  },
  async (_req, { ctx, session }, { body }) => {
    const data = await CreateProjectCommand(ctx)(
      body,
      session.user.organizationId ?? '',
      session.user.email ?? '',
    )

    return Response.json({ success: true, data }, { status: 201 })
  },
)
