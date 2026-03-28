import { createRoute } from '@/server/middleware/createRoute'
import { CreateTaskCommand } from '@/server/modules/task/features/create-task/handler'
import { CreateTaskSchema } from '@/server/modules/task/features/create-task/schema'
import { DeleteTasksBulkCommand } from '@/server/modules/task/features/delete-task/handler'
import { DeleteTasksBulkSchema } from '@/server/modules/task/features/delete-task/schema'
import {
  GetPersonalTasksQuery,
  GetTasksByProjectQuery,
} from '@/server/modules/task/features/get-tasks/handler'
import { OrganizationRole } from '@prisma/client'

export const GET = createRoute(
  {
    auth: { allowedOrgRoles: 'ANY' },
  },
  async (req, { session, ctx }) => {
    const projectId = req.nextUrl.searchParams.get('projectId')
    const personal = req.nextUrl.searchParams.get('personal') === 'true'
    const ignoreCompleted =
      req.nextUrl.searchParams.get('ignoreCompleted') === 'true'

    const isAdmin = (
      [OrganizationRole.ADMIN, OrganizationRole.OWNER] as OrganizationRole[]
    ).includes(session.user.orgRole as OrganizationRole)

    // Personal tasks — returns tasks assigned to the current user
    if (personal) {
      const data = await GetPersonalTasksQuery(ctx)(
        session.user.id ?? '',
        projectId ?? undefined,
      )
      return Response.json({ success: true, data })
    }

    // Project tasks — requires projectId
    if (!projectId) {
      return Response.json(
        { success: false, message: 'projectId query param is required' },
        { status: 400 },
      )
    }

    const data = await GetTasksByProjectQuery(ctx)(
      projectId,
      session.user.id ?? '',
      isAdmin,
      ignoreCompleted,
    )

    return Response.json({ success: true, data })
  },
)

export const POST = createRoute(
  {
    auth: { allowedOrgRoles: 'ANY' },
    body: CreateTaskSchema,
  },
  async (_req, { session, ctx }, { body }) => {
    const isAdmin = (
      [OrganizationRole.ADMIN, OrganizationRole.OWNER] as OrganizationRole[]
    ).includes(session.user.orgRole as OrganizationRole)

    const data = await CreateTaskCommand(ctx)(
      session.user.id ?? '',
      isAdmin,
      body,
    )

    return Response.json({ success: true, data }, { status: 201 })
  },
)

export const DELETE = createRoute(
  {
    auth: { allowedOrgRoles: 'ANY' },
    body: DeleteTasksBulkSchema,
  },
  async (_req, { session, ctx }, { body }) => {
    const isAdmin = (
      [OrganizationRole.ADMIN, OrganizationRole.OWNER] as OrganizationRole[]
    ).includes(session.user.orgRole as OrganizationRole)

    await DeleteTasksBulkCommand(ctx)(
      body.ids,
      body.projectId,
      session.user.id ?? '',
      isAdmin,
    )

    return Response.json(
      { success: true, message: 'Tasks deleted successfully' },
      { status: 200 },
    )
  },
)
