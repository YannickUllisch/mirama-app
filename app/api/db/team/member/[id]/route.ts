import { Role } from '@prisma/client'
import { TeamController } from '@server/controllers/teamController'
import { exceptionHandler } from '@server/utils/exceptionHandler'
import { withAuth } from '@withAuth'

export const DELETE = withAuth(
  [Role.ADMIN, Role.OWNER],
  exceptionHandler(TeamController.deleteTeamMember),
)

export const PUT = withAuth(
  [Role.ADMIN, Role.OWNER],
  exceptionHandler(TeamController.updateTeamMember),
)
