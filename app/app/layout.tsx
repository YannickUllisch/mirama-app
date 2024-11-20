import { Suspense } from 'react'
import Loading from '../loading'
import SessionWrapper from '@src/components/SessionWrapper'
import AppHeader from '@src/components/Header/AppHeader'
import type { Metadata } from 'next'
import SwrProvider from '@src/components/SwrProvider'
import Footer from '@src/components/Footer/Footer'
import { auth } from '@auth'
import { SidebarInset, SidebarProvider } from '@src/components/ui/sidebar'
import AppSidebar from '@src/components/Sidebar/AppSidebar'
import { redirect } from 'next/navigation'
import { fetchAllAssignedProjects } from '@src/lib/api/queries/Project/ProjectQuerys'
import { getUserById } from '@src/lib/api/queries/User/UserQueries'
import { fetchSessionTeam } from '@src/lib/api/queries/Team/TeamQueries'
import SWRFallbackWrapper from '@src/components/SWRFallbackWrapper'

export const metadata: Metadata = {
  title: 'App Dashboard | Mirama',
  description: 'App Dashboard',
}

const AppLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth()
  const user = await getUserById(session?.user.id ?? 'undefined')

  if (!session || !user) {
    return redirect('/auth/login?callbackUrl=/app')
  }

  const team = await fetchSessionTeam(session)

  const projects = await fetchAllAssignedProjects(false)

  const fallbackData = {
    '/api/db/project': projects,
  }

  return (
    <SessionWrapper>
      <SwrProvider>
        <SWRFallbackWrapper fallback={fallbackData}>
          <SidebarProvider>
            <AppSidebar
              projects={projects}
              user={user}
              session={session}
              className="bg-neutral-950"
              team={team}
            />
            <SidebarInset>
              <div className="m-2 flex flex-col p-1 rounded-lg shadow-sm dark:shadow-neutral-900 bg-white dark:bg-neutral-900 border border-hover">
                <AppHeader />
                <div className="flex-1 px-6 pt-5 min-h-[1000px]">
                  <Suspense fallback={<Loading />}>{children}</Suspense>
                </div>
                <Footer />
              </div>
            </SidebarInset>
          </SidebarProvider>
        </SWRFallbackWrapper>
      </SwrProvider>
    </SessionWrapper>
  )
}
export default AppLayout
