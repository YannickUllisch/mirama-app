import { auth } from '@auth'
import { validateRequest } from '@src/lib/validateRequest'
import { fetchSingleProjectById } from '@src/lib/api/queries/Project/ProjectQuerys'

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
})
