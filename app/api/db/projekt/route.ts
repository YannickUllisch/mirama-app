import { db } from '@src/lib/db'
import { auth } from '@/auth'
import { Role, PriorityType, StatusType } from '@prisma/client'

export const GET = auth(async (req) => {
  try {
    const session = req.auth
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

    await db.project.create({
      data: {
        name: 'New Project',
        status: StatusType.STARTING,
        teamId: session?.user.teamId ?? 'undefined',
        priority: PriorityType.LOW,
        tasks: undefined,
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
    const id = req.nextUrl.searchParams.get('id') as string

    const response = await db.project.delete({
      where: {
        id,
        teamId: session?.user.teamId ?? 'undefined',
      },
    })

    return new Response(JSON.stringify(response))
  } catch (err) {
    return new Response(JSON.stringify(err))
  }
})

export const PUT = auth(async (req) => {
  try {
    const session = req.auth

    if (!session) {
      return Response.json(
        {},
        { status: 401, statusText: 'You need to be Logged In' },
      )
    }
    if (!session.user.role) {
      return Response.json(
        {},
        { status: 401, statusText: 'You Need to be in Team' },
      )
    }
    // if (
    //   session.user.role.toString() !== Role.OWNER ||
    //   session.user.role.toString() !== Role.OWNER
    // ) {
    //   return Response.json(
    //     {},
    //     { status: 403, statusText: 'Invalid Permission' },
    //   )
    // }

    const id = req.nextUrl.searchParams.get('id') as string
    const project = (await req.json()) as {
      startDate?: Date
      endDate?: Date
      name?: string
      budget?: number
      priority?: PriorityType
      status?: StatusType
      managedById?: string
    }

    const response = await db.project.update({
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
      },
    })

    return new Response(JSON.stringify(response))
  } catch (err: any) {
    return new Response(err, { status: 401, statusText: 'Error Occurred!' })
  }
})
