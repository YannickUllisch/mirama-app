import { auth } from '@auth'
import { validateRequest } from '@src/lib/validateRequest'
import { fetchSingleProjectById } from '@src/lib/api/queries/Project/ProjectQuerys'
import type { NextRequest } from 'next/server'
import { Role } from '@prisma/client'

export const GET = async (req: NextRequest) => {
  try {
    // Checking Permissions
    const session = await auth()
    const validatedRequest = await validateRequest(session)
    if (validatedRequest) {
      return validatedRequest
    }

    // Extracting name from dynamic route
    // TODO: find better way to do this
    const id = req.nextUrl.pathname.split('/').pop()

    if (!id) {
      return Response.json(
        { ok: false, message: 'Project ID needs to be defined in request' },
        { status: 400 },
      )
    }

    const response = await fetchSingleProjectById(id)

    return Response.json(response, { status: 200 })
  } catch (err) {
    return Response.json(
      { ok: false, message: `Failed with Error ${err}` },
      { status: 500 },
    )
  }
}
