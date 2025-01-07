import db from '@db'
import type { Session } from 'next-auth'

export const fetchSessionTeam = async (session: Session) => {
  const response = await db.team.findFirst({
    where: {
      id: session.user.teamId ?? 'undefined',
    },
  })
  return response
}
