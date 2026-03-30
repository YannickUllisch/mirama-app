import { auth } from '@auth'
import AppHeader from '@src/components/Header/AppHeader'
import AppSidebar from '@src/components/Sidebar/AppSidebar'
import QueryClientWrapper from '@src/components/Wrappers/QueryClientWrapper'
import SessionWrapper from '@src/components/Wrappers/SessionWrapper'
import { TenantSidebarMenu } from '@src/lib/tenantSidebarMenu'
import { SidebarProvider } from '@ui/sidebar'
import { redirect } from 'next/navigation'

const TenantLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth()

  if (!session) {
    return redirect('/auth/login?callbackUrl=/tenant')
  }

  return (
    <SessionWrapper>
      <QueryClientWrapper>
        <SidebarProvider>
          <div className="w-full flex flex-col">
            <AppHeader />

            <div className="flex flex-1 pt-14">
              <AppSidebar
                menuItems={TenantSidebarMenu}
                roleType="tenant"
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

export default TenantLayout
