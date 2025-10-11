import {} from '@server/domain/taskSchema'
import { TaskService } from '@server/services/task/taskService'
import { pickFromTail } from '@server/utils/getDynamicRoute'
import { isTeamAdminOrOwner } from '@src/lib/utils'
import type { Session } from 'next-auth'
import type { NextRequest } from 'next/server'
import type { Logger } from 'pino'

/**
 * Assumed route: /api/db/project/{projectId}/tasks
 * @param req API request object as Next Request Type
 * @param session Validated Session from request
 * @param _logger Context Logger
 */
const getTasksByProject = async (
  req: NextRequest,
  session: Session,
  _logger: Logger,
) => {
  const [pid] = pickFromTail(req, [1])
  const ignoreCompleted =
    req.nextUrl.searchParams.get('ignoreCompleted') === 'true'

  const roleCheck = isTeamAdminOrOwner(session)

  const tasks = await TaskService.getTasksByProjectId(
    pid,
    session.user.teamId,
    ignoreCompleted,
    session.user.id ?? '',
    roleCheck,
  )
  return Response.json(tasks, { status: 200 })
}

/**
 * Assumed route: /api/db/project/{projectId}/tasks
 * @param req API request object as Next Request Type
 * @param session Validated Session from request
 * @param _logger Context Logger
 */
// const createTask = async (
//   req: NextRequest,
//   session: Session,
//   _logger: Logger,
// ) => {
//   const [pid] = pickFromTail(req, [1])
//   const body = await req.json()
//   const parsedBody = CreateTaskSchema.parse(body)
//   const task = await TaskService.cr
// }

/**
 * Assumed route: /api/db/project/{projectId}/tasks
 * @param req API request object as Next Request Type
 * @param session Validated Session from request
 * @param _logger Context Logger
 */
// const deleteTasks = async (
//   req: NextRequest,
//   session: Session,
//   _logger: Logger,
// ) => {
//   const [pid] = pickFromTail(req, [1])
//   const ids = (await req.json()) as string[]
// }

/**
 * Assumed route: /api/db/project/{projectId}/tasks/${taskId}
 * @param req API request object as Next Request Type
 * @param session Validated Session from request
 * @param _logger Context Logger
 */
const getTaskById = async (
  req: NextRequest,
  session: Session,
  _logger: Logger,
) => {
  const [tid, pid] = pickFromTail(req, [0, 2])

  const roleCheck = isTeamAdminOrOwner(session)

  const task = await TaskService.getTaskById(
    tid,
    pid,
    session.user.teamId,
    session.user.id ?? '',
    roleCheck,
  )
  return Response.json(task, { status: 200 })
}

/**
 * Assumed route: /api/db/project/{projectId}/tasks/${taskId}
 * @param req API request object as Next Request Type
 * @param session Validated Session from request
 * @param _logger Context Logger
 */
// const updateTask = async (
//   req: NextRequest,
//   session: Session,
//   _logger: Logger,
// ) => {
//   const id = fromTail(req)
//   const body = await req.json()
//   const parsedBody = UpdateTaskSchema.parse(body)
// }

/**
 * Assumed route: /api/db/project/{projectId}/tasks/${taskId}
 * @param req API request object as Next Request Type
 * @param session Validated Session from request
 * @param _logger Context Logger
 */
// const deleteTask = async (
//   req: NextRequest,
//   session: Session,
//   _logger: Logger,
// ) => {
//   const [tid, pid] = pickFromTail(req, [0, 2])
//   const ids = (await req.json()) as string[]
// }

/**
 * Assumed route: /api/db/team/member/tasks
 * @param req API request object as Next Request Type
 * @param session Validated Session from request
 * @param _logger Context Logger
 */
const getPersonalTasks = async (
  req: NextRequest,
  session: Session,
  _logger: Logger,
) => {
  const pid = req.nextUrl.searchParams.get('projectId')

  const tasks = await TaskService.getPersonalTasks(
    session.user.id ?? '',
    session.user.teamId,
    pid ?? undefined,
  )
  return Response.json(tasks, { status: 200 })
}

export const TaskController = {
  getTasksByProject,
  getTaskById,
  getPersonalTasks,
  // createTask,
  // updateTask,
  // deleteTasks,
  // deleteTask,
}
