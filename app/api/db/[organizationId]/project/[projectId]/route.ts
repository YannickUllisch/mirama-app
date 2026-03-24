import { OrganizationRole } from '@prisma/client'
import { ProjectController } from '@server/controllers/projectController'
import { exceptionHandler } from '@server/utils/exceptionHandler'
import { withAuth } from '@withAuth'

export const GET = withAuth(
  Object.values(OrganizationRole),
  exceptionHandler(ProjectController.getProjectById),
)

export const PUT = withAuth(
  Object.values(OrganizationRole),
  exceptionHandler(ProjectController.updateProject),
)

export const DELETE = withAuth(
  [OrganizationRole.ADMIN, OrganizationRole.OWNER],
  exceptionHandler(ProjectController.deleteProjectById),
)
