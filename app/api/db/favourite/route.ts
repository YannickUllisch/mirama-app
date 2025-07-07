import { auth } from '@auth'
import { validateRequest } from '@src/lib/validateRequest'
import db from '@db'
import { generateTaskId } from '@src/lib/helpers/TaskCodeGenerator'
import { v4 } from 'uuid'
import type { Favourite, FavouriteType, Task } from '@prisma/client'

export const runtime = 'nodejs'

export const GET = auth(async (req) => {
  try {
    // Checking Permissions
    const session = req.auth
    const validatedRequest = await validateRequest(session)
    if (validatedRequest) {
      return validatedRequest
    }

    const favouriteType = req.nextUrl.searchParams.get('type') as
      | FavouriteType
      | undefined

    if (!favouriteType) {
      return Response.json(
        { ok: false, message: 'Invalid Type given' },
        { status: 400 },
      )
    }
    const response = await db.favourite.findMany({
      where: {
        type: favouriteType,
        userId: session?.user?.id ?? 'undef',
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
    const favourite = (await req.json()) as Omit<Favourite, 'id'>

    if (!favourite.data || !favourite.type) {
      return Response.json(
        {
          ok: false,
          message: 'Favourite attributes need to be defined in request',
        },
        { status: 400 },
      )
    }

    // Creating Fav
    try {
      const fav = await db.favourite.create({
        data: {
          ...favourite,
          id: undefined,
          userId: session?.user?.id ?? 'undef',
        },
      })

      return Response.json(fav)
    } catch (err) {
      console.error('Error in creating Favourite', err)
      throw err
    }
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

    await db.favourite.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    })

    return Response.json(
      { ok: true, message: 'Favourite(s) Deleted' },
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
        subtasks?: string[]
      }
    >

    if (!task) {
      return Response.json(
        { ok: false, message: 'Task attributes must be defined in request' },
        { status: 400 },
      )
    }

    try {
      const attachedTags = await db.taskTagJoin.findMany({
        where: {
          taskId: id,
        },
        select: {
          tagId: true,
        },
      })

      const existingTagIds = attachedTags.map((tag) => tag.tagId)

      const tagsToRemove =
        existingTagIds.filter((tagId) => !task.tags?.includes(tagId)) ?? []
      const tagsToAdd =
        task.tags?.filter((tagId) => !existingTagIds.includes(tagId)) ?? []

      await db.$transaction([
        // Remove tags
        db.taskTagJoin.deleteMany({
          where: {
            taskId: id,
            tagId: { in: tagsToRemove },
          },
        }),

        // Add new tags
        db.taskTagJoin.createMany({
          data: tagsToAdd.map((tagId) => ({
            taskId: id,
            tagId,
          })),
        }),

        // Update task details
        db.task.update({
          where: {
            id,
            teamId: session?.user?.teamId ?? 'undef',
          },
          data: {
            ...task,
            assignedToId:
              task.assignedToId === 'removeLink' ? null : task.assignedToId,
            parentId: id !== task.parentId ? task.parentId : null, // Avoid self-parenting
            tags: undefined,
            subtasks: undefined,
          },
        }),
      ])
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
