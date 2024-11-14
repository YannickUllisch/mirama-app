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
  const projects = await fetchAllAssignedProjects()

  return (
    <SessionWrapper>
      <SwrProvider>
        <SidebarProvider>
          <AppSidebar projects={projects} user={user} />
          <SidebarInset>
            <AppHeader session={session} />
            <div className="flex-1 p-6 min-h-[700px]">
              <Suspense fallback={<Loading />}>{children}</Suspense>
            </div>
            <Footer />
          </SidebarInset>
        </SidebarProvider>
      </SwrProvider>
    </SessionWrapper>
  )
}

export default AppLayout
