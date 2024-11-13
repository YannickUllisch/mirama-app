import { db } from '@db'
import type { Session } from 'next-auth'

export const fetchAllTeamTags = async (session: Session | null) => {
  const response = await db.tag.findMany({
    where: {
      teamId: session?.user.teamId,
    },
  })
  return response
}
