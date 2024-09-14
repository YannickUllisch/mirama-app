'use server'
import { auth } from '@src/lib/auth'
import { db } from '@src/lib/db'
import { isTeamAdminOrOwner } from '@src/lib/utils'
import { redirect } from 'next/navigation'
import ClientProjectPage from './client'

const ProjectPage = async ({ params }: { params: { name: string } }) => {
  // Validate Session
  const session = await auth()

  const project = await db.project.findFirst({
    where: {
      name: params.name,
      teamId: session?.user.teamId,
    },
    include: {
      tasks: {
        include: {
          assignedTo: true,
          tags: true,
          category: true,
        },
      },
      users: {
        include: {
          user: true,
        },
      },
      taskCategories: true,
    },
  })

  // We redirect if session is not defined, or the project does not exist OR is note assigned to the user
  if (
    !project ||
    !session ||
    (!isTeamAdminOrOwner(session) &&
      project.users.some((u) => u.userId === session.user.id))
  ) {
    redirect('/app')
  }

  return <ClientProjectPage project={project} session={session} />
}

export default ProjectPage
