import type { Metadata } from 'next'
import { auth } from '@auth'
import SWRFallbackWrapper from '@src/components/SWRFallbackWrapper'
import { redirect } from 'next/navigation'
import { fetchAllAssignedProjects } from '@src/lib/api/queries/Project/ProjectQuerys'

export const metadata: Metadata = {
  title: 'Archived Projects | Mirama',
  description: 'View of all archived projects',
}

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth()

  const archivedProjects = await fetchAllAssignedProjects(true)

  if (!session?.user) {
    return redirect('/auth/login?callbackUrl=/app/archive')
  }

  const fallbackData = {
    '/api/db/project?archived=true': archivedProjects,
  }

  return (
    <SWRFallbackWrapper fallback={fallbackData}>{children}</SWRFallbackWrapper>
  )
}

export default Layout
