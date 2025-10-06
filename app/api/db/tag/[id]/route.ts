import { Role } from '@prisma/client'
import { TagController } from '@server/controllers/tagController'
import { exceptionHandler } from '@server/utils/exceptionHandler'
import { withAuth } from '@withAuth'

export const PUT = withAuth(
  [Role.OWNER, Role.ADMIN],
  exceptionHandler(TagController.updateTag),
)

export const DELETE = withAuth(
  [Role.OWNER, Role.ADMIN],
  exceptionHandler(TagController.deleteTag),
)
