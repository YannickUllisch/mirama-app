import { OrganizationRole } from '@prisma/client'
import { createRoute } from '@/server/middleware/createRoute'
import { GetAssigneesQuery } from '@/server/modules/project/features/get-assignees/handler'
import { ProjectIdParams } from '@/server/modules/project/features/get-project/schema'

export const GET = createRoute(
  {
    auth: { allowedOrgRoles: 'ANY' },
    params: ProjectIdParams,
    pathPattern:
      '/api/db/organization/:organizationId/project/:projectId/users',
  },
  async (_req, { session, ctx }, { params }) => {
    const isAdmin = (
      [OrganizationRole.ADMIN, OrganizationRole.OWNER] as OrganizationRole[]
    ).includes(session.user.orgRole as OrganizationRole)

    const data = await GetAssigneesQuery(ctx)(
      params.projectId,
      session.user.id ?? '',
      isAdmin,
    )

    return Response.json({ success: true, data })
  },
)
