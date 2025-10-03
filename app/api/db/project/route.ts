import db from '@db'
import { Role } from '@prisma/client'
import { auth } from '@server/auth/auth'
import { ProjectController } from '@server/controllers/projectController'
import { exceptionHandler } from '@server/utils/exceptionHandler'
import { reconstructPrismaSelect } from '@src/lib/api/APIReconstructions'
import { isTeamAdminOrOwner } from '@src/lib/utils'
import { validateRequest } from '@src/lib/validateRequest'
import { withAuth } from '@withAuth'

export const GET = auth(async (req) => {
  try {
    const session = req.auth
    const validatedRequest = await validateRequest(session)
    if (validatedRequest) {
      return validatedRequest
    }
    const { searchParams } = new URL(req.url)

    // Extracting Archived status
    const archivedStatus = (searchParams.get('archived') as string) === 'true'
    const selectQuery = searchParams.getAll('select[]')

    // Extract select fields from select object format and parse all selections
    const prismaSelection = reconstructPrismaSelect({
      prismaModel: 'Project',
      rawSelectQuery: selectQuery,
    })

    // If Team Owner or Admin, all projects should be returned.
    const response = await db.project.findMany({
      where: {
        teamId: session?.user.teamId,
        archived: archivedStatus ? archivedStatus : false,
        ...(isTeamAdminOrOwner(session)
          ? {} // Admins should see all projects, so remove the `users` filter
          : {
              users: {
                some: {
                  userId: session?.user.id,
                },
              },
            }),
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

export const POST = withAuth(
  [Role.OWNER, Role.ADMIN],
  exceptionHandler(ProjectController.createProjectController),
)

export const DELETE = auth(async (req) => {
  try {
    const session = req.auth
    const validatedRequest = await validateRequest(session, [
      Role.ADMIN,
      Role.OWNER,
    ])
    if (validatedRequest) {
      return validatedRequest
    }

    const ids = (await req.json()) as string[]

    if (!ids || !Array.isArray(ids)) {
      return Response.json(
        { ok: false, message: 'Invalid request body' },
        { status: 400 },
      )
    }

    await db.project.deleteMany({
      where: {
        id: {
          in: ids,
        },
        teamId: session?.user.teamId ?? 'undefined',
      },
    })

    return Response.json(
      { ok: true, message: 'Projects Deleted' },
      { status: 200 },
    )
  } catch (err) {
    return Response.json(
      { ok: false, message: `Failed with Error ${err}` },
      { status: 500 },
    )
  }
})

export const PUT = withAuth(
  Object.values(Role),
  exceptionHandler(ProjectController.updateProjectController),
)
