import { OrganizationRole } from '@prisma/client'
import { TeamController } from '@server/controllers/organization/memberController'
import { exceptionHandler } from '@server/utils/exceptionHandler'
import { withAuth } from '@withAuth'

export const GET = withAuth(
  Object.values(OrganizationRole),
  exceptionHandler(TeamController.getTeamMembers),
)
