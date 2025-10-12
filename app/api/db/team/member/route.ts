import { Role } from '@prisma/client'
import { TeamController } from '@server/controllers/teamController'
import { exceptionHandler } from '@server/utils/exceptionHandler'
import { withAuth } from '@withAuth'

export const GET = withAuth(
  Object.values(Role),
  exceptionHandler(TeamController.getTeamMembers),
)
