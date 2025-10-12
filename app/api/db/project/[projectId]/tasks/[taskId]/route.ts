import { Role } from '@prisma/client'
import { TaskController } from '@server/controllers/taskController'
import { exceptionHandler } from '@server/utils/exceptionHandler'
import { withAuth } from '@withAuth'

export const GET = withAuth(
  Object.values(Role),
  exceptionHandler(TaskController.getTaskById),
)

export const PUT = withAuth(
  Object.values(Role),
  exceptionHandler(TaskController.updateTask),
)

export const DELETE = withAuth(
  Object.values(Role),
  exceptionHandler(TaskController.deleteTask),
)
