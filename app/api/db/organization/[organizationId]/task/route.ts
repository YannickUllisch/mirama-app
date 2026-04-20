import { createRoute } from '@/server/middleware/createRoute'
import { CreateTaskCommand } from '@/server/modules/task/features/create-task/handler'
import { CreateTaskSchema } from '@/server/modules/task/features/create-task/schema'
import { DeleteTasksBulkCommand } from '@/server/modules/task/features/delete-task/handler'
import { DeleteTasksBulkSchema } from '@/server/modules/task/features/delete-task/schema'
import {
  GetPersonalTasksQuery,
  GetTasksByProjectQuery,
} from '@/server/modules/task/features/get-tasks/handler'

export const GET = createRoute(
  {
    auth: {},
    pathPattern: '/api/db/organization/:organizationId/task',
  },
  async (req, { session, ctx }) => {
    const projectId = req.nextUrl.searchParams.get('projectId')
    const personal = req.nextUrl.searchParams.get('personal') === 'true'
    const ignoreCompleted =
      req.nextUrl.searchParams.get('ignoreCompleted') === 'true'

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
      ignoreCompleted,
    )

    return Response.json({ success: true, data })
  },
)

export const POST = createRoute(
  {
    auth: {},
    body: CreateTaskSchema,
    pathPattern: '/api/db/organization/:organizationId/task',
  },
  async (_req, { session, ctx }, { body }) => {
    const data = await CreateTaskCommand(ctx)(session.user.id ?? '', body)

    return Response.json({ success: true, data }, { status: 201 })
  },
)

export const DELETE = createRoute(
  {
    auth: {},
    body: DeleteTasksBulkSchema,
    pathPattern: '/api/db/organization/:organizationId/task',
  },
  async (_req, { session, ctx }, { body }) => {
    await DeleteTasksBulkCommand(ctx)(
      body.ids,
      body.projectId,
      session.user.id ?? '',
    )

    return Response.json(
      { success: true, message: 'Tasks deleted successfully' },
      { status: 200 },
    )
  },
)
