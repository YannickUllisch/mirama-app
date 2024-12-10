import type { Metadata } from 'next'
import { auth } from '@auth'
import SWRFallbackWrapper from '@src/components/Wrappers/SWRFallbackWrapper'
import { redirect } from 'next/navigation'
import { fetchSingleProjectById } from '@src/lib/api/queries/Project/ProjectQuerys'
import { fetchAllTeamTags } from '@src/lib/api/queries/Tags/TagQueries'

export const metadata: Metadata = {
  title: 'Create Task',
  description: 'Create a new Task',
}

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: { name: string; projectId: string }
}) => {
  const session = await auth()

  const project = await fetchSingleProjectById(params.projectId)
  const tags = await fetchAllTeamTags(session)

  // Handling invalid dynamic routes
  if (!session?.user) {
    return redirect(
      `/auth/login?callbackUrl=/app/${params.name}/create/${params.projectId}`,
    )
  }

  if (!project) {
    redirect('/app')
  }

  const fallbackData = {
    [`/api/db/project/name/${project.name}`]: project,
    '/api/db/tag': tags,
  }

  return (
    <SWRFallbackWrapper fallback={fallbackData}>{children}</SWRFallbackWrapper>
  )
}

export default Layout
