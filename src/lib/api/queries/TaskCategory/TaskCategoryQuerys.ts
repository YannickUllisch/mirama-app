import { db } from '@db'

export const fetchTaskCategoriesByProject = async (projectId: string) => {
  const response = await db.taskCategory.findMany({
    where: {
      projectId,
    },
  })

  return response
}
