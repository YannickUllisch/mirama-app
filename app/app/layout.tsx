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

export const metadata: Metadata = {
  title: 'Projects | Mirama',
  description: 'Project and Task Management',
}

const AppLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth()
  const user = await getUserById(session?.user.id ?? 'undefined')

  if (!session || !user) {
    redirect('/')
  }
  const team = await fetchSessionTeam(session)
  if (!team) {
    // TODO: Extend Team, such that new Teams can be created and users can have multiple teams
    redirect('/')
  }
  const projects = await fetchAllAssignedProjects(false)

  return (
    <SessionWrapper>
      <SwrProvider>
        <SidebarProvider>
          <AppSidebar
            projects={projects}
            user={user}
            className="bg-neutral-950"
            team={team}
          />
          <SidebarInset>
            <div className="m-2 flex flex-col p-1 rounded-lg shadow-sm dark:shadow-neutral-900 bg-white dark:bg-neutral-900 border border-hover">
              <AppHeader />
              <div className="flex-1 p-6 min-h-[700px]">
                <Suspense fallback={<Loading />}>{children}</Suspense>
              </div>
              <Footer />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </SwrProvider>
    </SessionWrapper>
  )
}
export default AppLayout
