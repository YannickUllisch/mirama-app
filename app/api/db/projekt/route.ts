import { db } from '@src/lib/db'
import { auth } from '@/src/lib/auth'
import { Role, type Project } from '@prisma/client'
import { DateTime } from 'luxon'
import { validateRequest } from '@/src/lib/validateRequest'

export const GET = auth(async (req) => {
  try {
    const session = req.auth
    const validatedRequest = await validateRequest(session)
    if (validatedRequest) {
      return validatedRequest
    }

    const response = await db.project.findMany({
      where: {
        teamId: session?.user.teamId,
      },
      include: {
        managedBy: true,
      },
      orderBy: {
        endDate: 'desc',
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
    const project = (await req.json()) as Omit<Project, 'id' | 'teamId'>

    if (!project) {
      return Response.json(
        { ok: false, message: 'Project attributes must be defined in request' },
        { status: 400 },
      )
    }

    await db.project.create({
      data: {
        ...project,
        teamId: session?.user.teamId ?? 'undefined',
        id: undefined,
      },
    })
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
      Omit<Project, 'id' | 'teamId'>
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
