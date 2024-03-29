import { db } from '@src/lib/db'
import type { NextRequest } from 'next/server'

export const GET = async (_req: Request) => {
  const response = db.project.findMany()

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
