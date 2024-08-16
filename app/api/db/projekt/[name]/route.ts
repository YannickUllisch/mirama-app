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

    // Extracting name from dynamic route
    // TODO: find better way to do this
    const name = req.nextUrl.pathname.split('/').pop()

    if (!name) {
      return Response.json(
        { ok: false, message: 'Project ID needs to be defined in request' },
        { status: 400 },
      )
    }

    const response = await db.project.findFirst({
      where: {
        name,
      },
      include: {
        users: {
          include: {
            user: true,
          },
        },
        tasks: true,
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
