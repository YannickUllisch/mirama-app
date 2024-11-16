import type { Metadata } from 'next'
import { auth } from '@auth'
import { db } from '@db'
import { fetchSingleProjectByName } from '@src/lib/api/queries/Project/ProjectQuerys'
import { isTeamAdminOrOwner } from '@src/lib/utils'
import { redirect } from 'next/navigation'
import SWRFallbackWrapper from '@src/components/SWRFallbackWrapper'
import { fetchProjectUsersByProjectId } from '@src/lib/api/queries/Project/UserQuerys'
import { fetchTasksByProjectId } from '@src/lib/api/queries/Tasks/TaskQueries'
import { fetchTaskCategoriesByProject } from '@src/lib/api/queries/TaskCategory/TaskCategoryQuerys'
import { fetchAllTeamMembers } from '@src/lib/api/queries/Team/MemberQueries'

export const metadata: Metadata = {
  title: 'Projects | Mirama',
  description: 'Project and Task Management',
}

export const dynamicParams = true

// We can allow to generate all paths while the website is small and only used by one company
// The way this is currently done it is not scalable at all.
export const generateStaticParams = async () => {
  const projects = await db.project.findMany({
    select: {
      name: true,
    },
  })

  return projects.map((project) => ({
    name: project.name,
  }))
}

const Layout = async ({
  children,
  params,
}: { children: React.ReactNode; params: { name: string } }) => {
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
    redirect(`/auth/signin?callbackUrl=/app/${params.name}`)
  }

  const projectUsers = await fetchProjectUsersByProjectId(project.id)
  const projectTasks = await fetchTasksByProjectId(project.id)
  const taskCategories = await fetchTaskCategoriesByProject(project.id)
  const teamMembers = await fetchAllTeamMembers(session)

  const fallbackData = {
    [`/api/db/projekt/name/${params.name}`]: project,
    [`/api/db/projekt/users?id=${project.id}`]: projectUsers,
    [`/api/db/task?id=${project.id}`]: projectTasks,
    [`/api/db/projekt/taskCategories?projectId=${project.id}`]: taskCategories,
    [`/api/db/projekt/${project.id}`]: project,
    '/api/db/team/member': teamMembers,
  }

  return (
    <SWRFallbackWrapper fallback={fallbackData}>{children}</SWRFallbackWrapper>
  )
}

export default Layout
