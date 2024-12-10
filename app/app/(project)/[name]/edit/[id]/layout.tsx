import type { Metadata } from 'next'
import { auth } from '@auth'
import SWRFallbackWrapper from '@src/components/Wrappers/SWRFallbackWrapper'
import { redirect } from 'next/navigation'
import { fetchSingleProjectByName } from '@src/lib/api/queries/Project/ProjectQuerys'
import { fetchAllTeamTags } from '@src/lib/api/queries/Tags/TagQueries'
import { fetchTaskById } from '@src/lib/api/queries/Tasks/TaskQueries'

export const metadata: Metadata = {
  title: 'Edit Task',
  description: 'Edit your Task',
}

const Layout = async ({
  children,
  params,
}: { children: React.ReactNode; params: { name: string; id: string } }) => {
  const session = await auth()

  const tags = await fetchAllTeamTags(session)
  const project = await fetchSingleProjectByName(params.name)
  const task = await fetchTaskById(params.id)

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

  const fallbackData = {
    [`/api/db/task/${params.id}`]: task,
    [`/api/db/project/${project.id}`]: project,
    '/api/db/tag': tags,
  }

  return (
    <SWRFallbackWrapper fallback={fallbackData}>{children}</SWRFallbackWrapper>
  )
}

export default Layout
