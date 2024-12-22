import type { Metadata } from 'next'
import { auth } from '@auth'
import SWRFallbackWrapper from '@src/components/Wrappers/SWRFallbackWrapper'
import { redirect } from 'next/navigation'
import { fetchAllAssignedProjects } from '@src/lib/api/queries/Project/ProjectQuerys'

export const metadata: Metadata = {
  title: 'Calendar | Mirama',
  description: 'Calendar view of your projects',
}

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth()

  const projects = await fetchAllAssignedProjects(false)

  if (!session?.user) {
    return redirect('/auth/login?callbackUrl=/app/calendar')
  }

  const fallbackData = {
    '/api/db/project?archived=false': projects,
  }

  return (
    <SWRFallbackWrapper fallback={fallbackData}>{children}</SWRFallbackWrapper>
  )
}

export default Layout
