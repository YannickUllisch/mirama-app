import { auth } from '@auth'
import AppHeader from '@src/components/Header/AppHeader'
import OrganizationSidebar from '@src/components/Sidebar/OrganizationSidebar'
import { SidebarProvider } from '@src/components/ui/sidebar'
import QueryClientWrapper from '@src/components/Wrappers/QueryClientWrapper'
import SessionWrapper from '@src/components/Wrappers/SessionWrapper'
import { ThemeProvider } from '@src/components/Wrappers/ThemeProvider'
import { OrganizationResourceProvider } from '@src/modules/organization/organizationResourceContext'
import PermissionGate from '@src/modules/shared/permissions/PermissionGate'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'App Dashboard',
}

const AppLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ organizationId: string }>
}) => {
  const session = await auth()
  const { organizationId } = await params

  if (!session?.user.tenantId) {
    redirect('/auth/login')
  }

  return (
    <SessionWrapper>
      <QueryClientWrapper>
        <OrganizationResourceProvider
          value={{
            activeOrganizationId: organizationId,
            activeTenantId: session?.user.tenantId ?? '',
          }}
        >
          <PermissionGate organizationId={organizationId}>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              <SidebarProvider>
                <div className="w-full flex flex-col">
                  <AppHeader />

                  <div className="flex flex-1 pt-14">
                    <OrganizationSidebar
                      tenantId={session.user.tenantId}
                      organizationId={organizationId}
                      className="shrink-0"
                    />

                    <main className="flex-1 overflow-auto bg-card rounded-lg">
                      <div className="p-5 min-h-screen">{children}</div>
                    </main>
                  </div>
                </div>
              </SidebarProvider>
            </ThemeProvider>
          </PermissionGate>
        </OrganizationResourceProvider>
      </QueryClientWrapper>
    </SessionWrapper>
  )
}
export default AppLayout
