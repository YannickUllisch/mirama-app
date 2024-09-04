import { auth } from '@auth'
import { validateRequest } from '@src/lib/validateRequest'
import { db } from '@src/lib/db'
import type { Comment } from '@prisma/client'

export const GET = auth(async (req) => {
  try {
    // Checking Permissions
    const session = req.auth
    const validatedRequest = await validateRequest(session)
    if (validatedRequest) {
      return validatedRequest
    }

    const taskId = req.nextUrl.searchParams.get('taskId') as string

    // If specific ID is given in query, we return only project corresponding to that ID
    if (!taskId) {
      return Response.json(
        { ok: false, message: 'Task ID needs to be defined in request' },
        { status: 400 },
      )
    }

    const response = await db.comment.findMany({
      where: {
        taskId,
      },
      include: {
        user: true,
      },
    })

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
    const comment = (await req.json()) as Omit<
      Comment,
      'id' | 'createdAt' | 'userId'
    >

    if (!comment) {
      return Response.json(
        {
          ok: false,
          message: 'Comment attributes need to be defined in request',
        },
        { status: 400 },
      )
    }

    // Creating Task
    try {
      await db.comment.create({
        data: {
          ...comment,
          id: undefined,
          parentId: comment.parentId ? comment.parentId : undefined,
          userId: session?.user.id ?? 'undefined',
        },
      })
    } catch (err) {
      console.error('Error in creating Comment', err)
      throw err
    }

    return Response.json(
      { ok: true, message: 'Comment Successfully created' },
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

    await db.comment.deleteMany({
      where: {
        id: {
          in: ids,
        },
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

    const comment = (await req.json()) as Partial<
      Omit<Comment, 'id' | 'createdAt' | 'useId'>
    >
    if (!comment) {
      return Response.json(
        { ok: false, message: 'Comment attributes must be defined in request' },
        { status: 400 },
      )
    }

    try {
      await db.comment.update({
        where: {
          id,
          // Users should only be able to edit their own comments, no matter what role.
          userId: session?.user.id,
        },
        data: {
          ...comment,
        },
      })
    } catch (err) {
      console.error(err)
      throw err
    }

    return Response.json(
      { ok: true, message: 'Comment Updated' },
      { status: 200 },
    )
  } catch (err) {
    return Response.json(
      { ok: false, message: `Failed with Error ${err}` },
      { status: 500 },
    )
  }
})
