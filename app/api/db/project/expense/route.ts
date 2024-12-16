import { db } from '@src/lib/db'
import { auth } from '@auth'
import { Role, type Expense } from '@prisma/client'
import { validateRequest } from '@src/lib/validateRequest'
import { fetchExpensesByProjectId } from '@src/lib/api/queries/Project/ExpenseQuerys'

export const GET = auth(async (req) => {
  try {
    const session = req.auth
    const validatedRequest = await validateRequest(session, [
      Role.ADMIN,
      Role.OWNER,
    ])
    if (validatedRequest) {
      return validatedRequest
    }

    const projectId = JSON.parse(
      req.nextUrl.searchParams.get('projectid') as string,
    )

    const response = await fetchExpensesByProjectId(projectId)

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
    const expense = (await req.json()) as Omit<Expense, 'id'>

    if (!expense) {
      return Response.json(
        { ok: false, message: 'Expense attributes must be defined in request' },
        { status: 400 },
      )
    }

    try {
      await db.expense.create({
        data: {
          ...expense,
          id: undefined,
        },
      })
    } catch (err) {
      console.error('Error in creating Expense', err)
      throw err
    }

    return Response.json(
      { ok: true, message: 'Expense created' },
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

    await db.expense.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    })

    return Response.json(
      { ok: true, message: 'Expense(s) Deleted' },
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
    const expense = (await req.json()) as Partial<Expense>

    if (!expense) {
      return Response.json(
        { ok: false, message: 'Expense attributes must be defined in request' },
        { status: 400 },
      )
    }

    try {
      await db.expense.update({
        where: {
          id: expense.id,
        },
        data: {
          ...expense,
          id: undefined,
        },
      })
    } catch (err) {
      console.error('Error in creating Expense', err)
      throw err
    }

    return Response.json(
      { ok: true, message: 'Expense Update' },
      { status: 201 },
    )
  } catch (err) {
    return Response.json(
      { ok: false, message: `Failed with Error ${err}` },
      { status: 500 },
    )
  }
})
