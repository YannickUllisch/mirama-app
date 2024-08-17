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

    const response = await db.task.findMany({
      where: {
        assignedToId: session?.user.id,
        teamId: session?.user.teamId ?? 'undefined',
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
