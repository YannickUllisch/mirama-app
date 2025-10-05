import { Role } from '@prisma/client'
import { ProjectController } from '@server/controllers/projectController'
import { exceptionHandler } from '@server/utils/exceptionHandler'
import { withAuth } from '@withAuth'

export const GET = withAuth(
  Object.values(Role),
  exceptionHandler(ProjectController.getProjectById),
)

export const PUT = withAuth(
  Object.values(Role),
  exceptionHandler(ProjectController.updateProject),
)

export const DELETE = withAuth(
  [Role.ADMIN, Role.OWNER],
  exceptionHandler(ProjectController.deleteProjectById),
)
