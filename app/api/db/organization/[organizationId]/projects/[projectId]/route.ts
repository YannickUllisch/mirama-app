import { createRoute } from '@/server/middleware/createRoute'
import { DeleteProjectCommand } from '@/server/modules/project/features/delete-project/handler'
import { GetProjectQuery } from '@/server/modules/project/features/get-project/handler'
import { ProjectIdParams } from '@/server/modules/project/features/get-project/schema'
import { UpdateProjectCommand } from '@/server/modules/project/features/update-project/handler'
import { UpdateProjectSchema } from '@/server/modules/project/features/update-project/schema'
import { P } from '@/server/shared/domain/permissions'

export const GET = createRoute(
  {
    auth: { permissions: P.project.read },
    params: ProjectIdParams,
    pathPattern: '/api/db/organization/:organizationId/project/:projectId',
  },
  async (_req, { session, ctx }, { params }) => {
    const data = await GetProjectQuery(ctx)(
      params.projectId,
      session.user.id ?? '',
    )

    return Response.json({ success: true, data })
  },
)

export const PUT = createRoute(
  {
    auth: { permissions: P.project.update },
    params: ProjectIdParams,
    body: UpdateProjectSchema,
    pathPattern: '/api/db/organization/:organizationId/project/:projectId',
  },
  async (_req, { ctx }, { params, body }) => {
    const data = await UpdateProjectCommand(ctx)(params.projectId, body)

    return Response.json({ success: true, data })
  },
)

export const DELETE = createRoute(
  {
    auth: { permissions: P.project.delete },
    params: ProjectIdParams,
    pathPattern: '/api/db/organization/:organizationId/project/:projectId',
  },
  async (_req, { ctx }, { params }) => {
    await DeleteProjectCommand(ctx)(params.projectId)

    return Response.json(
      { success: true, message: 'Project deleted successfully' },
      { status: 200 },
    )
  },
)
