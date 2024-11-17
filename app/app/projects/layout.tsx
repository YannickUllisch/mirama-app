import type { Metadata } from 'next'
import { fetchAllAssignedProjectsTest } from '@src/lib/api/queries/Project/ProjectQuerys'
import { auth } from '@auth'
import { fetchAllTeamMembers } from '@src/lib/api/queries/Team/MemberQueries'
import SWRFallbackWrapper from '@src/components/SWRFallbackWrapper'
import { redirect } from 'next/navigation'
import { projectIncludeConfig } from './shared'

export const metadata: Metadata = {
  title: 'Projects Table | Mirama',
  description: 'Overview of all personal Projects',
}

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth()

  if (!session?.user) {
    return redirect('/auth/login?callbackUrl=/app/projects')
  }

  const projects = await fetchAllAssignedProjectsTest(
    false,
    projectIncludeConfig,
  )

  const users = await fetchAllTeamMembers(session)

  const fallbackData = {
    [`/api/db/project?archived=false&include=${encodeURIComponent(
      JSON.stringify(projectIncludeConfig),
    )}`]: projects,
    '/api/db/team/member': users,
  }

  return (
    <SWRFallbackWrapper fallback={fallbackData}>{children}</SWRFallbackWrapper>
  )
}

export default Layout
