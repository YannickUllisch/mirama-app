import { db } from '@src/lib/db'
import { auth } from '@auth'
import { type KanbanColumn, Role } from '@prisma/client'
import { validateRequest } from '@src/lib/validateRequest'
import { fetchSortedKanbanColumns } from '@src/lib/api/queries/Project/KanbanQueries'

export const GET = auth(async (req) => {
  try {
    const session = req.auth
    const validatedRequest = await validateRequest(session)
    if (validatedRequest) {
      return validatedRequest
    }
    const projectId = req.nextUrl.searchParams.get('id') as string
    const response = await fetchSortedKanbanColumns(projectId)

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
    const kanbanCol = (await req.json()) as Omit<KanbanColumn, 'id'>

    if (!kanbanCol || !kanbanCol.projectId) {
      return Response.json(
        {
          ok: false,
          message: 'Kanban Column attributes must be defined in request',
        },
        { status: 400 },
      )
    }

    const project = await db.project.findFirst({
      where: {
        id: kanbanCol.projectId,
      },
    })

    if (!project) {
      return Response.json(
        {
          ok: false,
          message: 'Column cannot be linked to given project identifier',
        },
        { status: 400 },
      )
    }

    try {
      await db.kanbanColumn.create({
        data: {
          ...kanbanCol,
          id: undefined,
        },
      })
    } catch (err) {
      console.error('Error in creating Milestone', err)
      throw err
    }

    return Response.json(
      { ok: true, message: 'Milestone created' },
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

    await db.kanbanColumn.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    })

    return Response.json(
      { ok: true, message: 'Kanban Column(s) Deleted' },
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
    const kanbanColumn = (await req.json()) as Partial<KanbanColumn>

    if (!kanbanColumn) {
      return Response.json(
        {
          ok: false,
          message: 'Kanban Column attributes must be defined in request',
        },
        { status: 400 },
      )
    }

    try {
      await db.kanbanColumn.update({
        where: {
          id: kanbanColumn.id,
        },
        data: {
          ...kanbanColumn,
          id: undefined,
        },
      })
    } catch (err) {
      console.error('Error in creating Kanban Column', err)
      throw err
    }

    return Response.json(
      { ok: true, message: 'Kanban Column Updated' },
      { status: 201 },
    )
  } catch (err) {
    return Response.json(
      { ok: false, message: `Failed with Error ${err}` },
      { status: 500 },
    )
  }
})
