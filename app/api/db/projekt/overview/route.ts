import { db } from '@src/lib/db'
import { auth } from '@src/lib/auth'
import { validateRequest } from '@src/lib/validateRequest'

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

    return Response.json(response, { status: 200 })
  } catch (err) {
    return Response.json(
      { ok: false, message: `Failed with Error ${err}` },
      { status: 500 },
    )
  }
})
