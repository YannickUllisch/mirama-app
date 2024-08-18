import { auth } from '@auth'
import { validateRequest } from '@src/lib/validateRequest'
import type { Tag } from '@prisma/client'
import { db } from '@src/lib/db'

export const GET = auth(async (req) => {
  try {
    // Checking Permissions
    const session = req.auth
    const validatedRequest = await validateRequest(session)
    if (validatedRequest) {
      return validatedRequest
    }

    const response = await db.tag.findMany({
      where: {
        teamId: session?.user.teamId,
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
    const tag = (await req.json()) as Omit<Tag, 'id' | 'teamId'>

    if (!tag) {
      return Response.json(
        { ok: false, message: 'Tag attributes need to be defined in request' },
        { status: 400 },
      )
    }

    // Creating Tag
    await db.tag.create({
      data: {
        ...tag,
        id: undefined,
        teamId: session?.user.teamId ?? 'undefined',
      },
    })

    return Response.json(
      { ok: true, message: 'Tag Successfully created' },
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

    await db.tag.deleteMany({
      where: {
        id: {
          in: ids,
        },
        teamId: session?.user.teamId ?? 'undefined',
      },
    })

    return Response.json(
      { ok: true, message: 'Tag(s) Deleted' },
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
        { ok: false, message: 'Tag ID needs to be defined in request' },
        { status: 400 },
      )
    }

    const tag = (await req.json()) as Partial<Omit<Tag, 'id' | 'teamId'>>
    if (!tag) {
      return Response.json(
        { ok: false, message: 'Tag attributes must be defined in request' },
        { status: 400 },
      )
    }

    await db.tag.update({
      where: {
        id,
        teamId: session?.user.teamId,
      },
      data: {
        ...tag,
      },
    })

    return Response.json({ ok: true, message: 'Tag Updated' }, { status: 200 })
  } catch (err) {
    return Response.json(
      { ok: false, message: `Failed with Error ${err}` },
      { status: 500 },
    )
  }
})
