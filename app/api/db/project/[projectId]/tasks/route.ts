import { Role } from '@prisma/client'
import { TaskController } from '@server/controllers/taskController'
import { exceptionHandler } from '@server/utils/exceptionHandler'
import { withAuth } from '@withAuth'

export const GET = withAuth(
  Object.values(Role),
  exceptionHandler(TaskController.getTasksByProject),
)

export const POST = withAuth(
  Object.values(Role),
  exceptionHandler(TaskController.createTask),
)
export const DELETE = withAuth(
  Object.values(Role),
  exceptionHandler(TaskController.deleteTasks),
)
