import { Role } from '@prisma/client'
import { TagController } from '@server/controllers/tagController'
import { exceptionHandler } from '@server/utils/exceptionHandler'
import { withAuth } from '@withAuth'

export const GET = withAuth(
  Object.values(Role),
  exceptionHandler(TagController.getTags),
)

export const POST = withAuth(
  [Role.OWNER, Role.ADMIN],
  exceptionHandler(TagController.createTag),
)
