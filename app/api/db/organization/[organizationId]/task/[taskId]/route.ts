import { createRoute } from '@/server/middleware/createRoute'
import { DeleteTaskCommand } from '@/server/modules/task/features/delete-task/handler'
import { GetTaskQuery } from '@/server/modules/task/features/get-task/handler'
import { TaskIdParams } from '@/server/modules/task/features/get-task/schema'
import { UpdateTaskCommand } from '@/server/modules/task/features/update-task/handler'
import { UpdateTaskSchema } from '@/server/modules/task/features/update-task/schema'
import { P } from '@/server/shared/domain/permissions'

export const GET = createRoute(
  {
    auth: { permissions: P.task.read },
    params: TaskIdParams,
    pathPattern: '/api/db/organization/:organizationId/task/:taskId',
  },
  async (_req, { session, ctx }, { params }) => {
    const data = await GetTaskQuery(ctx)(params.taskId, session.user.id ?? '')

    return Response.json({ success: true, data })
  },
)

export const PUT = createRoute(
  {
    auth: { permissions: P.task.update },
    params: TaskIdParams,
    body: UpdateTaskSchema,
    pathPattern: '/api/db/organization/:organizationId/task/:taskId',
  },
  async (_req, { session, ctx }, { params, body }) => {
    const data = await UpdateTaskCommand(ctx)(
      params.taskId,
      session.user.id ?? '',
      body,
    )

    return Response.json({ success: true, data })
  },
)

export const DELETE = createRoute(
  {
    auth: { permissions: P.task.delete },
    params: TaskIdParams,
    pathPattern: '/api/db/organization/:organizationId/task/:taskId',
  },
  async (_req, { session, ctx }, { params }) => {
    await DeleteTaskCommand(ctx)(params.taskId, session.user.id ?? '')

    return Response.json(
      { success: true, message: 'Task deleted successfully' },
      { status: 200 },
    )
  },
)
