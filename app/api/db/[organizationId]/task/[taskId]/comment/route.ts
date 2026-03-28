import { createRoute } from '@/server/middleware/createRoute'
import {
  CreateCommentCommand,
  GetCommentsQuery,
} from '@/server/modules/task/features/comments/handler'
import { CreateCommentSchema } from '@/server/modules/task/features/comments/schema'
import { TaskIdParams } from '@/server/modules/task/features/get-task/schema'
import { OrganizationRole } from '@prisma/client'

export const GET = createRoute(
  {
    auth: { allowedOrgRoles: 'ANY' },
    params: TaskIdParams,
    pathPattern: '/api/db/:organizationId/task/:taskId/comment',
  },
  async (_req, { session, ctx }, { params }) => {
    const isAdmin = [OrganizationRole.ADMIN, OrganizationRole.OWNER].includes(
      session.user.orgRole as any,
    )

    const data = await GetCommentsQuery(ctx)(
      params.taskId,
      session.user.id ?? '',
      isAdmin,
    )

    return Response.json({ success: true, data })
  },
)

export const POST = createRoute(
  {
    auth: { allowedOrgRoles: 'ANY' },
    params: TaskIdParams,
    body: CreateCommentSchema,
    pathPattern: '/api/db/:organizationId/task/:taskId/comment',
  },
  async (_req, { ctx }, { params, body }) => {
    const data = await CreateCommentCommand(ctx)(params.taskId, body)

    return Response.json({ success: true, data }, { status: 201 })
  },
)
