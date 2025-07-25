import db from '@db'
import { auth } from '@auth'
import { type ProjectUser, Role, type Project } from '@prisma/client'
import { DateTime } from 'luxon'
import { validateRequest } from '@src/lib/validateRequest'
import { v4 } from 'uuid'
import { isTeamAdminOrOwner } from '@src/lib/utils'
import { reconstructPrismaSelect } from '@src/lib/api/APIReconstructions'

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

export const POST = auth(async (req) => {
  try {
    const session = req.auth
    const validatedRequest = await validateRequest(session, [
      Role.ADMIN,
      Role.OWNER,
    ])
    if (validatedRequest) {
      return validatedRequest
    }
    const project = (await req.json()) as Omit<
      Project & { users: ProjectUser[] },
      'id' | 'teamId'
    >

    if (!project) {
      return Response.json(
        { ok: false, message: 'Project attributes must be defined in request' },
        { status: 400 },
      )
    }

    const generatedId = v4()

    try {
      await db.project.create({
        data: {
          ...project,
          teamId: session?.user.teamId ?? 'undefined',
          id: generatedId,
          users: undefined,
        },
      })
    } catch (err) {
      console.error('Error in creating project', err)
      throw err
    }

    // Create ProjectUser records, to handle many to many relationship
    try {
      const userIds = project.users.map((pu) => pu.userId)

      // Check if all user IDs exist in the User table
      const existingUsers = await db.user.findMany({
        where: {
          id: { in: userIds },
        },
        select: { id: true },
      })

      const existingUserIds = new Set(existingUsers.map((user) => user.id))

      // Filter out users that don't exist in the User table
      const validProjectUsers = project.users.filter((pu) =>
        existingUserIds.has(pu.userId),
      )

      if (validProjectUsers.length !== project.users.length) {
        console.warn(
          'Some user IDs do not exist in the User table and will be skipped',
        )
      }

      await db.projectUser.createMany({
        data: project.users.map((pu) => {
          return {
            projectId: generatedId,
            userId: pu.userId,
            isManager: pu.isManager,
            id: undefined,
          }
        }),
        skipDuplicates: true,
      })
    } catch (err) {
      console.error('Error in creating ProjectUser Records', err)
      throw err
    }

    return Response.json(
      { ok: true, message: 'Project created' },
      { status: 201 },
    )
  } catch (err) {
    return Response.json(
      { ok: false, message: `Failed with Error ${err}` },
      { status: 500 },
    )
  }
})

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
