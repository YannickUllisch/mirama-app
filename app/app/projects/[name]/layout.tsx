import db from '@db'
import { auth } from '@server/auth/auth'
import ProjectUsersContext from '@src/components/Contexts/ProjectDataContext'
import { isTeamAdminOrOwner } from '@src/lib/utils'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Project and Task Management',
}

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ name: string }>
}) => {
  // Validate Session
  const session = await auth()

  const awaitedParams = await params

  const project = await db.project.findFirst({
    where: {
      name: awaitedParams.name,
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
