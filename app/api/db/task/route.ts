import { auth } from '@auth'
import { validateRequest } from '@src/lib/validateRequest'
import { db } from '@src/lib/db'
import { generateTaskId } from '@src/lib/helpers/TaskCodeGenerator'
import { v4 } from 'uuid'
import type { Task } from '@prisma/client'
import { fetchTasksByProjectId } from '@src/lib/api/queries/Tasks/TaskQueries'
import { resend } from '@src/email/mailer'

export const GET = auth(async (req) => {
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
        { ok: false, message: 'ProjectId needs to be defined in request' },
        { status: 400 },
      )
    }

    const response = await fetchTasksByProjectId(id)

    return Response.json(response, { status: 200 })
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
    const task = (await req.json()) as Omit<Task, 'id'> & {
      tags?: string[]
    }

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

    await db.tag.updateMany({
      where: {
        teamId: session?.user.teamId ?? 'undef',
        title: {
          in: task.tags,
        },
      },
      data: {},
    })

    // Creating Task
    try {
      await db.task.create({
        data: {
          ...task,
          id: newId,
          teamId: session?.user.teamId ?? 'undefined',
          parentId: task.parentId ? task.parentId : undefined,
          taskCode: await generateTaskId(project.name, newId),
          tags: {
            connect: task.tags
              ? task.tags?.map((tagId) => ({ id: tagId }))
              : undefined,
          },
        },
      })
    } catch (err) {
      console.error('Error in creating Task', err)
      throw err
    }

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

    const task = (await req.json()) as Partial<
      Omit<Task, 'id' | 'teamId'> & {
        tags?: string[]
      }
    >
    if (!task) {
      return Response.json(
        { ok: false, message: 'Task attributes must be defined in request' },
        { status: 400 },
      )
    }

    try {
      await db.task.update({
        where: {
          id,
          teamId: session?.user.teamId,
        },
        data: {
          ...task,
          parentId: id !== task.parentId ? task.parentId : null, // Avoid self-parenting
          tags: {
            connect: task.tags
              ? task.tags?.map((tagId) => ({ id: tagId }))
              : undefined,
          },
        },
      })
    } catch (err) {
      console.error(err)
      throw err
    }

    return Response.json({ ok: true, message: 'Task Updated' }, { status: 200 })
  } catch (err) {
    return Response.json(
      { ok: false, message: `Failed with Error ${err}` },
      { status: 500 },
    )
  }
})
