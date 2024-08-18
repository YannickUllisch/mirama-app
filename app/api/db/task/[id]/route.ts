import { db } from '@src/lib/db'
import { auth } from '@src/lib/auth'
import { validateRequest } from '@src/lib/validateRequest'
import { redirect } from 'next/navigation'

export const GET = auth(async (req) => {
  try {
    // Checking Permissions
    const session = req.auth
    const validatedRequest = await validateRequest(session)
    if (validatedRequest) {
      return validatedRequest
    }

    const id = req.nextUrl.pathname.split('/').pop()
    if (!id) {
      return Response.json(
        { ok: false, message: 'Task ID needs to be defined in request' },
        { status: 400 },
      )
    }

    const response = await db.task.findFirst({
      where: {
        id,
      },
      include: {
        assignedTo: true,
        project: {
          include: {
            users: {
              include: {
                user: true,
              },
            },
          },
        },
        tags: true,
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
