import type { Metadata } from 'next'
import { auth } from '@auth'
import SWRFallbackWrapper from '@src/components/Wrappers/SWRFallbackWrapper'
import { redirect } from 'next/navigation'
import {
  fetchSingleProjectById,
  fetchSingleProjectByName,
} from '@src/lib/api/queries/Project/ProjectQuerys'
import { fetchAllTeamTags } from '@src/lib/api/queries/Tags/TagQueries'
import { TaskType } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Create Task',
  description: 'Create a new Task',
}

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: { name: string; type: string }
}) => {
  const session = await auth()

  const project = await fetchSingleProjectByName(params.name)

  // Handling invalid dynamic routes
  if (!session?.user) {
    return redirect(
      `/auth/login?callbackUrl=/app/${params.name}/create/${params.type}`,
    )
  }

  const validTypes = Object.values(TaskType)
  if (!validTypes.includes(params.type.toUpperCase() as TaskType)) {
    redirect(`/app/${params.name}`)
  }

  if (!project) {
    redirect('/app')
  }

  return children
}

export default Layout
