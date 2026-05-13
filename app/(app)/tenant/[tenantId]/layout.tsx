// app/(app)/tenant/[tenantId]/layout.tsx
import AppHeader from '@src/components/Header/AppHeader'
import TenantSidebar from '@src/components/Sidebar/TenantSidebar'
import QueryClientWrapper from '@src/components/Wrappers/QueryClientWrapper'
import SessionWrapper from '@src/components/Wrappers/SessionWrapper'
import { ThemeProvider } from '@src/components/Wrappers/ThemeProvider'
import { TenantResourceProvider } from '@src/modules/tenant/tenantResourceContext'
import { SidebarInset, SidebarProvider } from '@ui/sidebar'
import type { Metadata } from 'next'

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
  const { tenantId } = await params

  return (
    <SessionWrapper>
      <QueryClientWrapper>
        <TenantResourceProvider value={{ activeTenantId: tenantId }}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <SidebarProvider className="h-screen overflow-hidden">
              <TenantSidebar tenantId={tenantId} className="shrink-0" />
              <SidebarInset className="overflow-hidden">
                <AppHeader />
                <main className="flex-1 overflow-y-auto bg-card rounded-l-lg">
                  <div className="min-h-full">{children}</div>
                </main>
              </SidebarInset>
            </SidebarProvider>
          </ThemeProvider>
        </TenantResourceProvider>
      </QueryClientWrapper>
    </SessionWrapper>
  )
}

export default TenantLayout
