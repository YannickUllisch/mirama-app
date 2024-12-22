import { db } from '@db'

export const fetchMilestonesByProjectId = async (pid: string) => {
  const project = await db.milestone.findMany({
    where: {
      projectId: pid,
    },
  })

  return project
}
