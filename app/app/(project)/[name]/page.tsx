'use server'
import { auth } from '@auth'
import { db } from '@src/lib/db'
import { isTeamAdminOrOwner } from '@src/lib/utils'
import { redirect } from 'next/navigation'
import ClientProjectPage from './client'
import { fetchSingleProjectByName } from '@src/lib/api/queries/Project/ProjectQuerys'

const ProjectPage = async ({ params }: { params: { name: string } }) => {
  // Validate Session
  const session = await auth()

  const project = await fetchSingleProjectByName(params.name)

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
