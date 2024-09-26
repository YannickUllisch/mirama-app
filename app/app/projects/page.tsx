'use server'
import { auth } from '@auth'
import { db } from '@db'
import { isTeamAdminOrOwner } from '@src/lib/utils'
import { redirect } from 'next/navigation'
import React from 'react'
import ClientProjectsPage from './client'

const ProjectPage = async () => {
  const session = await auth()

  if (!session?.user) {
    return redirect('/auth/signin?callbackUrl=/app')
  }

  const projects = await db.project.findMany({
    where: {
      teamId: session?.user.teamId,
      archived: false,
      users: {
        some: {
          userId: isTeamAdminOrOwner(session) ? undefined : session?.user.id,
        },
      },
    },
    include: {
      users: true,
    },
  })

  const users = await db.user.findMany({
    where: {
      teamId: session?.user.teamId,
    },
    orderBy: {
      role: 'asc',
    },
  })

  return (
    <ClientProjectsPage projects={projects} session={session} users={users} />
  )
}

export default ProjectPage
