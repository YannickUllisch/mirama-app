import { OrganizationRole } from '@prisma/client'
import { CommentController } from '@server/controllers/commentController'
import { exceptionHandler } from '@server/utils/exceptionHandler'
import { withAuth } from '@withAuth'

export const PUT = withAuth(
  Object.values(OrganizationRole),
  exceptionHandler(CommentController.updateComment),
)

export const DELETE = withAuth(
  Object.values(OrganizationRole),
  exceptionHandler(CommentController.deleteComment),
)
