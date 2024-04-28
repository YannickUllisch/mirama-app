import { auth } from '@/auth'
import type { Task } from '@prisma/client'
import { db } from '@src/lib/db'
import { DateTime } from 'luxon'
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

export const POST = auth(async (req) => {
  try {
    const session = req.auth
    const task = (await req.json()) as Omit<Task, 'id' | 'teamId'>

    const response = await db.task.create({
      data: {
        projectId: task.projectId,
        assignedToId: task.assignedToId,
        description: task.description,
        taskName: task.taskName,
        teamId: session?.user.teamId ?? 'undefined',
        dueDate: task.dueDate,
      },
    })

    return new Response(JSON.stringify(response))
  } catch (err: any) {
    return new Response(err, { status: 401, statusText: 'Error Occurred!' })
  }
})

export const DELETE = auth(async (req) => {
  try {
    const session = req.auth
    const id = req.nextUrl.searchParams.get('id') as string

    const response = await db.task.delete({
      where: {
        id,
        teamId: session?.user.teamId,
      },
    })

    return new Response(JSON.stringify(response))
  } catch (err) {
    return new Response(JSON.stringify(err))
  }
})
