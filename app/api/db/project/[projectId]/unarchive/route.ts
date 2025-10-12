import { Role } from '@prisma/client'
import { ProjectController } from '@server/controllers/projectController'
import { exceptionHandler } from '@server/utils/exceptionHandler'
import { withAuth } from '@withAuth'

export const POST = withAuth(
  [Role.ADMIN, Role.OWNER],
  exceptionHandler(ProjectController.archiveProject),
)
