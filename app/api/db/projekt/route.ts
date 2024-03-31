import { db } from '@src/lib/db'
import { NextResponse, type NextRequest } from 'next/server'
import { auth } from '@/auth'
import type { Project } from '@prisma/client'

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
    })

    return new Response(JSON.stringify(response))
  } catch (err) {
    return new Response(JSON.stringify(err))
  }
})

export const POST = auth(async (req) => {
  try {
    const session = req.auth
    const project = (await req.json()) as Omit<Project, 'id' | 'teamId'>

    const response = await db.project.create({
      data: {
        ...project,
        teamId: session?.user.teamId ?? 'undefined',
      },
    })

    return new Response(JSON.stringify(response))
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
