import { auth } from '@auth'
import db from '@db'

export const fetchProjectUsersByProjectId = async (id: string) => {
  const session = await auth()

  const users = await db.user.findMany({
    where: {
      projects: {
        some: {
          projectId: id,
        },
      },
      teamId: session?.user.teamId,
    },
  })

  return users
}
