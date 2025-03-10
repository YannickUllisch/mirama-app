import db from '@db'
import { auth } from '@auth'
import { type Milestone, Role } from '@prisma/client'
import { validateRequest } from '@src/lib/validateRequest'

export const GET = auth(async (req) => {
  try {
    const session = req.auth
    const validatedRequest = await validateRequest(session)
    if (validatedRequest) {
      return validatedRequest
    }
    const projectId = req.nextUrl.searchParams.get('id') as string

    if (!projectId) {
      return Response.json(
        { ok: false, message: 'valid project id required at this endpoint' },
        { status: 400 },
      )
    }

    const response = await db.milestone.findMany({
      where: {
        projectId: projectId,
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
    const milestone = (await req.json()) as Omit<Milestone, 'id'>

    if (!milestone) {
      return Response.json(
        {
          ok: false,
          message: 'Milestone attributes must be defined in request',
        },
        { status: 400 },
      )
    }

    try {
      await db.milestone.create({
        data: {
          ...milestone,
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

    await db.milestone.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    })

    return Response.json(
      { ok: true, message: 'Milestone(s) Deleted' },
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
    const milestone = (await req.json()) as Partial<Milestone>

    if (!milestone) {
      return Response.json(
        {
          ok: false,
          message: 'Milestone attributes must be defined in request',
        },
        { status: 400 },
      )
    }

    try {
      await db.milestone.update({
        where: {
          id: milestone.id,
        },
        data: {
          ...milestone,
          id: undefined,
        },
      })
    } catch (err) {
      console.error('Error in creating Milestone', err)
      throw err
    }

    return Response.json(
      { ok: true, message: 'Milestone Update' },
      { status: 201 },
    )
  } catch (err) {
    return Response.json(
      { ok: false, message: `Failed with Error ${err}` },
      { status: 500 },
    )
  }
})
