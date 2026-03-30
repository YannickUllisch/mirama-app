import { OrganizationRole } from '@prisma/client'
import { createRoute } from '@/server/middleware/createRoute'
import { CreateProjectCommand } from '@/server/modules/project/features/create-project/handler'
import { CreateProjectSchema } from '@/server/modules/project/features/create-project/schema'
import { GetProjectsQuery } from '@/server/modules/project/features/get-projects/handler'

export const GET = createRoute(
  {
    auth: { allowedOrgRoles: 'ANY' },
    pathPattern: '/api/db/organization/:organizationId/project',
  },
  async (req, { session, ctx }) => {
    const archived = req.nextUrl.searchParams.get('archived') === 'true'
    const isAdmin = (
      [OrganizationRole.ADMIN, OrganizationRole.OWNER] as OrganizationRole[]
    ).includes(session.user.orgRole as OrganizationRole)

    const data = await GetProjectsQuery(ctx)(
      session.user.id ?? '',
      isAdmin,
      archived,
    )

    return Response.json({ success: true, data })
  },
)

export const POST = createRoute(
  {
    auth: {
      allowedOrgRoles: [OrganizationRole.OWNER, OrganizationRole.ADMIN],
    },
    body: CreateProjectSchema,
    pathPattern: '/api/db/organization/:organizationId/project',
  },
  async (_req, { ctx }, { body }) => {
    const data = await CreateProjectCommand(ctx)(body)

    return Response.json({ success: true, data }, { status: 201 })
  },
)
