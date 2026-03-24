import { OrganizationRole } from '@prisma/client'
import { TeamController } from '@server/controllers/organization/memberController'
import { exceptionHandler } from '@server/utils/exceptionHandler'
import { withAuth } from '@withAuth'

export const DELETE = withAuth(
  [OrganizationRole.ADMIN, OrganizationRole.OWNER],
  exceptionHandler(TeamController.deleteTeamMember),
)

export const PUT = withAuth(
  [OrganizationRole.ADMIN, OrganizationRole.OWNER],
  exceptionHandler(TeamController.updateTeamMember),
)
