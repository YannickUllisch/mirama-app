import type { Metadata } from 'next'
import { auth } from '@auth'
import db from '@db'
import { isTeamAdminOrOwner } from '@src/lib/utils'
import { redirect } from 'next/navigation'
import ProjectUsersContext from '@src/components/Contexts/ProjectDataContext'

export const metadata: Metadata = {
  title: 'Projects | Mirama',
  description: 'Project and Task Management',
}

const Layout = async ({
  children,
  params,
}: { children: React.ReactNode; params: { name: string } }) => {
  // Validate Session
  const session = await auth()

  const project = await db.project.findFirst({
    where: {
      name: params.name,
      teamId: session?.user.teamId ?? 'undef',
    },
    select: {
      id: true,
      name: true,
      users: {
        select: {
          userId: true,
        },
      },
    },
  })

  if (
    !project ||
    (!isTeamAdminOrOwner(session) &&
      project.users.some((u) => u.userId === session?.user.id))
  ) {
    redirect('/app')
  }

  return (
    <ProjectUsersContext projectId={project.id} projectName={project.name}>
      {children}
    </ProjectUsersContext>
  )
}

export default Layout
