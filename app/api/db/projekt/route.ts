import { db } from '@src/lib/db'
import type { NextRequest } from 'next/server'

export const GET = async (req: NextRequest) => {
  const id = req.nextUrl.searchParams.get('id') as string

  // If specific ID is given in query, we return only project corresponding to that ID
  if (id !== null) {
    const response = await db.project.findFirst({
      where: {
        id,
      },
    })

    return new Response(JSON.stringify(response))
  }

  // Else we return all projects
  const response = await db.project.findMany({
    include: {
      managedBy: true,
      tasks: true,
    },
  })

  return new Response(JSON.stringify(response))
}

export const DELETE = async (req: NextRequest) => {
  const id = req.nextUrl.searchParams.get('id') as string
  const response = db.project.delete({
    where: {
      id,
    },
  })

  return new Response(JSON.stringify(response))
}
