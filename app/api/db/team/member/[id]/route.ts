import { Role } from '@prisma/client'
import { UserController } from '@server/controllers/teamController'
import { exceptionHandler } from '@server/utils/exceptionHandler'
import { withAuth } from '@withAuth'

export const DELETE = withAuth(
  [Role.ADMIN, Role.OWNER],
  exceptionHandler(UserController.deleteTeamMember),
)

export const PUT = withAuth(
  [Role.ADMIN, Role.OWNER],
  exceptionHandler(UserController.updateTeamMember),
)
