import { OrganizationRole } from '@prisma/client'
import { CommentController } from '@server/controllers/commentController'
import { exceptionHandler } from '@server/utils/exceptionHandler'
import { withAuth } from '@withAuth'

export const GET = withAuth(
  Object.values(OrganizationRole),
  exceptionHandler(CommentController.getCommentsByTaskId),
)

export const POST = withAuth(
  Object.values(OrganizationRole),
  exceptionHandler(CommentController.createComment),
)
