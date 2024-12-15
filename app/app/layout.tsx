import { Suspense } from 'react'
import Loading from '../loading'
import SessionWrapper from '@src/components/Wrappers/SessionWrapper'
import AppHeader from '@src/components/Header/AppHeader'
import type { Metadata } from 'next'
import SwrProvider from '@src/components/Wrappers/SwrProvider'
import Footer from '@src/components/Footer/Footer'
import { auth } from '@auth'
import { SidebarInset, SidebarProvider } from '@src/components/ui/sidebar'
import AppSidebar from '@src/components/Sidebar/AppSidebar'
import { redirect } from 'next/navigation'
import { fetchAllAssignedProjectsDynamicInclude } from '@src/lib/api/queries/Project/ProjectQuerys'
import { getUserById } from '@src/lib/api/queries/User/UserQueries'
import { fetchSessionTeam } from '@src/lib/api/queries/Team/TeamQueries'
import SWRFallbackWrapper from '@src/components/Wrappers/SWRFallbackWrapper'
import {
  gridProjectsinclude,
  sidebarProjectsInclude,
  tableProjectsInclude,
} from './shared'
import { fetchAllTeamMembers } from '@src/lib/api/queries/Team/MemberQueries'
import type { Project, Task } from '@prisma/client'

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

  // Fetching projects with different include relations for fallback in tabs.
  const gridProjects = await fetchAllAssignedProjectsDynamicInclude(
    false,
    gridProjectsinclude,
  )
  const tableProjects = await fetchAllAssignedProjectsDynamicInclude(
    false,
    tableProjectsInclude,
  )
  const sidebarProjects = await fetchAllAssignedProjectsDynamicInclude(
    false,
    sidebarProjectsInclude,
  )

  const users = await fetchAllTeamMembers(session)

  const fallbackData = {
    '#url:"/api/db/project",include:#users:true,,archived:false,':
      tableProjects,
    '#url:"/api/db/project",include:#users:#user:true,,,archived:false,':
      gridProjects,
    '/api/db/team/member': users,
  }

  return (
    <SessionWrapper>
      <SwrProvider>
        <SWRFallbackWrapper fallback={fallbackData}>
          <SidebarProvider>
            <AppSidebar
              projects={sidebarProjects as (Project & { tasks: Task[] })[]}
              user={user}
              session={session}
              className="bg-neutral-950"
              team={team}
            />
            <SidebarInset>
              <div className="m-2 flex flex-col p-1 rounded-lg shadow-sm dark:shadow-neutral-900 bg-white dark:bg-neutral-900 border border-hover">
                <AppHeader session={session} />
                <div className="flex-1 px-6 pt-5 min-h-screen">
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
