import type { Metadata } from 'next'
import { auth } from '@auth'
import { db } from '@db'
import { fetchSingleProjectByName } from '@src/lib/api/queries/Project/ProjectQuerys'
import { isTeamAdminOrOwner } from '@src/lib/utils'
import { redirect } from 'next/navigation'
import SWRFallbackWrapper from '@src/components/Wrappers/SWRFallbackWrapper'
import { fetchProjectUsersByProjectId } from '@src/lib/api/queries/Project/UserQuerys'
import { fetchTasksByProjectId } from '@src/lib/api/queries/Tasks/TaskQueries'
import { fetchTaskCategoriesByProject } from '@src/lib/api/queries/TaskCategory/TaskCategoryQuerys'
import { fetchAllTeamMembers } from '@src/lib/api/queries/Team/MemberQueries'
import { fetchProjectUsersJoinedByProjectId } from '@src/lib/api/queries/Project/ProjectUserJoinQuerys'
import { fetchMilestonesByProjectId } from '@src/lib/api/queries/Project/MilestoneQueries'

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
  if (!session) {
    redirect(`/auth/login?callbackUrl=/app/${params.name}`)
  }

  if (
    !project ||
    (!isTeamAdminOrOwner(session) &&
      project.users.some((u) => u.userId === session.user.id))
  ) {
    redirect('/app')
  }

  const projectUsers = await fetchProjectUsersByProjectId(project.id)
  const projectTasks = await fetchTasksByProjectId(project.id)
  const taskCategories = await fetchTaskCategoriesByProject(project.id)
  const teamMembers = await fetchAllTeamMembers(session)
  const projectUsersJoinTable = await fetchProjectUsersJoinedByProjectId(
    project.id,
  )
  const milestones = await fetchMilestonesByProjectId(project.id)

  const fallbackData = {
    [`/api/db/project/name/${params.name}`]: project,
    [`/api/db/project/users?id=${project.id}`]: projectUsers,
    [`/api/db/task?id=${project.id}`]: projectTasks,
    [`/api/db/task?id=${project.id}&ignoreCompleted=false`]: projectTasks,
    [`/api/db/project/taskCategories?projectId=${project.id}`]: taskCategories,
    [`/api/db/project/${project.id}`]: project,
    [`/api/db/projectuser?projectId=${project.id}`]: projectUsersJoinTable,
    [`/api/db/project/milestones?id=${project.id}`]: milestones,
    '/api/db/team/member': teamMembers,
  }

  return (
    <SWRFallbackWrapper fallback={fallbackData}>{children}</SWRFallbackWrapper>
  )
}

export default Layout
