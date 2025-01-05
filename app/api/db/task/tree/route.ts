import { auth } from '@auth'
import { fetchTasksByProjectId } from '@src/lib/api/queries/Tasks/TaskQueries'
import { createTree } from '@src/lib/data-structures/Tree'
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
    const ignoreCompleted =
      (req.nextUrl.searchParams.get('ignoreCompleted') as string) === 'true'

    if (!id) {
      return Response.json(
        { ok: false, message: 'ProjectId needs to be defined in request' },
        { status: 400 },
      )
    }

    const response = await fetchTasksByProjectId(id, ignoreCompleted)

    const tree = createTree(response, 'subtasks')

    return Response.json(tree, { status: 200 })
  } catch (err: any) {
    return Response.json(
      { ok: false, message: `Failed with Error ${err}` },
      { status: 500 },
    )
  }
})
