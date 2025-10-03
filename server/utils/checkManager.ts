import db from '@db'

export const checkIfManager = async (projectId: string, userId: string) => {
  const relation = await db.projectUser.findFirst({
    where: {
      projectId,
      userId,
    },
    select: {
      isManager: true,
    },
  })
  return relation?.isManager ?? false
}
