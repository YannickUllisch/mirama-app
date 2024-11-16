import { auth } from '@auth'
import { fetchProjectUsersByProjectId } from '@src/lib/api/queries/Project/UserQuerys'
import { validateRequest } from '@src/lib/validateRequest'

export const GET = auth(async (req) => {
  try {
    // Checking Permissions

    const session = req.auth
    const validatedRequest = await validateRequest(session)
    if (validatedRequest) {
      return validatedRequest
    }

    const id = req.nextUrl.searchParams.get('id') as string
    if (!id) {
      return Response.json(
        { ok: false, message: 'Project ID needs to be defined in request' },
        { status: 400 },
      )
    }
    const response = await fetchProjectUsersByProjectId(id)

    return Response.json(response, { status: 200 })
  } catch (err) {
    return Response.json(
      { ok: false, message: `Failed with Error ${err}` },
      { status: 500 },
    )
  }
})
