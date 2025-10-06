import db from '@db'
import { TaskStatusType } from '@prisma/client'
import type { TaskResponseType } from '@server/domain/taskSchema'
import { TaskMapper } from '@server/mapping/task'

const getTasksByProjectId = async (
  pid: string,
  teamId: string,
  ignoreCompleted: boolean,
) => {
  const res = await db.task.findMany({
    where: {
      project: {
        id: pid,
        teamId,
      },
      ...(ignoreCompleted && {
        status: {
          not: TaskStatusType.DONE,
        },
      }),
    },

    include: {
      assignedTo: true,
      subtasks: true,
      tags: true,
      parent: true,
      comments: {
        include: {
          user: true,
        },
      },
      project: { select: { id: true, name: true } },
    },
    orderBy: {
      status: 'asc',
    },
  })

  return res.map((r) => TaskMapper.mapDefaultToApi(r))
}

const getTaskById = async (
  id: string,
  teamId: string,
): Promise<TaskResponseType> => {
  const res = await db.task.findFirst({
    where: {
      id,
      teamId,
    },
    include: {
      assignedTo: true,
      subtasks: true,
      tags: true,
      parent: true,
      comments: {
        include: {
          user: true,
        },
      },
      project: { select: { id: true, name: true } },
    },
  })

  if (!res) throw new Error('Task not found')

  return TaskMapper.mapDefaultToApi(res)
}

export const TaskService = {
  getTasksByProjectId,
  getTaskById,
}
