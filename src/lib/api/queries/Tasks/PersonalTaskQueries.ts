import { db } from '@db'
import type { Session } from 'next-auth'

export const fetchAllPersonalTasks = async (session: Session | null) => {
  const response = await db.task.findMany({
    where: {
      assignedToId: session?.user.id,
      teamId: session?.user.teamId ?? 'undefined',
    },
  })
  return response
}

export const fetchPersonalTasksByProjectId = async (
  id: string,
  session: Session | null,
) => {
  const response = await db.task.findMany({
    where: {
      projectId: id,
      assignedToId: session?.user.id,
      teamId: session?.user.teamId ?? 'undefined',
    },
  })
  return response
}
