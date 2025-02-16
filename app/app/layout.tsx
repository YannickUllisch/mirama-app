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
          <div className="flex min-h-screen w-full">
            <AppSidebar
              projects={projects}
              user={user}
              session={session}
              className="bg-inherit flex-shrink-0"
              team={null}
            />
            <div className="flex-1 overflow-hidden h-[100vh]">
              <AppHeader />
              <main className="flex flex-col h-[100vh] overflow-y-auto w-full rounded-lg border border-hover overflow-auto">
                <div className="bg-white dark:bg-neutral-900 flex-1 px-6 pt-5">
                  {children}
                </div>
              </main>
              {/* <Footer /> */}
            </div>
          </div>
        </SidebarProvider>
      </SwrProvider>
    </SessionWrapper>
  )
}
export default AppLayout
