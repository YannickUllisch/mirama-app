import { db } from '@db'
import type { Session } from 'next-auth'

export const fetchAllTeamMembers = async (session: Session | null) => {
  const members = await db.user.findMany({
    where: {
      teamId: session?.user.teamId ?? 'undefined',
    },
    orderBy: {
      role: 'asc',
    },
  })

  return members
}
