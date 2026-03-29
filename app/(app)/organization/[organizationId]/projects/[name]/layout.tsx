import { auth } from '@/serverOld/auth/auth'
import db from '@db'
import { ProjectViewContext } from '@src/components/Contexts/ProjectDataContext'
import { isOrgAdminOrOwner } from '@src/lib/utils'
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
      organizationId: session?.user.organizationId ?? 'undef',
    },
    select: {
      id: true,
      name: true,
      members: {
        select: {
          memberId: true,
        },
      },
    },
  })

  if (
    !project ||
    (!isOrgAdminOrOwner(session) &&
      project.members.some((u) => u.memberId === session?.user.id))
  ) {
    redirect('/app')
  }

  return (
    <ProjectViewContext projectId={project.id} projectName={project.name}>
      {children}
    </ProjectViewContext>
  )
}

export default Layout
