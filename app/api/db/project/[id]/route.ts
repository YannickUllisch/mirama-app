import { auth } from '@auth'
import { validateRequest } from '@src/lib/validateRequest'
import { fetchSingleProjectById } from '@src/lib/api/queries/Project/ProjectQuerys'
import type { NextRequest } from 'next/server'
import { reconstructPrismaSelect } from '@src/lib/api/APIReconstructions'
import db from '@db'

export const GET = async (req: NextRequest) => {
  try {
    // Checking Permissions
    const session = await auth()
    const validatedRequest = await validateRequest(session)
    if (validatedRequest) {
      return validatedRequest
    }
    const { searchParams } = new URL(req.url)

    // Extracting name from dynamic route
    const id = req.nextUrl.pathname.split('/').pop()

    if (!id) {
      return Response.json(
        { ok: false, message: 'Project ID needs to be defined in request' },
        { status: 400 },
      )
    }

    const selectQuery = searchParams.getAll('select[]')

    // Extract select fields from select object format and parse all selections
    const prismaSelection = reconstructPrismaSelect({
      prismaModel: 'Project',
      rawSelectQuery: selectQuery,
    })

    const response = await db.project.findFirst({
      where: {
        id,
      },
      select: {
        ...prismaSelection,
        id: true,
      },
    })

    return Response.json(response, { status: 200 })
  } catch (err) {
    return Response.json(
      { ok: false, message: `Failed with Error ${err}` },
      { status: 500 },
    )
  }
}
