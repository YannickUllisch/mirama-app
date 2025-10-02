import { Role } from '@prisma/client'
import { ProjectUserController } from '@server/controllers/projectUserController'
import { exceptionHandler } from '@server/utils/exceptionHandler'
import { withAuth } from '@withAuth'

export const GET = withAuth(
  Object.values(Role),
  exceptionHandler(ProjectUserController.getProjectUsersController),
)

export const PUT = withAuth(
  Object.values(Role),
  exceptionHandler(ProjectUserController.updateProjectUsersController),
)
