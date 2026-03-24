import { OrganizationRole } from '@prisma/client'
import { ProjectController } from '@server/controllers/projectController'
import { exceptionHandler } from '@server/utils/exceptionHandler'
import { withAuth } from '@withAuth'

export const POST = withAuth(
  [OrganizationRole.ADMIN, OrganizationRole.OWNER],
  exceptionHandler(ProjectController.archiveProject),
)
