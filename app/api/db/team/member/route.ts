import { Role } from '@prisma/client'
import { UserController } from '@server/controllers/userController'
import { exceptionHandler } from '@server/utils/exceptionHandler'
import { withAuth } from '@withAuth'

export const GET = withAuth(
  Object.values(Role),
  exceptionHandler(UserController.getTeamMembersController),
)

export const DELETE = withAuth(
  [Role.ADMIN, Role.OWNER],
  exceptionHandler(UserController.deleteTeamMembersController),
)

export const PUT = withAuth(
  [Role.ADMIN, Role.OWNER],
  exceptionHandler(UserController.updateTeamMembersController),
)
