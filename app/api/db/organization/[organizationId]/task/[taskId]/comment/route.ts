import { createRoute } from '@/server/middleware/createRoute'
import {
  CreateCommentCommand,
  GetCommentsQuery,
} from '@/server/modules/task/features/comments/handler'
import { CreateCommentSchema } from '@/server/modules/task/features/comments/schema'
import { TaskIdParams } from '@/server/modules/task/features/get-task/schema'

export const GET = createRoute(
  {
    auth: {},
    params: TaskIdParams,
    pathPattern: '/api/db/organization/:organizationId/task/:taskId/comment',
  },
  async (_req, { session, ctx }, { params }) => {
    const data = await GetCommentsQuery(ctx)(
      params.taskId,
      session.user.id ?? '',
    )

    return Response.json({ success: true, data })
  },
)

export const POST = createRoute(
  {
    auth: {},
    params: TaskIdParams,
    body: CreateCommentSchema,
    pathPattern: '/api/db/organization/:organizationId/task/:taskId/comment',
  },
  async (_req, { ctx }, { params, body }) => {
    const data = await CreateCommentCommand(ctx)(params.taskId, body)

    return Response.json({ success: true, data }, { status: 201 })
  },
)
