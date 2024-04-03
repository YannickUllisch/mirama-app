import { db } from '@src/lib/db'
import { NextResponse, type NextRequest } from 'next/server'
import { auth } from '@/auth'
import type { Project } from '@prisma/client'
import { DateTime } from 'luxon'

export const GET = auth(async (req) => {
  try {
    const session = req.auth
    const response = await db.project.findMany({
      where: {
        teamId: session?.user.teamId,
      },
      include: {
        managedBy: true,
      },
      orderBy: {
        endDate: 'desc',
      },
    })

    return new Response(JSON.stringify(response))
  } catch (err) {
    return new Response(JSON.stringify(err))
  }
})

export const POST = auth(async (req) => {
  try {
    const session = req.auth

    await db.project.create({
      data: {
        name: 'New Project',
        status: 'STARTING',
        teamId: session?.user.teamId ?? 'undefined',
        priority: 'LOW',
        tasks: undefined,
      },
    })

    return new Response(JSON.stringify('Successfully Created Project!'))
  } catch (err) {
    return new Response(JSON.stringify(err))
  }
})

export const DELETE = auth(async (req) => {
  try {
    const session = req.auth
    const id = req.nextUrl.searchParams.get('id') as string

    const response = await db.project.delete({
      where: {
        id,
        teamId: session?.user.teamId ?? 'undefined',
      },
    })

    return new Response(JSON.stringify(response))
  } catch (err) {
    return new Response(JSON.stringify(err))
  }
})

export const PUT = auth(async (req) => {
  try {
    const session = req.auth

    const id = req.nextUrl.searchParams.get('id') as string
    const project = (await req.json()) as Omit<
      Project,
      'id' | 'teamId' | 'managedBy'
    >
    const response = await db.project.update({
      where: {
        id,
        teamId: session?.user.teamId,
      },
      data: {
        budget: project.budget,
        endDate: project.endDate,
        managedById: project.managedById,
        name: project.name,
        status: project.status,
        startDate: project.startDate,
        priority: project.priority,
      },
    })

    return new Response(JSON.stringify(response))
  } catch (err) {
    return new Response(JSON.stringify(err))
  }
})
