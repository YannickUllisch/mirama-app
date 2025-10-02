import { auth } from '@server/auth/auth'
import db from '@db'
import { reconstructPrismaSelect } from '@src/lib/api/APIReconstructions'
import { validateRequest } from '@src/lib/validateRequest'

export const GET = auth(async (req) => {
  try {
    // Checking Permissions
    const session = req.auth
    const validatedRequest = await validateRequest(session)
    if (validatedRequest) {
      return validatedRequest
    }

    const { searchParams } = new URL(req.url)

    // Extracting Archived status
    const selectQuery = searchParams.getAll('select[]')

    // Extract select fields from select object format and parse all selections
    const prismaSelection = reconstructPrismaSelect({
      prismaModel: 'Task',
      rawSelectQuery: selectQuery,
    })

    const response = await db.task.findMany({
      where: {
        assignedToId: session?.user.id,
        teamId: session?.user.teamId ?? 'undefined',
        project: {
          archived: false,
        },
      },
      select: {
        ...prismaSelection,
        id: true,
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
