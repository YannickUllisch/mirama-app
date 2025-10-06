import { TaskService } from '@server/services/task/taskService'
import { getDynamicRoute } from '@server/utils/getDynamicRoute'
import type { Session } from 'next-auth'
import type { NextRequest } from 'next/server'

const getTasksByProject = async (req: NextRequest, session: Session) => {
  const pid = req.nextUrl.searchParams.get('projectId') as string
  const ignoreCompleted =
    (req.nextUrl.searchParams.get('ignoreCompleted') as string) === 'true'

  if (!pid) {
    return Response.json(
      { ok: false, message: 'Project ID needs to be defined in query' },
      { status: 400 },
    )
  }

  const tasks = await TaskService.getTasksByProjectId(
    pid,
    session.user.teamId,
    ignoreCompleted,
  )
  return Response.json(tasks, { status: 200 })
}

const getTaskById = async (req: NextRequest, session: Session) => {
  const id = getDynamicRoute(req)
  const task = await TaskService.getTaskById(id, session.user.teamId)
  return Response.json(task, { status: 200 })
}

export const TaskController = {
  getTasksByProject,
  getTaskById,
}
