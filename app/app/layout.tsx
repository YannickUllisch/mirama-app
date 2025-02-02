import SessionWrapper from '@src/components/Wrappers/SessionWrapper'
import AppHeader from '@src/components/Header/AppHeader'
import type { Metadata } from 'next'
import SwrProvider from '@src/components/Wrappers/SwrProvider'
import Footer from '@src/components/Footer/Footer'
import { auth } from '@auth'
import { SidebarInset, SidebarProvider } from '@src/components/ui/sidebar'
import AppSidebar from '@src/components/Sidebar/AppSidebar'
import { redirect } from 'next/navigation'
import db from '@db'
import { isTeamAdminOrOwner } from '@src/lib/utils'

export const metadata: Metadata = {
  title: 'App Dashboard | Mirama',
  description: 'App Dashboard',
}

const AppLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth()

  const userQ = db.user.findUnique({
    where: { id: session?.user.id ?? 'undef' },
  })

  const projectQ = db.project.findMany({
    where: {
      teamId: session?.user.teamId,
      archived: false,
      users: {
        some: {
          userId: isTeamAdminOrOwner(session) ? undefined : session?.user.id,
        },
      },
    },
    include: {
      tasks: true,
    },
  })

  const [user, projects] = await Promise.all([userQ, projectQ])

  if (!session || !user) {
    return redirect('/auth/login?callbackUrl=/app')
  }

  return (
    <SessionWrapper>
      <SwrProvider>
        <SidebarProvider>
          <AppSidebar
            projects={projects}
            user={user}
            session={session}
            className="bg-neutral-950"
            team={null}
          />
          <SidebarInset>
            <div className="m-2 flex flex-col p-1 rounded-lg shadow-sm dark:shadow-neutral-900 bg-white dark:bg-neutral-900 border border-hover">
              <AppHeader />
              <div className="flex-1 px-6 pt-5 min-h-screen">{children}</div>
              <Footer />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </SwrProvider>
    </SessionWrapper>
  )
}
export default AppLayout
