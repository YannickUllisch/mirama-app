import { db } from '@src/lib/db'
import { auth } from '@/auth'
import { Role, PriorityType, StatusType, type Project } from '@prisma/client'
import { DateTime } from 'luxon'

export const GET = auth(async (req) => {
  try {
    const session = req.auth
    const response = await db.project.findMany({
      where: {
        teamId: session?.user.teamId,
        archived: false,
        OR: [
          { managedById: session?.user.id },
          { tasks: { some: { assignedToId: session?.user.id } } },
        ],
      },
      include: {
        tasks: true,
        managedBy: true,
      },
    })

    return new Response(JSON.stringify(response))
  } catch (err) {
    return new Response(JSON.stringify(err))
  }
})
