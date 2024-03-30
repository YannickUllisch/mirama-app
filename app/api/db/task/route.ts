import { db } from '@src/lib/db'
import type { NextRequest } from 'next/server'

export const GET = async (req: NextRequest) => {
  const projectId = req.nextUrl.searchParams.get('projectId') as string
  // If specific ID is given in query, we return only project corresponding to that ID
  if (projectId) {
    const response = await db.task.findMany({
      where: {
        projectId,
      },
      include: {
        assignedTo: true,
      },
    })

    return new Response(JSON.stringify(response))
  }
}
