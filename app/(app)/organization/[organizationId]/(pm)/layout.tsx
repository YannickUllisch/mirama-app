// app/(app)/organization/[organizationId]/(pm)/layout.tsx
import { auth } from '@auth'
import AppHeader from '@src/components/Header/AppHeader'
import OrganizationSidebar from '@src/components/Sidebar/OrganizationSidebar'
import SidebarProjectsServer from '@src/components/Sidebar/SidebarProjectsServer'
import SidebarProjectsSkeleton from '@src/components/Skeletons/SidebarProjectsSkeleton'
import { SidebarInset, SidebarProvider } from '@src/components/ui/sidebar'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

const ShellLayout = async ({
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
  )
}

export default ShellLayout
