import { db } from '@db'

export const fetchTasksByProjectId = async (
  id: string,
  ignoreCompleted?: boolean,
) => {
  const response = await db.task.findMany({
    where: {
      project: {
        id,
      },
      ...(ignoreCompleted && {
        status: {
          not: 'DONE',
        },
      }),
    },

    include: {
      assignedTo: true,
      subtasks: true,
      tags: {
        include: {
          tag: true,
        },
      },
      comments: true,
    },
    orderBy: {
      priority: 'asc',
    },
  })

  return response
}

export const fetchTaskById = async (id: string) => {
  const task = await db.task.findFirst({
    where: {
      id,
    },
    include: {
      assignedTo: true,
      tags: {
        include: {
          tag: true,
        },
      },
      parent: true,
      subtasks: true,
    },
  })
  return task
}
