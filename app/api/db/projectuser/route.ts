import { auth } from '@auth'
import { validateRequest } from '@src/lib/validateRequest'
import { fetchProjectUsersJoinedByProjectId } from '@src/lib/api/queries/Project/ProjectUserJoinQuerys'

export const GET = auth(async (req) => {
  try {
    const session = req.auth
    const validatedRequest = await validateRequest(session)
    if (validatedRequest) {
      return validatedRequest
    }

    const projectId = req.nextUrl.searchParams.get('projectId') as string

    const response = await fetchProjectUsersJoinedByProjectId(projectId)

    return Response.json(response, { status: 200 })
  } catch (err) {
    return Response.json(
      { ok: false, message: `Failed with Error ${err}` },
      { status: 500 },
    )
  }
})
