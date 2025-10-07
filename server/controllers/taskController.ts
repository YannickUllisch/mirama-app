import { TaskService } from '@server/services/task/taskService'
import { getDynamicRoute } from '@server/utils/getDynamicRoute'
import { isTeamAdminOrOwner } from '@src/lib/utils'
import type { Session } from 'next-auth'
import type { NextRequest } from 'next/server'

const getTasksByProject = async (req: NextRequest, session: Session) => {
  const pid = req.nextUrl.searchParams.get('projectId')
  const ignoreCompleted =
    req.nextUrl.searchParams.get('ignoreCompleted') === 'true'

  if (!pid) {
    return Response.json(
      { ok: false, message: 'Project ID needs to be defined in query' },
      { status: 400 },
    )
  }

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

const getTaskById = async (req: NextRequest, session: Session) => {
  const id = getDynamicRoute(req)

  const roleCheck = isTeamAdminOrOwner(session)

  const task = await TaskService.getTaskById(
    id,
    session.user.teamId,
    session.user.id ?? '',
    roleCheck,
  )
  return Response.json(task, { status: 200 })
}

const getPersonalTasks = async (req: NextRequest, session: Session) => {
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
}
