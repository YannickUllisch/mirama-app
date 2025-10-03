import { Role } from '@prisma/client'
import { ProjectController } from '@server/controllers/projectController'
import { exceptionHandler } from '@server/utils/exceptionHandler'
import { withAuth } from '@withAuth'

export const GET = withAuth(
  Object.values(Role),
  exceptionHandler(ProjectController.getDefaultProjectController),
)
