import { OrganizationRole } from '@prisma/client'
import { TaskController } from '@server/controllers/taskController'
import { exceptionHandler } from '@server/utils/exceptionHandler'
import { withAuth } from '@withAuth'

export const GET = withAuth(
  Object.values(OrganizationRole),
  exceptionHandler(TaskController.getTasksByProject),
)

export const POST = withAuth(
  Object.values(OrganizationRole),
  exceptionHandler(TaskController.createTask),
)
export const DELETE = withAuth(
  Object.values(OrganizationRole),
  exceptionHandler(TaskController.deleteTasks),
)
