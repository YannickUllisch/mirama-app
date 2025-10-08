import { Role } from '@prisma/client'
import { CommentController } from '@server/controllers/commentController'
import { exceptionHandler } from '@server/utils/exceptionHandler'
import { withAuth } from '@withAuth'

export const POST = withAuth(
  Object.values(Role),
  exceptionHandler(CommentController.createComment),
)
