import { OrganizationRole } from '@prisma/client'
import { createRoute } from '@/server/middleware/createRoute'
import { DeleteTaskCommand } from '@/server/modules/task/features/delete-task/handler'
import { GetTaskQuery } from '@/server/modules/task/features/get-task/handler'
import { TaskIdParams } from '@/server/modules/task/features/get-task/schema'
import { UpdateTaskCommand } from '@/server/modules/task/features/update-task/handler'
import { UpdateTaskSchema } from '@/server/modules/task/features/update-task/schema'

export const GET = createRoute(
  {
    auth: { allowedOrgRoles: 'ANY' },
    params: TaskIdParams,
    pathPattern: '/api/db/organization/:organizationId/task/:taskId',
  },
  async (_req, { session, ctx }, { params }) => {
    const isAdmin = (
      [OrganizationRole.ADMIN, OrganizationRole.OWNER] as OrganizationRole[]
    ).includes(session.user.orgRole as OrganizationRole)

    const data = await GetTaskQuery(ctx)(
      params.taskId,
      session.user.id ?? '',
      isAdmin,
    )

    return Response.json({ success: true, data })
  },
)

export const PUT = createRoute(
  {
    auth: { allowedOrgRoles: 'ANY' },
    params: TaskIdParams,
    body: UpdateTaskSchema,
    pathPattern: '/api/db/organization/:organizationId/task/:taskId',
  },
  async (_req, { session, ctx }, { params, body }) => {
    const isAdmin = (
      [OrganizationRole.ADMIN, OrganizationRole.OWNER] as OrganizationRole[]
    ).includes(session.user.orgRole as OrganizationRole)

    const data = await UpdateTaskCommand(ctx)(
      params.taskId,
      session.user.id ?? '',
      isAdmin,
      body,
    )

    return Response.json({ success: true, data })
  },
)

export const DELETE = createRoute(
  {
    auth: { allowedOrgRoles: 'ANY' },
    params: TaskIdParams,
    pathPattern: '/api/db/organization/:organizationId/task/:taskId',
  },
  async (_req, { session, ctx }, { params }) => {
    const isAdmin = (
      [OrganizationRole.ADMIN, OrganizationRole.OWNER] as OrganizationRole[]
    ).includes(session.user.orgRole as OrganizationRole)

    await DeleteTaskCommand(ctx)(params.taskId, session.user.id ?? '', isAdmin)

    return Response.json(
      { success: true, message: 'Task deleted successfully' },
      { status: 200 },
    )
  },
)
