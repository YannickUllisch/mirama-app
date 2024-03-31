import { db } from '@src/lib/db'
import type { NextRequest } from 'next/server'

export const GET = async (_req: NextRequest) => {
  // Else we return all projects
  const response = await db.project.findMany({
    include: {
      managedBy: true,
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
