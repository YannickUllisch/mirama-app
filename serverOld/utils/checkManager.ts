import db from '@/serverOld/utils/db'

export const checkIfManager = async (projectId: string, userId: string) => {
  const relation = await db.projectMember.findFirst({
    where: {
      projectId,
      memberId: userId,
    },
    select: {
      isManager: true,
    },
  })
  return relation?.isManager ?? false
}
