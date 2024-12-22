import type { Metadata } from 'next'
import { auth } from '@auth'
import SWRFallbackWrapper from '@src/components/Wrappers/SWRFallbackWrapper'
import { redirect } from 'next/navigation'
import { fetchAllPersonalTasks } from '@src/lib/api/queries/Tasks/PersonalTaskQueries'

export const metadata: Metadata = {
  title: 'Personal Tasks | Mirama',
  description: 'Overview of Personal Tasks',
}

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth()

  const tasks = await fetchAllPersonalTasks(session)

  if (!session?.user) {
    return redirect('/auth/login?callbackUrl=/app/tasks')
  }

  const fallbackData = {
    '/api/db/task/personal': tasks,
  }

  return (
    <SWRFallbackWrapper fallback={fallbackData}>{children}</SWRFallbackWrapper>
  )
}

export default Layout
