import { auth } from '@auth'
import { validateRequest } from '@src/lib/validateRequest'
import type { Task } from '@prisma/client'
import { db } from '@src/lib/db'
import { generateTaskId } from '@src/lib/helpers/TaskCodeGenerator'
import { v4 } from 'uuid'

export const GET = auth(async (req) => {
  try {
    // Checking Permissions
    const session = req.auth
    const validatedRequest = await validateRequest(session)
    if (validatedRequest) {
      return validatedRequest
    }

    const name = req.nextUrl.searchParams.get('projectName') as string
    // If specific ID is given in query, we return only project corresponding to that ID
    if (name) {
      const response = await db.task.findMany({
        where: {
          project: {
            name,
          },
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

    // We will derive a new unique ID and find the teamId based on session server side.
    // This is done for security purposes.
    const task = (await req.json()) as Omit<Task, 'id' | 'teamId'>

    if (!task) {
      return Response.json(
        { ok: false, message: 'Task attributes need to be defined in request' },
        { status: 400 },
      )
    }

    // Gathering required information to generate Task Code
    const project = await db.project.findFirst({
      where: {
        id: task.projectId,
      },
    })
    const newId = v4()
    if (!project) {
      return Response.json(
        { ok: false, message: 'Task must be linked to a Project.' },
        { status: 400 },
      )
    }

    // Creating Task
    await db.task.create({
      data: {
        ...task,
        id: newId,
        teamId: session?.user.teamId ?? 'undefined',
        taskCode: await generateTaskId(project.name, newId),
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
    const session = req.auth
    const validatedRequest = await validateRequest(session)

    if (validatedRequest) {
      return validatedRequest
    }

    const ids = (await req.json()) as string[]

    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return Response.json(
        { ok: false, message: 'Invalid request body' },
        { status: 400 },
      )
    }

    await db.task.deleteMany({
      where: {
        id: {
          in: ids,
        },
        teamId: session?.user.teamId ?? 'undefined',
      },
    })

    return Response.json(
      { ok: true, message: 'Tasks Deleted' },
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

    const task = (await req.json()) as Partial<Omit<Task, 'id' | 'teamId'>>
    if (!task) {
      return Response.json(
        { ok: false, message: 'Task attributes must be defined in request' },
        { status: 400 },
      )
    }

    await db.task.update({
      where: {
        id,
        teamId: session?.user.teamId,
      },
      data: {
        ...task,
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
