import { db } from '@db'

export const fetchTasksByProjectId = async (id: string) => {
  const response = await db.task.findMany({
    where: {
      project: {
        id,
      },
    },
    include: {
      assignedTo: true,
      tags: true,
      category: true,
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
      tags: true,
      parent: true,
      subtasks: true,
      category: true,
    },
  })
  return task
}
