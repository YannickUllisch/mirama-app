import { createRoute } from '@/server/middleware/createRoute'
import {
  DeleteCommentCommand,
  UpdateCommentCommand,
} from '@/server/modules/task/features/comments/handler'
import {
  CommentIdParams,
  UpdateCommentSchema,
} from '@/server/modules/task/features/comments/schema'

export const PUT = createRoute(
  {
    auth: {},
    params: CommentIdParams,
    body: UpdateCommentSchema,
    pathPattern:
      '/api/db/organization/:organizationId/task/:taskId/comment/:commentId',
  },
  async (_req, { session, ctx }, { params, body }) => {
    const data = await UpdateCommentCommand(ctx)(
      params.commentId,
      session.user.id ?? '',
      body,
    )

    return Response.json({ success: true, data })
  },
)

export const DELETE = createRoute(
  {
    auth: {},
    params: CommentIdParams,
    pathPattern:
      '/api/db/organization/:organizationId/task/:taskId/comment/:commentId',
  },
  async (_req, { session, ctx }, { params }) => {
    await DeleteCommentCommand(ctx)(params.commentId, session.user.id ?? '')

    return Response.json(
      { success: true, message: 'Comment deleted successfully' },
      { status: 200 },
    )
  },
)
