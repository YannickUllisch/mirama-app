import { auth } from '@auth'
import { validateRequest } from '@src/lib/validateRequest'
import { db } from '@src/lib/db'
import { Role, type TaskCategory } from '@prisma/client'

export const GET = auth(async (req) => {
  try {
    // Checking Permissions
    const session = req.auth
    const validatedRequest = await validateRequest(session)
    if (validatedRequest) {
      return validatedRequest
    }

    const projectId = req.nextUrl.searchParams.get('projectId') as string
    if (!projectId) {
      return Response.json(
        { ok: false, message: 'Project ID needs to be defined in request' },
        { status: 400 },
      )
    }

    // If specific ID is given in query, we return only project corresponding to that ID
    const response = await db.taskCategory.findMany({
      where: {
        projectId,
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
    const validatedRequest = await validateRequest(session, [
      Role.ADMIN,
      Role.OWNER,
    ])
    if (validatedRequest) {
      return validatedRequest
    }

    // We will derive a new unique ID and find the teamId based on session server side.
    // This is done for security purposes.
    const category = (await req.json()) as Omit<TaskCategory, 'id'>

    if (!category) {
      return Response.json(
        { ok: false, message: 'Task attributes need to be defined in request' },
        { status: 400 },
      )
    }

    // Creating Task
    try {
      await db.taskCategory.create({
        data: {
          ...category,
        },
      })
    } catch (err) {
      console.error('Error in creating Category', err)
      throw err
    }

    return Response.json(
      { ok: true, message: 'Category Successfully created' },
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
    const validatedRequest = await validateRequest(session, [
      Role.ADMIN,
      Role.OWNER,
    ])

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

    await db.taskCategory.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    })

    return Response.json(
      { ok: true, message: 'Categories Deleted' },
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
        { ok: false, message: 'Category ID needs to be defined in request' },
        { status: 400 },
      )
    }

    const category = (await req.json()) as Partial<Omit<TaskCategory, 'id'>>

    if (!category) {
      return Response.json(
        { ok: false, message: 'Task attributes must be defined in request' },
        { status: 400 },
      )
    }

    try {
      await db.taskCategory.update({
        where: {
          id,
        },
        data: {
          ...category,
        },
      })
    } catch (err) {
      console.error(err)
      throw err
    }

    return Response.json(
      { ok: true, message: 'Category Updated' },
      { status: 200 },
    )
  } catch (err) {
    return Response.json(
      { ok: false, message: `Failed with Error ${err}` },
      { status: 500 },
    )
  }
})
