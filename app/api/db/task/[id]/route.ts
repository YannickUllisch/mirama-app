import { auth } from '@auth'
import { validateRequest } from '@src/lib/validateRequest'
import { fetchTaskById } from '@src/lib/api/queries/Tasks/TaskQueries'

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

    const response = fetchTaskById(id)

    return Response.json(response, { status: 200 })
  } catch (err) {
    return Response.json(
      { ok: false, message: `Failed with Error ${err}` },
      { status: 500 },
    )
  }
})
