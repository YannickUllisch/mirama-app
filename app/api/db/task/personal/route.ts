import { auth } from '@auth'
import { validateRequest } from '@src/lib/validateRequest'
import { fetchAllPersonalTasks } from '@src/lib/api/queries/Tasks/PersonalTaskQueries'

export const GET = auth(async (req) => {
  try {
    // Checking Permissions
    const session = req.auth
    const validatedRequest = await validateRequest(session)
    if (validatedRequest) {
      return validatedRequest
    }

    const response = await fetchAllPersonalTasks(session)

    return Response.json(response, { status: 200 })
  } catch (err) {
    return Response.json(
      { ok: false, message: `Failed with Error ${err}` },
      { status: 500 },
    )
  }
})
