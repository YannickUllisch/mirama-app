import type { Metadata } from 'next'
import { auth } from '@auth'
import SWRFallbackWrapper from '@src/components/Wrappers/SWRFallbackWrapper'
import { redirect } from 'next/navigation'
import { fetchAllTeamMembers } from '@src/lib/api/queries/Team/MemberQueries'
import { fetchAllAssignedProjects } from '@src/lib/api/queries/Project/ProjectQuerys'

export const metadata: Metadata = {
  title: 'Budget | Mirama',
  description: 'Management of Project Budgets',
}

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth()

  const projects = await fetchAllAssignedProjects()

  if (!session?.user) {
    return redirect('/auth/login?callbackUrl=/app/budget')
  }

  const fallbackData = {
    '/api/db/project': projects,
  }

  return (
    <SWRFallbackWrapper fallback={fallbackData}>{children}</SWRFallbackWrapper>
  )
}

export default Layout
