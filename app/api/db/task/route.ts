import { auth } from '@auth'
import { validateRequest } from '@/src/lib/validateRequest'
import type { Task } from '@prisma/client'
import { db } from '@src/lib/db'

export const GET = auth(async (req) => {
  try {
    // Checking Permissions
    const session = req.auth
    const validatedRequest = await validateRequest(session)
    if (validatedRequest) {
      return validatedRequest
    }

    const projectId = req.nextUrl.searchParams.get('projectId') as string
    // If specific ID is given in query, we return only project corresponding to that ID
    if (projectId) {
      const response = await db.task.findMany({
        where: {
          projectId,
        },
        include: {
          assignedTo: true,
        },
      })

      return Response.json(response, { status: 200 })
    }

    return Response.json(
      { ok: false, message: 'Project ID needs to be defined in request' },
      { status: 400 },
    )
  } catch (err: any) {
    return Response.json(
      { ok: false, message: `Failed with Error ${err}` },
      { status: 500 },
    )
  }
})

export const POST = auth(async (req) => {
  try {
    // Checking Permissions
    const session = req.auth
    const validatedRequest = await validateRequest(session)
    if (validatedRequest) {
      return validatedRequest
    }
    const task = (await req.json()) as Omit<Task, 'id' | 'teamId'>

    if (!task) {
      return Response.json(
        { ok: false, message: 'Task attributes need to be defined in request' },
        { status: 400 },
      )
    }

    await db.task.create({
      data: {
        projectId: task.projectId,
        assignedToId: task.assignedToId,
        description: task.description,
        status: task.status,
        priority: task.priority,
        title: task.title,
        teamId: session?.user.teamId ?? 'undefined',
        dueDate: task.dueDate,
      },
    })

    return Response.json(
      { ok: true, message: 'Task Successfully created' },
      { status: 200 },
    )
  } catch (err: any) {
    return Response.json(
      { ok: false, message: `Failed with Error ${err}` },
      { status: 500 },
    )
  }
})

export const DELETE = auth(async (req) => {
  try {
    // Checking Permissions
    const session = req.auth
    const validatedRequest = await validateRequest(session)
    if (validatedRequest) {
      return validatedRequest
    }
    const id = req.nextUrl.searchParams.get('id') as string

    if (!id) {
      return Response.json(
        { ok: false, message: 'Task ID needs to be defined in request' },
        { status: 400 },
      )
    }

    await db.task.delete({
      where: {
        id,
        teamId: session?.user.teamId,
      },
    })

    return Response.json({ ok: true, message: 'Task Deleted' }, { status: 200 })
  } catch (err) {
    return Response.json(
      { ok: false, message: `Failed with Error ${err}` },
      { status: 500 },
    )
  }
})

export const PUT = auth(async (req) => {
  try {
    // Checking Permissions
    const session = req.auth
    const validatedRequest = await validateRequest(session)
    if (validatedRequest) {
      return validatedRequest
    }
    const id = req.nextUrl.searchParams.get('id') as string

    if (!id) {
      return Response.json(
        { ok: false, message: 'Task ID needs to be defined in request' },
        { status: 400 },
      )
    }

    await db.task.update({
      where: {
        id,
      },
      data: {
        status: 'DOING',
      },
    })

    return Response.json({ ok: true, message: 'Task Updated' }, { status: 200 })
  } catch (err) {
    return Response.json(
      { ok: false, message: `Failed with Error ${err}` },
      { status: 500 },
    )
  }
})
