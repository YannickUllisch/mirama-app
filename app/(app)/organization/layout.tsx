import { auth } from '@auth'
import AppHeader from '@src/components/Header/AppHeader'
import AppSidebar from '@src/components/Sidebar/AppSidebar'
import { SidebarProvider } from '@src/components/ui/sidebar'
import QueryClientWrapper from '@src/components/Wrappers/QueryClientWrapper'
import SessionWrapper from '@src/components/Wrappers/SessionWrapper'
import { OrganizationSidebarMenu } from '@src/lib/sidebarMenu'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'App Dashboard',
}

const AppLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth()

  if (!session) {
    return redirect('/auth/login?callbackUrl=/organization')
  }

  // Guard against incorrect JWT context for accesssing specific org
  if (!session.user.organizationId || !session.user.orgRole) {
    return redirect(`/tenant/${session.user.tenantId}`)
  }

  return (
    <SessionWrapper>
      <QueryClientWrapper>
        <SidebarProvider>
          <div className="w-full flex flex-col">
            <AppHeader />

            <div className="flex flex-1 pt-14">
              <AppSidebar
                menuItems={OrganizationSidebarMenu}
                roleType="org"
                session={session}
                className="flex-shrink-0"
              />

              <main className="flex-1 overflow-auto bg-card rounded-lg">
                <div className="p-5">{children}</div>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </QueryClientWrapper>
    </SessionWrapper>
  )
}
export default AppLayout
