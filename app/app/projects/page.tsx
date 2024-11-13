'use server'
import { auth } from '@auth'
import { db } from '@db'
import { isTeamAdminOrOwner } from '@src/lib/utils'
import { redirect } from 'next/navigation'
import React from 'react'
import ClientProjectsPage from './client'
import { fetchAllAssignedProjects } from '@src/lib/api/queries/Project/ProjectQuerys'

const ProjectPage = async () => {
  const session = await auth()

  if (!session?.user) {
    return redirect('/auth/signin?callbackUrl=/app')
  }

  const projects = await fetchAllAssignedProjects(false)

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
