import db from '@db'
import { type Project, type ProjectUser, Role } from '@prisma/client'
import { auth } from '@server/auth/auth'
import { ProjectController } from '@server/controllers/projectController'
import { exceptionHandler } from '@server/utils/exceptionHandler'
import { reconstructPrismaSelect } from '@src/lib/api/APIReconstructions'
import { isTeamAdminOrOwner } from '@src/lib/utils'
import { validateRequest } from '@src/lib/validateRequest'
import { withAuth } from '@withAuth'
import { DateTime } from 'luxon'

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

export const PUT = auth(async (req) => {
  try {
    const session = req.auth
    const validatedRequest = await validateRequest(session, [
      Role.ADMIN,
      Role.OWNER,
    ])
    if (validatedRequest) {
      return validatedRequest
    }

    const id = req.nextUrl.searchParams.get('id') as string
    if (!id) {
      return Response.json(
        { ok: false, message: 'Project ID must be defined in request' },
        { status: 400 },
      )
    }
    const project = (await req.json()) as Partial<
      Omit<Project & { users: ProjectUser[] }, 'id' | 'teamId'>
    >
    if (!project) {
      return Response.json(
        { ok: false, message: 'Project attributes must be defined in request' },
        { status: 400 },
      )
    }

    // Convert to correct timezone
    if (project.startDate) {
      project.startDate = DateTime.fromISO(project.startDate.toString())
        .toUTC()
        .startOf('day')
        .plus({ days: 1 })
        .toJSDate()
    } else if (project.endDate) {
      project.endDate = DateTime.fromISO(project.endDate.toString())
        .toUTC()
        .startOf('day')
        .plus({ days: 1 })
        .toJSDate()
    }

    await db.project.update({
      where: {
        id,
        teamId: session?.user.teamId,
      },
      data: {
        ...project,
        users: undefined,
      },
    })

    return Response.json(
      { ok: true, message: 'Project Successfully updated' },
      { status: 200 },
    )
  } catch (err: any) {
    return Response.json(
      { ok: false, message: `Failed with Error ${err}` },
      { status: 500 },
    )
  }
})
