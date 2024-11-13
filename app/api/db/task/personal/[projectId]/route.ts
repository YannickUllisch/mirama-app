import { db } from '@src/lib/db'
import { auth } from '@auth'
import { validateRequest } from '@src/lib/validateRequest'
import { fetchPersonalTasksByProjectId } from '@src/lib/api/queries/Tasks/PersonalTaskQueries'

export const GET = auth(async (req) => {
  try {
    // Checking Permissions
    const session = req.auth
    const validatedRequest = await validateRequest(session)
    if (validatedRequest) {
      return validatedRequest
    }

    // Extracting name from dynamic route
    const projectId = req.nextUrl.pathname.split('/').pop()

    if (!projectId) {
      return Response.json(
        { ok: false, message: 'Project ID needs to be defined in request' },
        { status: 400 },
      )
    }

    const response = await fetchPersonalTasksByProjectId(projectId, session)

    return Response.json(response, { status: 200 })
  } catch (err) {
    return Response.json(
      { ok: false, message: `Failed with Error ${err}` },
      { status: 500 },
    )
  }
})
