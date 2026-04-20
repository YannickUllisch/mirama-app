import { createRoute } from '@/server/middleware/createRoute'
import { GetProjectMembersQuery } from '@/server/modules/project/features/get-assignees/handler'
import { ProjectIdParams } from '@/server/modules/project/features/get-project/schema'

export const GET = createRoute(
  {
    auth: {},
    params: ProjectIdParams,
    pathPattern:
      '/api/db/organization/:organizationId/project/:projectId/member',
  },
  async (_req, { session, ctx }, { params }) => {
    const data = await GetProjectMembersQuery(ctx)(
      params.projectId,
      session.user.id ?? '',
    )

    return Response.json({ success: true, data })
  },
)
