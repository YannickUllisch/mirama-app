import { OrganizationRole } from '@prisma/client'
import { createRoute } from '@/server/middleware/createRoute'
import { ArchiveProjectCommand } from '@/server/modules/project/features/archive-project/handler'
import { ArchiveProjectSchema } from '@/server/modules/project/features/archive-project/schema'
import { ProjectIdParams } from '@/server/modules/project/features/get-project/schema'

export const POST = createRoute(
  {
    auth: {
      allowedOrgRoles: [OrganizationRole.OWNER, OrganizationRole.ADMIN],
    },
    params: ProjectIdParams,
    body: ArchiveProjectSchema,
    pathPattern:
      '/api/db/organization/:organizationId/project/:projectId/archive',
  },
  async (_req, { ctx }, { params, body }) => {
    const data = await ArchiveProjectCommand(ctx)(params.projectId, body)

    return Response.json({ success: true, data })
  },
)
