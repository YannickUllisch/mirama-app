import { db } from '@src/lib/db'
import { auth } from '@/auth'
import { PriorityType, Role, StatusType, type Project } from '@prisma/client'
import { DateTime } from 'luxon'
import { validateRequest } from '@/src/lib/utils'

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

    return new Response(JSON.stringify(response))
  } catch (err) {
    return new Response(JSON.stringify(err))
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
    await db.project.create({
      data: {
        ...project,
        teamId: session?.user.teamId ?? 'undefined',
        id: undefined,
      },
    })
    return new Response('Project Created')
  } catch (err) {
    return new Response(JSON.stringify(err))
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

    const id = new URL(req.url).searchParams.get('id') as string

    await db.project.delete({
      where: {
        id,
        teamId: session?.user.teamId ?? 'undefined',
      },
    })

    return new Response('Project Deleted')
  } catch (err) {
    return new Response(JSON.stringify(err))
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

    const id = new URL(req.url).searchParams.get('id') as string
    const project = (await req.json()) as Partial<Project>

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
        name: project.name,
        endDate: project.endDate,
        startDate: project.startDate,
        budget: project.budget,
        priority: project.priority,
        status: project.status,
        managedById: project.managedById,
        archived: project.archived,
      },
    })

    return new Response('Project Updated')
  } catch (err: any) {
    return new Response(err, { status: 401, statusText: 'Error Occurred!' })
  }
})
