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

    const name = req.nextUrl.searchParams.get('name') as string

    if (!name) {
      return Response.json(
        { ok: false, message: 'Project Name needs to be defined in request' },
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
