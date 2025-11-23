import { Role } from '@prisma/client'
import { ProjectController } from '@server/controllers/projectController'
import { exceptionHandler } from '@server/utils/exceptionHandler'
import { withAuth } from '@withAuth'

export const GET = withAuth(
  Object.values(Role),
  exceptionHandler(ProjectController.getAllProjects),
)

export const POST = withAuth(
  [Role.OWNER, Role.ADMIN],
  exceptionHandler(ProjectController.createProject),
)
