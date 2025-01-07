import db from '@db'

export const fetchProjectUsersJoinedByProjectId = async (id: string) => {
  const users = await db.projectUser.findMany({
    where: {
      projectId: id,
    },
    include: {
      user: true,
    },
  })

  return users
}
