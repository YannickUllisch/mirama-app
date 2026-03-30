import { auth } from '@auth'
import AppHeader from '@src/components/Header/AppHeader'
import AppSidebar from '@src/components/Sidebar/AppSidebar'
import QueryClientWrapper from '@src/components/Wrappers/QueryClientWrapper'
import SessionWrapper from '@src/components/Wrappers/SessionWrapper'
import { TenantResourceProvider } from '@src/core/tenant/tenantResourceContext'
import { TenantSidebarMenu } from '@src/core/tenant/tenantSidebarMenu'
import { SidebarProvider } from '@ui/sidebar'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Tenant Overview',
  description: 'Your Tenant Dashboard',
}

const TenantLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ tenantId: string }>
}) => {
  const session = await auth()
  const { tenantId } = await params

  if (!session) {
    return redirect(`/auth/login?callbackUrl=/tenant/${tenantId}`)
  }

  return (
    <SessionWrapper>
      <QueryClientWrapper>
        <TenantResourceProvider value={{ activeTenantId: tenantId }}>
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
                  <div className="p-5 min-h-[100vh]">{children}</div>
                </main>
              </div>
            </div>
          </SidebarProvider>
        </TenantResourceProvider>
      </QueryClientWrapper>
    </SessionWrapper>
  )
}

export default TenantLayout
