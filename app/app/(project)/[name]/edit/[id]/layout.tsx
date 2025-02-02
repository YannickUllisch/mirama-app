import type { Metadata } from 'next'
import { auth } from '@auth'
import SWRFallbackWrapper from '@src/components/Wrappers/SWRFallbackWrapper'
import { redirect } from 'next/navigation'
import { fetchSingleProjectByName } from '@src/lib/api/queries/Project/ProjectQuerys'
import { fetchAllTeamTags } from '@src/lib/api/queries/Tags/TagQueries'
import { fetchTaskById } from '@src/lib/api/queries/Tasks/TaskQueries'
import db from '@db'

export const metadata: Metadata = {
  title: 'Edit Task',
  description: 'Edit your Task',
}

const Layout = async ({
  children,
  params,
}: { children: React.ReactNode; params: { name: string; id: string } }) => {
  const session = await auth()

  const project = await db.project.findFirst({
    where: {
      name: params.name,
      teamId: session?.user.teamId ?? 'undef',
    },
    select: {
      id: true,
      name: true,
    },
  })

  const task = await db.task.findFirst({
    where: {
      id: params.id,
    },
    select: {
      id: true,
    },
  })

  // Handling invalid dynamic routes
  if (!session?.user) {
    return redirect(
      `/auth/login?callbackUrl=/app/${params.name}/edit/${params.id}`,
    )
  }

  if (!task) {
    redirect(`/app/${params.name}`)
  }

  if (!project) {
    redirect('/app')
  }

  return children
}

export default Layout
