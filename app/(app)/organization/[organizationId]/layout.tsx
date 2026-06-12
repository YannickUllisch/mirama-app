import { auth } from '@auth'
import AppHeader from '@src/components/Header/AppHeader'
import OrganizationSidebar from '@src/components/Sidebar/OrganizationSidebar'
import SidebarProjectsServer from '@src/components/Sidebar/SidebarProjectsServer'
import SidebarProjectsSkeleton from '@src/components/Skeletons/SidebarProjectsSkeleton'
import { SidebarInset, SidebarProvider } from '@src/components/ui/sidebar'
import QueryClientWrapper from '@src/components/Wrappers/QueryClientWrapper'
import SessionWrapper from '@src/components/Wrappers/SessionWrapper'
import { ThemeProvider } from '@src/components/Wrappers/ThemeProvider'
import PermissionGate from '@src/modules/tenant/iam/PermissionGate'
import { OrganizationResourceProvider } from '@src/modules/tenant/organization/organizationResourceContext'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

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
              <SidebarProvider className="h-screen overflow-hidden">
                <OrganizationSidebar
                  tenantId={session.user.tenantId}
                  organizationId={organizationId}
                  className="shrink-0"
                  projectsSlot={
                    <Suspense fallback={<SidebarProjectsSkeleton />}>
                      <SidebarProjectsServer
                        organizationId={organizationId}
                        tenantId={session.user.tenantId}
                      />
                    </Suspense>
                  }
                />
                <SidebarInset className="overflow-hidden">
                  <AppHeader />
                  <main className="flex-1 overflow-y-auto bg-card rounded-l-lg">
                    <div className="p-5 min-h-full">{children}</div>
                  </main>
                </SidebarInset>
              </SidebarProvider>
            </ThemeProvider>
          </PermissionGate>
        </OrganizationResourceProvider>
      </QueryClientWrapper>
    </SessionWrapper>
  )
}
export default AppLayout
