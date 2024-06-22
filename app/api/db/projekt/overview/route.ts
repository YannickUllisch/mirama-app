import { db } from '@src/lib/db'
import { auth } from '@/src/lib/auth'
import { validateRequest } from '@/src/lib/utils'

export const GET = auth(async (req) => {
  try {
    // Checking Permissions
    const session = req.auth
    const validatedRequest = await validateRequest(session)
    if (validatedRequest) {
      return validatedRequest
    }

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
